const {test,before} = require('node:test');
const assert = require('node:assert/strict');
const serverRequire = require('node:module').createRequire(require('node:path').resolve(__dirname,'../../server/study-korea/package.json'));
const {createOidcVerifier} = require('../../server/study-korea/oidc-verifier.cjs');
let jose,privateKey,jwks,verifier;
const issuer='https://auth.example.test',audience='student-admin',timestamp=1793001600;
const base={sub:'auth0|test-user',iss:issuer,aud:audience,iat:timestamp,exp:timestamp+600,session_id:'test-session',aal:'aal2'};
const sign=async(claims={},header={})=>new jose.SignJWT({...base,...claims}).setProtectedHeader({alg:'ES256',typ:'JWT',kid:'local-test',...header}).sign(privateKey);
before(async()=>{
 jose=await import(serverRequire.resolve('jose'));
 const keys=await jose.generateKeyPair('ES256');privateKey=keys.privateKey;
 jwks={keys:[{...await jose.exportJWK(keys.publicKey),kid:'local-test',alg:'ES256',use:'sig'}]};
 verifier=await createOidcVerifier({issuer,audience,jwks,isSessionActive:async()=>true,clock:()=>new Date(timestamp*1000)});
});
test('valid locally signed MFA token maps subject but not caller role',async()=>{
 assert.deepEqual(await verifier(await sign({role:'ADMIN'})),{subject:'auth0|test-user',assurance:'aal2'});
});
test('signature tampering and unknown kid are rejected',async()=>{
 const token=await sign();const parts=token.split('.');parts[1]=Buffer.from(JSON.stringify({...base,sub:'attacker'})).toString('base64url');
 await assert.rejects(()=>verifier(parts.join('.')));await assert.rejects(async()=>verifier(await sign({}, {kid:'unknown'})));
});
test('wrong issuer/audience, expired/future/long-lived tokens rejected',async()=>{
 for(const change of [{iss:'https://evil.test'},{aud:'other'},{exp:timestamp-1},{iat:timestamp+1},{exp:timestamp+3600},{nbf:timestamp+10}])await assert.rejects(async()=>verifier(await sign(change)));
});
test('missing claims, low MFA and wrong token type are rejected',async()=>{
 for(const change of [{session_id:undefined},{aal:'aal1'},{exp:undefined},{iat:undefined},{sub:''}])await assert.rejects(async()=>verifier(await sign(change)));
 await assert.rejects(async()=>verifier(await sign({}, {typ:'other'})));
});
test('revocation and revocation-checker errors both deny access',async()=>{
 for(const check of [async()=>false,async()=>{throw Error('provider unavailable');}]){
  const verify=await createOidcVerifier({issuer,audience,jwks,isSessionActive:check,clock:()=>new Date(timestamp*1000)});
  await assert.rejects(async()=>verify(await sign()));
 }
});
test('weak algorithms and unsafe verifier configuration are rejected',async()=>{
 const weak=await new jose.SignJWT(base).setProtectedHeader({alg:'HS256',kid:'local-test',typ:'JWT'}).sign(new Uint8Array(32));await assert.rejects(()=>verifier(weak));
 await assert.rejects(()=>createOidcVerifier({issuer:'http://auth.test',audience,jwks,isSessionActive:async()=>true}));
 await assert.rejects(()=>createOidcVerifier({issuer,audience,jwks:{keys:[{kty:'oct',k:'fake'}]},isSessionActive:async()=>true}));
});

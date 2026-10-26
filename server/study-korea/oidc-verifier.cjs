'use strict';
// jose performs the cryptographic verification. No JWKS discovery/network is automatic.
async function createOidcVerifier({issuer, audience, jwks, isSessionActive, maxTokenAgeSeconds=900, clock=()=>new Date()}) {
  const url = new URL(issuer);
  if (url.protocol!=='https:' || url.username || url.password || url.search || url.hash || typeof audience!=='string' || !audience ||
      !jwks || !Array.isArray(jwks.keys) || !jwks.keys.length || typeof isSessionActive!=='function' ||
      !Number.isInteger(maxTokenAgeSeconds) || maxTokenAgeSeconds<60 || maxTokenAgeSeconds>3600) throw new Error('Approved OIDC profile and revocation checker required');
  if (jwks.keys.some(key => Object.hasOwn(key,'d') || Object.hasOwn(key,'k') || !['RSA','EC'].includes(key.kty))) throw new Error('Public asymmetric keys only');
  const {createLocalJWKSet, jwtVerify} = await import('jose');
  const keySet = createLocalJWKSet(jwks);
  return async token => {
    if(typeof token!=='string' || token.length>8192) throw new Error('Invalid session');
    const {payload, protectedHeader} = await jwtVerify(token,keySet,{
      algorithms:['RS256','ES256'], issuer, audience, typ:'JWT',
      requiredClaims:['exp','iat','sub','iss','aud','session_id','aal'],
      maxTokenAge:maxTokenAgeSeconds, clockTolerance:0, currentDate:clock()
    });
    const now=Math.floor(clock().getTime()/1000);
    if(typeof protectedHeader.kid!=='string' || !protectedHeader.kid || protectedHeader.kid.length>128 ||
       typeof payload.sub!=='string' || payload.sub.length>128 || !payload.sub ||
       typeof payload.session_id!=='string' || !/^[A-Za-z0-9_-]{1,128}$/.test(payload.session_id) ||
       payload.aal!=='aal2' || !Number.isInteger(payload.iat) || !Number.isInteger(payload.exp) ||
       payload.iat>now || payload.exp<=payload.iat || payload.exp-payload.iat>maxTokenAgeSeconds) throw new Error('Invalid session');
    // This must use the selected provider's authoritative session-revocation source.
    // Claim values alone never establish that a session is still active.
    if(await isSessionActive({subject:payload.sub,sessionId:payload.session_id})!==true) throw new Error('Inactive session');
    return {subject:payload.sub,assurance:'aal2'};
  };
}
module.exports={createOidcVerifier};

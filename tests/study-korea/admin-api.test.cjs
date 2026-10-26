'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {createAdminHandler} = require('../../server/study-korea/admin-service.cjs');
const disabled = require('../../netlify/functions/study-korea-admin').handler;
const origin = 'https://admin.example';
const memberships = [
  {subject_id:'admin',role:'ADMIN',active:true}, {subject_id:'counselor',role:'COUNSELOR',active:true},
  {subject_id:'counselor2',role:'COUNSELOR',active:true}, {subject_id:'b2b',role:'B2B_MANAGER',active:true},
  {subject_id:'editor',role:'CONTENT_EDITOR',active:true}, {subject_id:'disabled',role:'ADMIN',active:false}
];
const initial = [
  {id:'student-1',receipt_id:'S1',type:'STUDENT',full_name:'TEST PERSON',contact_value:'+84900000000',status:'NEW',assignee_id:'counselor',version:1,payload_hmac:'DO-NOT-RETURN'},
  {id:'student-2',receipt_id:'S2',type:'STUDENT',status:'NEW',assignee_id:'counselor2',version:1},
  {id:'partner-1',receipt_id:'P1',type:'PARTNER',status:'NEW',assignee_id:'b2b',version:1}
];
function setup(options = {}) {
  let state = {leads:structuredClone(initial),members:structuredClone(memberships),notes:[],audits:[]};
  const repository = {transaction: async fn => {
    const draft=structuredClone(state);
    const tx={
      getMembership:async id=>draft.members.find(member=>member.subject_id===id),
      listLeads:async scope=>({items: options.leak ? draft.leads : draft.leads.filter(lead=>lead.type===scope.type&&(!scope.assignee_id||lead.assignee_id===scope.assignee_id)).slice(0,scope.limit),next_cursor:null}),
      getLead:async id=>draft.leads.find(lead=>lead.id===id),
      getConsentSummary:async id=>({lead_id:id,policy_version:'test-v1',required_ack:true,marketing_opt_in:false,recorded_at:'2026-10-26T00:00:00Z',internal_secret:'DO-NOT-RETURN'}),
      listNotes:async(id,limit)=>draft.notes.filter(note=>note.lead_id===id).slice(-limit),
      compareAndUpdate:async(id,version,patch)=>{if(options.conflict)return false;const lead=draft.leads.find(lead=>lead.id===id);if(lead.version!==version)return false;Object.assign(lead,patch);return true;},
      addNote:async note=>draft.notes.push({...note,id:'note-'+(draft.notes.length+1)}),
      addAudit:async audit=>{if(options.auditFailure)throw Error('PRIVATE DATABASE ERROR');draft.audits.push(audit);}
    };
    const result=await fn(tx);state=draft;return result;
  }};
  const handler=createAdminHandler({origin,repository,verifySession:async token=> {
    if(token==='bad')throw Error('PRIVATE TOKEN ERROR');
    return {subject:token,assurance:options.lowAssurance?'aal1':'aal2',role:'ADMIN'};
  },now:()=> '2026-10-26T12:00:00Z'});
  return {handler,getState:()=>state};
}
function request(actor='counselor',query={type:'STUDENT'},change) {
  return {httpMethod:change?'PATCH':'GET',headers:{authorization:'Bearer '+actor,origin,'content-type':'application/json'},queryStringParameters:change?{}:query,body:change?JSON.stringify(change):undefined};
}
const update={id:'student-1',version:1,status:'CONTACT_ATTEMPTED'};
test('production endpoint is unavailable for all direct requests with no adapters',async()=>{
  for(const httpMethod of ['GET','PATCH','POST'])assert.equal((await disabled({httpMethod})).statusCode,503);
});
test('missing/bad bearer and MFA failures never expose rows',async()=>{
  const {handler}=setup();const noToken=request();delete noToken.headers.authorization;
  assert.equal((await handler(noToken)).statusCode,401);assert.equal((await handler(request('bad'))).statusCode,401);
  assert.equal((await setup({lowAssurance:true}).handler(request())).statusCode,403);
});
test('membership, not claimed role, denies editor/inactive/unknown principals',async()=>{
  const {handler}=setup();for(const actor of ['editor','disabled','unknown'])assert.equal((await handler(request(actor))).statusCode,403);
});
test('list scope is typed and assigned; list contains no contacts or secrets',async()=>{
  const {handler}=setup();const response=await handler(request());assert.equal(response.statusCode,200);
  const body=JSON.parse(response.body);assert.equal(body.items.length,1);assert.equal(body.items[0].id,'student-1');
  assert(!response.body.includes('TEST PERSON'));assert(!response.body.includes('+849'));assert(!response.body.includes('DO-NOT-RETURN'));
  assert.equal((await handler(request('b2b',{type:'STUDENT'}))).statusCode,403);
  assert.equal((await handler(request('counselor',{type:'PARTNER'}))).statusCode,403);
  assert.equal((await handler(request('admin',{}))).statusCode,400);
});
test('detail access prevents IDOR and whitelists data and consent',async()=>{
  const {handler}=setup();for(const id of ['student-2','partner-1','missing'])assert.equal((await handler(request('counselor',{id}))).statusCode,404);
  const allowed=await handler(request('counselor',{id:'student-1'}));assert.equal(allowed.statusCode,200);assert(allowed.body.includes('TEST PERSON'));assert(!allowed.body.includes('DO-NOT-RETURN'));
  assert.equal(allowed.headers['Cache-Control'],'no-store');
});
test('malicious request shapes, origin, limits and unknown fields rejected',async()=>{
  const {handler}=setup();const foreign=request('admin',{},update);foreign.headers.origin='https://evil.example';assert.equal((await handler(foreign)).statusCode,403);
  const media=request('admin',{},update);media.headers['content-type']='text/plain';assert.equal((await handler(media)).statusCode,415);
  const large=request('admin',{},update);large.body='x'.repeat(8001);assert.equal((await handler(large)).statusCode,413);
  assert.equal((await handler(request('admin',{type:'STUDENT',limit:'999'}))).statusCode,400);
  assert.equal((await handler(request('admin',{type:'STUDENT',role:'ADMIN'}))).statusCode,400);
  for(const change of [{...update,full_name:'illegal'}, {...update,note:''}, {...update,note:'x'.repeat(1001)}, {...update,status:'QUALIFIED'}, {...update,status:'__proto__'}])assert.equal((await handler(request('admin',{},change))).statusCode,400);
});
test('state update, note and minimal audit commit together',async()=>{
  const {handler,getState}=setup();const result=await handler(request('counselor',{}, {...update,note:'TEST NOTE'}));assert.equal(result.statusCode,200);
  const state=getState();assert.equal(state.leads[0].version,2);assert.equal(state.notes.length,1);assert.equal(state.audits.length,1);
  assert.equal(state.audits[0].actor_subject,'counselor');assert(!JSON.stringify(state.audits).includes('TEST NOTE'));
  assert(!result.body.includes('TEST NOTE'));
  const detail=JSON.parse((await handler(request('counselor',{id:'student-1'}))).body);assert.equal(detail.notes[0].note,'TEST NOTE');
});
test('assignment is ADMIN-only and limited to active same-type assignee',async()=>{
  const {handler,getState}=setup();assert.equal((await handler(request('counselor',{}, {...update,assignee_id:'counselor2'}))).statusCode,403);
  for(const assignee_id of ['b2b','disabled','unknown'])assert.equal((await handler(request('admin',{}, {...update,assignee_id}))).statusCode,400);
  assert.equal((await handler(request('admin',{}, {...update,assignee_id:'counselor2'}))).statusCode,200);
  assert.equal((await handler(request('counselor',{id:'student-1'}))).statusCode,404);
  assert.equal(getState().audits[0].to_assignee,'counselor2');
});
test('stale version and atomic compare failure leave data unchanged',async()=>{
  for(const options of [{},{conflict:true}]){const {handler,getState}=setup(options);const change=options.conflict?update:{...update,version:2};assert.equal((await handler(request('admin',{},change))).statusCode,409);assert.equal(getState().leads[0].version,1);assert.equal(getState().audits.length,0);}
});
test('audit failure rolls back update and note; provider error is not leaked',async()=>{
  const {handler,getState}=setup({auditFailure:true});const response=await handler(request('admin',{}, {...update,note:'TEST NOTE'}));assert.equal(response.statusCode,503);assert(!response.body.includes('PRIVATE'));assert.equal(getState().notes.length,0);assert.equal(getState().leads[0].version,1);
});
test('faulty list adapter is blocked rather than leaking other records',async()=>{
  const response=await setup({leak:true}).handler(request());assert.equal(response.statusCode,503);assert(!response.body.includes('partner-1'));
});
test('membership revocation is checked on every subsequent request',async()=>{
  const {handler,getState}=setup();assert.equal((await handler(request())).statusCode,200);getState().members.find(member=>member.subject_id==='counselor').active=false;assert.equal((await handler(request())).statusCode,403);
});

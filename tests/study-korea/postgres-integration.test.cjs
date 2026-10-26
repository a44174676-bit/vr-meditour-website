'use strict';
// Fixed, disposable loopback database ONLY. Never accepts a production URL or env override.
const {test,before,after} = require('node:test');
const assert = require('node:assert/strict');
const {randomUUID} = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const {Pool} = require('../../server/study-korea/node_modules/pg');
const {createPostgresRepository} = require('../../server/study-korea/postgres-repository.cjs');
const {createAdminHandler} = require('../../server/study-korea/admin-service.cjs');
const pool = new Pool({host:'127.0.0.1',port:55432,user:'fixture_owner',password:'fixture-only-password',database:'student_adapter_test',max:8,connectionTimeoutMillis:3000});
const repo = createPostgresRepository(pool);
const handler = createAdminHandler({origin:'https://admin.example',repository:repo,verifySession:async token=>({subject:token,assurance:'aal2'})});
const request = (actor,id,change) => ({httpMethod:change?'PATCH':'GET',headers:{authorization:'Bearer '+actor,origin:'https://admin.example','content-type':'application/json'},queryStringParameters:change?{}:{id},body:change?JSON.stringify({id,version:1,...change}):undefined});
async function seed() {
 const id=randomUUID();
 await pool.query(`INSERT INTO student_korea_private.leads
 (id,receipt_id,submission_id,payload_hmac,type,full_name,contact_method,contact_value,country,program,age_ack,locale,assignee_id,retention_policy_version,delete_after)
 VALUES ($1,$2,$3,'fixture-only','STUDENT','FIXTURE ONLY','phone','+84900000000','VN','D4',true,'vi','counselor','fixture-only',CURRENT_TIMESTAMP + INTERVAL '1 day')`,[id,'TEST-'+id,randomUUID()]);
 await pool.query(`INSERT INTO student_korea_private.consent_records(id,lead_id,policy_version,required_ack) VALUES($1,$2,'fixture-only',true)`,[randomUUID(),id]);
 return id;
}
before(async()=>{
 const identity=(await pool.query('SELECT current_database() AS db, current_user AS usr')).rows[0];
 assert.equal(identity.db,'student_adapter_test');assert.equal(identity.usr,'fixture_owner');
 await pool.query(fs.readFileSync(path.resolve(__dirname,'../../docs/study-korea-data-model.sql'),'utf8'));
 await pool.query(`INSERT INTO student_korea_private.admin_memberships(subject_id,role,active)
 VALUES ('admin','ADMIN',true),('counselor','COUNSELOR',true),('other','COUNSELOR',true),('b2b','B2B_MANAGER',true)`);
});
after(async()=>{await pool.end();});
test('real PostgreSQL commits lead, note and audit and serves consent detail',async()=>{
 const id=await seed();const response=await handler(request('counselor',id,{status:'CONTACT_ATTEMPTED',note:'FIXTURE NOTE'}));assert.equal(response.statusCode,200);
 const row=(await pool.query('SELECT status,version FROM student_korea_private.leads WHERE id=$1',[id])).rows[0];assert.equal(row.status,'CONTACT_ATTEMPTED');assert.equal(row.version,2);
 const detail=JSON.parse((await handler(request('counselor',id))).body);assert.equal(detail.notes[0].note,'FIXTURE NOTE');assert.equal(detail.consent.required_ack,true);
 assert.equal((await handler(request('other',id))).statusCode,404);
});
test('two simultaneous PATCHes with one version yield exactly one commit',async()=>{
 const id=await seed();const results=await Promise.all([handler(request('counselor',id,{status:'CONTACT_ATTEMPTED'})),handler(request('counselor',id,{status:'CONTACT_ATTEMPTED'}))]);
 assert.deepEqual(results.map(result=>result.statusCode).sort(),[200,409]);
 assert.equal((await pool.query('SELECT count(*)::int AS n FROM student_korea_private.admin_audit WHERE lead_id=$1',[id])).rows[0].n,1);
});
test('database audit trigger failure rolls back both update and note',async()=>{
 const id=await seed();
 await pool.query("CREATE FUNCTION student_korea_private.reject_audit_fixture() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'fixture failure'; END $$");
 await pool.query('CREATE TRIGGER reject_audit_fixture BEFORE INSERT ON student_korea_private.admin_audit FOR EACH ROW EXECUTE FUNCTION student_korea_private.reject_audit_fixture()');
 try {
  const response=await handler(request('counselor',id,{status:'CONTACT_ATTEMPTED',note:'ROLLBACK FIXTURE'}));assert.equal(response.statusCode,503);assert(!response.body.includes('fixture failure'));
  assert.equal((await pool.query('SELECT version FROM student_korea_private.leads WHERE id=$1',[id])).rows[0].version,1);
  assert.equal((await pool.query('SELECT count(*)::int AS n FROM student_korea_private.counseling_notes WHERE lead_id=$1',[id])).rows[0].n,0);
 }finally{await pool.query('DROP TRIGGER reject_audit_fixture ON student_korea_private.admin_audit');await pool.query('DROP FUNCTION student_korea_private.reject_audit_fixture()');}
});
test('membership revocation takes effect on the next request',async()=>{
 const id=await seed();await pool.query("UPDATE student_korea_private.admin_memberships SET active=false WHERE subject_id='counselor'");
 try {assert.equal((await handler(request('counselor',id))).statusCode,403);}finally{await pool.query("UPDATE student_korea_private.admin_memberships SET active=true WHERE subject_id='counselor'");}
});
test('keyset pagination is bounded and does not repeat records',async()=>{
 await seed();await seed();
 const page1=await repo.transaction(tx=>tx.listLeads({type:'STUDENT',assignee_id:'counselor',limit:2,cursor:null}));assert.equal(page1.items.length,2);assert(page1.next_cursor);
 const page2=await repo.transaction(tx=>tx.listLeads({type:'STUDENT',assignee_id:'counselor',limit:2,cursor:page1.next_cursor}));assert(page2.items.every(row=>!page1.items.some(previous=>previous.id===row.id)));
});
test('unprivileged SQL role has no rows or write permission under default-deny RLS',async()=>{
 await pool.query('CREATE ROLE fixture_restricted NOLOGIN');
 await pool.query('GRANT USAGE ON SCHEMA student_korea_private TO fixture_restricted');
 await pool.query('GRANT SELECT, UPDATE ON student_korea_private.leads TO fixture_restricted');
 const client=await pool.connect();
 try {
  await client.query('SET ROLE fixture_restricted');
  assert.equal((await client.query('SELECT count(*)::int AS n FROM student_korea_private.leads')).rows[0].n,0);
  assert.equal((await client.query("UPDATE student_korea_private.leads SET full_name='UNAUTHORIZED'")).rowCount,0);
 }finally{await client.query('RESET ROLE');client.release();}
});

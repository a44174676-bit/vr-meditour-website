import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fixtures, staff, canAccess, updateInquiry } from '../../dev-tools/study-korea-admin/model.mjs';
const supervisor = staff.find(actor => actor.id === 'supervisor');
const student = staff.find(actor => actor.id === 'student-admin');
const record = fixtures()[0];
test('anonymous, inactive and other type administrators cannot read a record', () => {
  assert.equal(canAccess(null, record), false);
  assert.equal(canAccess(staff.find(actor => actor.id === 'inactive-admin'), record), false);
  assert.equal(canAccess(staff.find(actor => actor.id === 'partner-admin'), record), false);
  assert.equal(canAccess(student, record), true);
});
test('only supervisor assigns to an active matching department', () => {
  const change = { version: 1, status: 'CONTACT_ATTEMPTED', assigneeId: 'student-admin-2' };
  assert.throws(() => updateInquiry(record, change, student), /forbidden/);
  const updated = updateInquiry(record, change, supervisor);
  assert.equal(updated.assigneeId, 'student-admin-2');
  assert.equal(canAccess(student, updated), false);
  for (const assigneeId of ['partner-admin','inactive-admin','missing']) {
    assert.throws(() => updateInquiry(record, {...change, assigneeId}, supervisor), /invalid_assignee/);
  }
});
test('state transitions and optimistic concurrency are validated', () => {
  const change = {version:1, status:'CONTACT_ATTEMPTED', assigneeId:record.assigneeId};
  const updated = updateInquiry(record, change, student);
  assert.equal(updated.version,2);
  assert.throws(() => updateInquiry(updated, change, student),/conflict/);
  assert.throws(() => updateInquiry(record,{...change,status:'QUALIFIED'},student),/invalid_transition/);
  assert.throws(() => updateInquiry(record,{...change,status:'invented'},student),/invalid_status/);
  assert.equal(record.status,'NEW');
});

test('content editor has no lead access',()=>{assert.equal(canAccess(staff.find(actor=>actor.role==='CONTENT_EDITOR'),record),false);});

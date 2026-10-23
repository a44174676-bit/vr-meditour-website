// Local simulation only. An API must derive actors from verified server sessions.
export const statuses = ['NEW', 'CONTACT_ATTEMPTED', 'CONTACTED', 'CONSULTING', 'QUALIFIED', 'CLOSED'];
export const staff = [
  { id: 'student-admin', role: 'COUNSELOR', active: true },
  { id: 'partner-admin', role: 'B2B_MANAGER', active: true },
  { id: 'student-admin-2', role: 'COUNSELOR', active: true },
  { id: 'partner-admin-2', role: 'B2B_MANAGER', active: true },
  { id: 'supervisor', role: 'ADMIN', active: true },
  { id: 'content-editor', role: 'CONTENT_EDITOR', active: true },
  { id: 'inactive-admin', role: 'COUNSELOR', active: false }
];
const transitions = { NEW:['CONTACT_ATTEMPTED','CLOSED'], CONTACT_ATTEMPTED:['CONTACTED','CLOSED'], CONTACTED:['CONSULTING','CLOSED'], CONSULTING:['QUALIFIED','CLOSED'], QUALIFIED:['CLOSED'], CLOSED:[] };
export function canAccess(actor, inquiry) {
  return actor?.active === true && (actor.role === 'ADMIN' ||
    (actor.role === 'COUNSELOR' && inquiry.kind === 'student' && inquiry.assigneeId === actor.id) ||
    (actor.role === 'B2B_MANAGER' && inquiry.kind === 'partner' && inquiry.assigneeId === actor.id));
}
export function updateInquiry(inquiry, change, actor, directory = staff) {
  if (!canAccess(actor, inquiry)) throw new Error('forbidden');
  if (change.version !== inquiry.version) throw new Error('conflict');
  if (!statuses.includes(change.status)) throw new Error('invalid_status');
  if (change.status !== inquiry.status && !transitions[inquiry.status].includes(change.status)) throw new Error('invalid_transition');
  if (change.assigneeId !== inquiry.assigneeId) {
    if (actor.role !== 'ADMIN') throw new Error('forbidden');
    const target = directory.find(item => item.id === change.assigneeId);
    const targetRole = inquiry.kind === 'student' ? 'COUNSELOR' : 'B2B_MANAGER';
    if (!target || !target.active || target.role !== targetRole) throw new Error('invalid_assignee');
  }
  return { ...inquiry, status: change.status, assigneeId: change.assigneeId, version: inquiry.version + 1, updatedAt: new Date().toISOString(), updatedBy: actor.id };
}
export function fixtures() {
  return [
    { id: 'DEMO-S01', kind: 'student', status: 'NEW', assigneeId: 'student-admin', version: 1, updatedAt: '2026-10-24T00:00:00Z' },
    { id: 'DEMO-S02', kind: 'student', status: 'CONTACTED', assigneeId: 'student-admin', version: 1, updatedAt: '2026-10-24T00:00:00Z' },
    { id: 'DEMO-P01', kind: 'partner', status: 'CONSULTING', assigneeId: 'partner-admin', version: 1, updatedAt: '2026-10-24T00:00:00Z' },
    { id: 'DEMO-P02', kind: 'partner', status: 'QUALIFIED', assigneeId: 'partner-admin', version: 1, updatedAt: '2026-10-24T00:00:00Z' }
  ];
}

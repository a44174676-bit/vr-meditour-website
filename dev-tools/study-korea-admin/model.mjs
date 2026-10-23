// Local simulation only. An API must derive actors from verified server sessions.
export const statuses = ['new', 'reviewing', 'waiting', 'completed', 'closed'];
export const staff = [
  { id: 'student-admin', role: 'student_admin', active: true },
  { id: 'partner-admin', role: 'partner_admin', active: true },
  { id: 'student-admin-2', role: 'student_admin', active: true },
  { id: 'partner-admin-2', role: 'partner_admin', active: true },
  { id: 'supervisor', role: 'supervisor', active: true },
  { id: 'inactive-admin', role: 'student_admin', active: false }
];
const transitions = {
  new: ['reviewing', 'closed'], reviewing: ['waiting', 'completed', 'closed'],
  waiting: ['reviewing', 'closed'], completed: ['reviewing', 'closed'], closed: []
};
export function canAccess(actor, inquiry) {
  return actor?.active === true && (actor.role === 'supervisor' ||
    (actor.role === 'student_admin' && inquiry.kind === 'student' && inquiry.assigneeId === actor.id) ||
    (actor.role === 'partner_admin' && inquiry.kind === 'partner' && inquiry.assigneeId === actor.id));
}
export function updateInquiry(inquiry, change, actor, directory = staff) {
  if (!canAccess(actor, inquiry)) throw new Error('forbidden');
  if (change.version !== inquiry.version) throw new Error('conflict');
  if (!statuses.includes(change.status)) throw new Error('invalid_status');
  if (change.status !== inquiry.status && !transitions[inquiry.status].includes(change.status)) throw new Error('invalid_transition');
  if (change.assigneeId !== inquiry.assigneeId) {
    if (actor.role !== 'supervisor') throw new Error('forbidden');
    const target = directory.find(item => item.id === change.assigneeId);
    const targetRole = inquiry.kind === 'student' ? 'student_admin' : 'partner_admin';
    if (!target || !target.active || target.role !== targetRole) throw new Error('invalid_assignee');
  }
  return { ...inquiry, status: change.status, assigneeId: change.assigneeId, version: inquiry.version + 1 };
}
export function fixtures() {
  return [
    { id: 'DEMO-S01', kind: 'student', status: 'new', assigneeId: 'student-admin', version: 1 },
    { id: 'DEMO-S02', kind: 'student', status: 'waiting', assigneeId: 'student-admin', version: 1 },
    { id: 'DEMO-P01', kind: 'partner', status: 'reviewing', assigneeId: 'partner-admin', version: 1 },
    { id: 'DEMO-P02', kind: 'partner', status: 'completed', assigneeId: 'partner-admin', version: 1 }
  ];
}

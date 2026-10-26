'use strict';
// Provider-independent service. Production adapters must be reviewed before wiring.
const roles = ['ADMIN', 'COUNSELOR', 'B2B_MANAGER'];
const types = ['STUDENT', 'PARTNER'];
const transitions = {
  NEW: ['CONTACT_ATTEMPTED', 'CLOSED'], CONTACT_ATTEMPTED: ['CONTACTED', 'CLOSED'],
  CONTACTED: ['CONSULTING', 'CLOSED'], CONSULTING: ['QUALIFIED', 'CLOSED'],
  QUALIFIED: ['CLOSED'], CLOSED: []
};
const idPattern = /^[A-Za-z0-9_-]{1,128}$/;
const reply = (statusCode, body) => ({statusCode, headers: {
  'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer'
}, body: JSON.stringify(body)});
class HttpError extends Error { constructor(status, code) { super(code); this.status = status; this.code = code; } }
const fail = (status, code) => { throw new HttpError(status, code); };
const accessible = (actor, lead) => lead && types.includes(lead.type) && (actor.role === 'ADMIN' ||
  (actor.role === 'COUNSELOR' && lead.type === 'STUDENT' && lead.assignee_id === actor.subject_id) ||
  (actor.role === 'B2B_MANAGER' && lead.type === 'PARTNER' && lead.assignee_id === actor.subject_id));
function project(lead, detail = false) {
  const allowed = ['id', 'receipt_id', 'type', 'status', 'assignee_id', 'version', 'created_at', 'updated_at'];
  if (detail) allowed.push('full_name', 'contact_method', 'contact_value', 'country', 'city', 'program', 'intake',
    'org_type', 'organization', 'job_title', 'official_website', 'interest', 'monthly_volume', 'message');
  return Object.fromEntries(allowed.filter(key => lead[key] !== undefined).map(key => [key, lead[key]]));
}
/**
 * verifySession(token): verifies signature/issuer/audience/expiry/MFA with approved Auth.
 * It returns {subject, assurance:'aal2'}; roles in tokens are deliberately ignored.
 * repository.transaction(fn): atomic, rollback on throw; tx methods below must lock
 * membership/lead rows until commit to prevent reassignment/revocation races.
 * No real adapters or external connections are supplied by this repository yet.
 */
function createAdminHandler({verifySession, repository, origin, now = () => new Date().toISOString()} = {}) {
  let validOrigin = false;
  try { const url = new URL(origin); validOrigin = url.protocol === 'https:' && url.origin === origin; } catch {}
  return async event => {
    if (typeof verifySession !== 'function' || !repository || typeof repository.transaction !== 'function' || !validOrigin) {
      return reply(503, {error: 'ADMIN_NOT_CONFIGURED'});
    }
    try {
      const method = event.httpMethod;
      if (!['GET', 'PATCH'].includes(method)) fail(405, 'METHOD_NOT_ALLOWED');
      const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([key, value]) => [key.toLowerCase(), value]));
      // Bearer token is mandatory; cookies and caller-supplied role headers are ignored.
      if (typeof headers.authorization !== 'string' || headers.authorization.length > 8192 || !/^Bearer \S+$/.test(headers.authorization)) fail(401, 'UNAUTHENTICATED');
      if ((headers.origin && headers.origin !== origin) || (method === 'PATCH' && headers.origin !== origin)) fail(403, 'ORIGIN_DENIED');
      let session;
      try { session = await verifySession(headers.authorization.slice(7)); } catch { fail(401, 'UNAUTHENTICATED'); }
      if (!session || typeof session.subject !== 'string' || !idPattern.test(session.subject)) fail(401, 'UNAUTHENTICATED');
      if (session.assurance !== 'aal2') fail(403, 'MFA_REQUIRED');
      const query = event.queryStringParameters || {};
      if (Object.keys(query).some(key => !['id', 'type', 'limit', 'cursor'].includes(key))) fail(400, 'INVALID_QUERY');
      if (query.id && (typeof query.id !== 'string' || !idPattern.test(query.id))) fail(400, 'INVALID_ID');
      if (query.cursor && (typeof query.cursor !== 'string' || !idPattern.test(query.cursor))) fail(400, 'INVALID_CURSOR');
      const limit = query.limit === undefined ? 20 : Number(query.limit);
      if (!Number.isInteger(limit) || limit < 1 || limit > 50) fail(400, 'INVALID_LIMIT');
      let change;
      if (method === 'PATCH') {
        if (!/^application\/json(?:;|$)/i.test(headers['content-type'] || '')) fail(415, 'UNSUPPORTED_MEDIA_TYPE');
        if (event.isBase64Encoded || Buffer.byteLength(event.body || '', 'utf8') > 8000) fail(413, 'PAYLOAD_TOO_LARGE');
        try { change = JSON.parse(event.body || ''); } catch { fail(400, 'INVALID_JSON'); }
        if (!change || typeof change !== 'object' || Array.isArray(change) || Object.keys(change).some(key => !['id', 'version', 'status', 'assignee_id', 'note'].includes(key))) fail(400, 'INVALID_CHANGE');
        if (typeof change.id !== 'string' || !idPattern.test(change.id) || !Number.isSafeInteger(change.version) || change.version < 1 ||
          (change.status !== undefined && !Object.hasOwn(transitions, change.status)) ||
          (change.assignee_id !== undefined && (typeof change.assignee_id !== 'string' || !idPattern.test(change.assignee_id))) ||
          (change.note !== undefined && (typeof change.note !== 'string' || !change.note.trim() || [...change.note].length > 1000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(change.note))) ||
          ['status', 'assignee_id', 'note'].every(key => change[key] === undefined)) fail(400, 'INVALID_CHANGE');
      }
      const result = await repository.transaction(async tx => {
        // Fetch current membership on every request; never trust the UI or JWT role.
        const actor = await tx.getMembership(session.subject);
        if (!actor || actor.subject_id !== session.subject || actor.active !== true || !roles.includes(actor.role)) fail(403, 'FORBIDDEN');
        if (method === 'GET' && !query.id) {
          if (!types.includes(query.type)) fail(400, 'TYPE_REQUIRED');
          if ((actor.role === 'COUNSELOR' && query.type !== 'STUDENT') || (actor.role === 'B2B_MANAGER' && query.type !== 'PARTNER')) fail(403, 'FORBIDDEN');
          const scope = {type: query.type, assignee_id: actor.role === 'ADMIN' ? null : actor.subject_id, limit, cursor: query.cursor || null};
          const page = await tx.listLeads(scope);
          // A faulty adapter must not accidentally leak rows or identifiers.
          if (!page || !Array.isArray(page.items) || page.items.length > limit || page.items.some(lead => lead.type !== scope.type || !accessible(actor, lead)) ||
            (page.next_cursor != null && (typeof page.next_cursor !== 'string' || !idPattern.test(page.next_cursor)))) fail(503, 'DATA_ACCESS_UNAVAILABLE');
          return {items: page.items.map(lead => project(lead)), next_cursor: page.next_cursor || null};
        }
        const lead = await tx.getLead(method === 'GET' ? query.id : change.id);
        // Same response for absent and unassigned rows: do not confirm their existence.
        if (!accessible(actor, lead)) fail(404, 'NOT_FOUND');
        if (method === 'GET') {
          const consent = await tx.getConsentSummary(lead.id);
          if (consent && consent.lead_id !== lead.id) fail(503, 'DATA_ACCESS_UNAVAILABLE');
          const notes = await tx.listNotes(lead.id, 20);
          if (!Array.isArray(notes) || notes.length > 20 || notes.some(note => note.lead_id !== lead.id)) fail(503, 'DATA_ACCESS_UNAVAILABLE');
          return {lead: project(lead, true), notes: notes.map(note => ({id: note.id, actor_subject: note.actor_subject, note: note.note, created_at: note.created_at})), consent: consent ? {
            policy_version: consent.policy_version, required_ack: consent.required_ack,
            marketing_opt_in: consent.marketing_opt_in, recorded_at: consent.recorded_at,
            marketing_withdrawn_at: consent.marketing_withdrawn_at || null
          } : null};
        }
        if (lead.version !== change.version) fail(409, 'VERSION_CONFLICT');
        const status = change.status === undefined ? lead.status : change.status;
        if (!Object.hasOwn(transitions, lead.status) || (status !== lead.status && !transitions[lead.status].includes(status))) fail(400, 'INVALID_TRANSITION');
        const assignee = change.assignee_id === undefined ? lead.assignee_id : change.assignee_id;
        if (assignee !== lead.assignee_id) {
          if (actor.role !== 'ADMIN') fail(403, 'ASSIGNMENT_DENIED');
          const target = await tx.getMembership(assignee);
          if (!target || target.subject_id !== assignee || !target.active || target.role !== (lead.type === 'STUDENT' ? 'COUNSELOR' : 'B2B_MANAGER')) fail(400, 'INVALID_ASSIGNEE');
        }
        const time = now();
        const updated = {...lead, status, assignee_id: assignee, version: lead.version + 1, updated_at: time};
        if (await tx.compareAndUpdate(lead.id, change.version, {status, assignee_id: assignee, version: updated.version, updated_at: time}) !== true) fail(409, 'VERSION_CONFLICT');
        if (change.note !== undefined) await tx.addNote({lead_id: lead.id, actor_subject: actor.subject_id, note: change.note.trim(), created_at: time});
        await tx.addAudit({lead_id: lead.id, actor_subject: actor.subject_id, action: 'LEAD_UPDATED', from_status: lead.status, to_status: status, from_assignee: lead.assignee_id, to_assignee: assignee, occurred_at: time});
        return {lead: project(updated)};
      });
      return reply(200, result);
    } catch (error) {
      if (error instanceof HttpError) return reply(error.status, {error: error.code});
      // Never send/log provider errors, tokens, notes or database payloads.
      return reply(503, {error: 'ADMIN_UNAVAILABLE'});
    }
  };
}
module.exports = {createAdminHandler};

'use strict';
const {randomUUID} = require('node:crypto');
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// Pool is injected. This module never reads credentials or opens a connection on import.
function createPostgresRepository(pool) {
  if (!pool || typeof pool.connect !== 'function') throw new TypeError('An approved pool is required');
  return {transaction: async fn => {
    const client = await pool.connect();
    let started = false, discard = false;
    try {
      await client.query('BEGIN ISOLATION LEVEL READ COMMITTED'); started = true;
      await client.query("SET LOCAL statement_timeout = '5s'");
      await client.query("SET LOCAL lock_timeout = '3s'");
      await client.query("SET LOCAL idle_in_transaction_session_timeout = '10s'");
      const tx = {
        getMembership: async subject => (await client.query(
          'SELECT subject_id, role, active FROM student_korea_private.admin_memberships WHERE subject_id=$1 FOR SHARE', [subject])).rows[0] || null,
        listLeads: async ({type, assignee_id, limit, cursor}) => {
          if (!['STUDENT','PARTNER'].includes(type) || !Number.isInteger(limit) || limit < 1 || limit > 50 || (cursor && !uuid.test(cursor))) throw new Error('Invalid list scope');
          const rows = (await client.query(`SELECT id, receipt_id, type, status, assignee_id, version, created_at, updated_at
            FROM student_korea_private.leads
            WHERE type=$1 AND ($2::text IS NULL OR assignee_id=$2) AND ($3::uuid IS NULL OR id>$3::uuid)
            ORDER BY id LIMIT $4 FOR SHARE`, [type, assignee_id, cursor, limit + 1])).rows;
          const more = rows.length > limit;
          const items = rows.slice(0, limit);
          return {items, next_cursor: more ? items[items.length-1].id : null};
        },
        getLead: async id => {
          if (!uuid.test(id)) return null;
          return (await client.query('SELECT * FROM student_korea_private.leads WHERE id=$1 FOR UPDATE', [id])).rows[0] || null;
        },
        getConsentSummary: async id => (await client.query(`SELECT lead_id, policy_version, required_ack, marketing_opt_in,
          recorded_at, marketing_withdrawn_at FROM student_korea_private.consent_records
          WHERE lead_id=$1 ORDER BY recorded_at DESC, id DESC LIMIT 1`, [id])).rows[0] || null,
        listNotes: async (id, limit) => (await client.query(`SELECT id, lead_id, actor_subject, note, created_at
          FROM student_korea_private.counseling_notes WHERE lead_id=$1 ORDER BY created_at DESC, id DESC LIMIT $2`, [id, Math.min(limit,20)])).rows,
        compareAndUpdate: async (id, version, patch) => (await client.query(`UPDATE student_korea_private.leads
          SET status=$3, assignee_id=$4, version=$5, updated_at=$6
          WHERE id=$1 AND version=$2 RETURNING id`, [id,version,patch.status,patch.assignee_id,patch.version,patch.updated_at])).rowCount === 1,
        addNote: async note => { await client.query(`INSERT INTO student_korea_private.counseling_notes
          (id,lead_id,actor_subject,note,created_at) VALUES ($1,$2,$3,$4,$5)`,
          [randomUUID(),note.lead_id,note.actor_subject,note.note,note.created_at]); },
        addAudit: async audit => { await client.query(`INSERT INTO student_korea_private.admin_audit
          (id,actor_subject,action,lead_id,from_status,to_status,from_assignee,to_assignee,occurred_at)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [randomUUID(),audit.actor_subject,audit.action,audit.lead_id,
          audit.from_status,audit.to_status,audit.from_assignee,audit.to_assignee,audit.occurred_at]); }
      };
      const result = await fn(tx);
      await client.query('COMMIT'); started = false;
      return result;
    } catch (error) {
      if (started) { try { await client.query('ROLLBACK'); } catch { discard = true; } }
      throw error;
    } finally { client.release(discard); }
  }};
}
// Explicit factory for future approved hosted use. Local tests inject their own loopback pool.
function createApprovedPool({connectionString, ca}) {
  const url = new URL(connectionString);
  if (!['postgres:', 'postgresql:'].includes(url.protocol) || !url.hostname || !url.username || !url.password || url.search) throw new Error('Explicit PostgreSQL URL without TLS query overrides is required');
  const {Pool} = require('pg');
  return new Pool({connectionString, max:4, connectionTimeoutMillis:5000, idleTimeoutMillis:10000,
    ssl:{rejectUnauthorized:true, ...(ca ? {ca} : {})}});
}
module.exports = {createPostgresRepository, createApprovedPool};

-- DESIGN ONLY: do not execute before DB/Auth, PRD and privacy approvals.
-- No provider is connected. All tables stay default-deny under RLS.
-- Dedicated namespace, no relation to existing medical/homepage data.
CREATE SCHEMA student_korea_private;
REVOKE ALL ON SCHEMA student_korea_private FROM PUBLIC;
CREATE TABLE student_korea_private.admin_memberships (
  subject_id text PRIMARY KEY, -- verified Auth subject; provider integration pending
  role text NOT NULL CHECK (role IN ('student_admin','partner_admin','supervisor','privacy_admin')),
  active boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE student_korea_private.inquiries (
  id uuid PRIMARY KEY,
  receipt_id text UNIQUE NOT NULL,
  submission_id uuid UNIQUE NOT NULL,
  payload_hmac text NOT NULL, -- keyed digest of canonical payload; rotate key under an approved policy
  kind text NOT NULL CHECK (kind IN ('student','partner')),
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 80),
  contact text NOT NULL CHECK (length(trim(contact)) BETWEEN 1 AND 80),
  country text,
  organization text,
  email text,
  interest text NOT NULL,
  message text NOT NULL CHECK (length(trim(message)) BETWEEN 1 AND 3000),
  locale text NOT NULL CHECK (locale IN ('ko','vi')),
  policy_version text NOT NULL,
  consent_at timestamptz NOT NULL,
  received_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewing','waiting','completed','closed')),
  assignee_id text REFERENCES student_korea_private.admin_memberships(subject_id),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  retention_policy_version text NOT NULL,
  delete_after timestamptz NOT NULL, -- computed only from approved retention rules
  CHECK (delete_after > received_at),
  CHECK (
    (kind='student' AND country IS NOT NULL AND length(trim(country)) BETWEEN 1 AND 80
      AND organization IS NULL AND email IS NULL
      AND interest IN ('language','undergraduate','graduate','undecided'))
    OR
    (kind='partner' AND organization IS NOT NULL AND length(trim(organization)) BETWEEN 1 AND 120
      AND email IS NOT NULL AND length(email) BETWEEN 3 AND 254 AND country IS NULL
      AND interest IN ('agency','university','settlement','other'))
  )
);
CREATE TABLE student_korea_private.audit_events (
  id uuid PRIMARY KEY,
  inquiry_id uuid REFERENCES student_korea_private.inquiries(id) ON DELETE SET NULL,
  actor_subject text NOT NULL,
  action text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
  -- No customer name/contact/message; audit retention needs its own approval.
);
CREATE TABLE student_korea_private.notification_outbox (
  id uuid PRIMARY KEY,
  inquiry_id uuid NOT NULL REFERENCES student_korea_private.inquiries(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_version integer NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','failed')),
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz,
  UNIQUE(inquiry_id,event_type,event_version)
  -- Notifications reference the authenticated admin page, not customer details.
);
ALTER TABLE student_korea_private.admin_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_korea_private.admin_memberships FORCE ROW LEVEL SECURITY;
ALTER TABLE student_korea_private.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_korea_private.inquiries FORCE ROW LEVEL SECURITY;
ALTER TABLE student_korea_private.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_korea_private.audit_events FORCE ROW LEVEL SECURITY;
ALTER TABLE student_korea_private.notification_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_korea_private.notification_outbox FORCE ROW LEVEL SECURITY;
REVOKE ALL ON ALL TABLES IN SCHEMA student_korea_private FROM PUBLIC;
-- Deliberately NO grants or allow policies until verified Auth integration.
-- Privileged/BYPASSRLS credentials can bypass this protection: never use them in a browser.
-- Status transitions, assignee role/type validation and version comparison must be
-- performed atomically by the approved API/DB function; SQL CHECKs alone do not do this.
-- Existing required/optional fields above follow the user message, NOT verified PRD v1.0.

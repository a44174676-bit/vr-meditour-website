-- PRD v1.0 §6, §8 reference design. Validated only in a disposable local fixture DB.
-- Never applied to a hosted/production DB; no external DB/Auth connected.
-- Apply only after provider, region, retention, minor intake and security approval.
CREATE SCHEMA student_korea_private;
REVOKE ALL ON SCHEMA student_korea_private FROM PUBLIC;
CREATE TABLE student_korea_private.admin_memberships (
  subject_id text PRIMARY KEY,
  role text NOT NULL CHECK (role IN ('ADMIN','COUNSELOR','CONTENT_EDITOR','B2B_MANAGER')),
  active boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE student_korea_private.leads (
  id uuid PRIMARY KEY,
  receipt_id text UNIQUE NOT NULL,
  submission_id uuid UNIQUE NOT NULL,
  payload_hmac text NOT NULL,
  type text NOT NULL CHECK (type IN ('STUDENT','PARTNER')),
  full_name text NOT NULL CHECK (length(trim(full_name)) BETWEEN 1 AND 80),
  contact_method text NOT NULL CHECK (contact_method IN ('zalo','phone','email')),
  contact_value text NOT NULL CHECK (length(trim(contact_value)) BETWEEN 1 AND 254),
  country text CHECK (country IN ('VN','KR','OTHER')),
  city text CHECK (length(city)<=80),
  program text CHECK (program IN ('D4','D2','UNDECIDED')),
  intake text CHECK (intake IS NULL OR intake='' OR intake ~ '^20[0-9]{2}-H[12]$'),
  age_ack boolean,
  org_type text CHECK (org_type IN ('HANOI_AGENCY','KOREAN_UNIVERSITY','OTHER')),
  organization text CHECK (length(trim(organization)) BETWEEN 1 AND 120),
  job_title text CHECK (length(trim(job_title)) BETWEEN 1 AND 80),
  official_website text CHECK (length(official_website)<=300),
  interest text CHECK (interest IN ('RECRUITMENT','SETTLEMENT','EDUCATION','BRIEFING','OTHER')),
  monthly_volume text CHECK (monthly_volume IN ('','1_10','11_50','51_PLUS')),
  message text NOT NULL DEFAULT '' CHECK (length(message)<=500),
  locale text NOT NULL CHECK (locale IN ('ko','vi')),
  status text NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW','CONTACT_ATTEMPTED','CONTACTED','CONSULTING','QUALIFIED','CLOSED')),
  assignee_id text REFERENCES student_korea_private.admin_memberships(subject_id),
  version integer NOT NULL DEFAULT 1 CHECK (version>0),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  retention_policy_version text NOT NULL,
  delete_after timestamptz NOT NULL,
  CHECK (delete_after>created_at),
  CHECK ((type='STUDENT' AND country IS NOT NULL AND program IS NOT NULL AND age_ack IS TRUE
      AND org_type IS NULL AND organization IS NULL AND job_title IS NULL AND official_website IS NULL AND interest IS NULL AND monthly_volume IS NULL)
    OR (type='PARTNER' AND org_type IS NOT NULL AND organization IS NOT NULL AND job_title IS NOT NULL AND interest IS NOT NULL
      AND contact_method IN ('phone','email') AND country IS NULL AND city IS NULL AND program IS NULL AND intake IS NULL AND age_ack IS NULL))
);
CREATE TABLE student_korea_private.consent_records (
  id uuid PRIMARY KEY,
  lead_id uuid NOT NULL REFERENCES student_korea_private.leads(id) ON DELETE CASCADE,
  policy_version text NOT NULL,
  required_ack boolean NOT NULL CHECK (required_ack IS TRUE),
  marketing_opt_in boolean NOT NULL DEFAULT false,
  marketing_policy_version text,
  recorded_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  marketing_withdrawn_at timestamptz,
  CHECK (NOT marketing_opt_in OR marketing_policy_version IS NOT NULL)
);
CREATE TABLE student_korea_private.partner_records (
  id uuid PRIMARY KEY,
  org_name text NOT NULL,
  org_type text NOT NULL,
  verified_status boolean NOT NULL DEFAULT false,
  contract_status text NOT NULL DEFAULT 'UNCONFIRMED' CHECK (contract_status IN ('UNCONFIRMED','VALID','EXPIRED')),
  contract_expires_at timestamptz,
  partnership_approved boolean NOT NULL DEFAULT false,
  logo_usage_approved boolean NOT NULL DEFAULT false
);
CREATE TABLE student_korea_private.university_content (
  id uuid PRIMARY KEY,
  name_ko text NOT NULL, name_vi text NOT NULL,
  location text NOT NULL, program text NOT NULL CHECK (program IN ('D4','D2')),
  intake text, source_url text, verified_at date, closes_at timestamptz,
  published boolean NOT NULL DEFAULT false,
  partner_id uuid REFERENCES student_korea_private.partner_records(id),
  CHECK (NOT published OR (source_url IS NOT NULL AND verified_at IS NOT NULL))
  -- Server validates HTTPS source, freshness/closure and contract approval before publishing.
);
CREATE TABLE student_korea_private.counseling_notes (
  id uuid PRIMARY KEY,
  lead_id uuid NOT NULL REFERENCES student_korea_private.leads(id) ON DELETE CASCADE,
  actor_subject text NOT NULL,
  note text NOT NULL CHECK (length(note)<=1000),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
  -- Only assigned COUNSELOR or permitted ADMIN; never copied to audit/notification.
);
CREATE TABLE student_korea_private.admin_audit (
  id uuid PRIMARY KEY, actor_subject text NOT NULL, action text NOT NULL,
  lead_id uuid REFERENCES student_korea_private.leads(id) ON DELETE SET NULL,
  from_status text, to_status text,
  from_assignee text, to_assignee text,
  occurred_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE student_korea_private.notification_outbox (
  id uuid PRIMARY KEY,
  lead_id uuid NOT NULL REFERENCES student_korea_private.leads(id) ON DELETE CASCADE,
  audience text NOT NULL CHECK (audience IN ('STUDENT_TEAM','PARTNER_TEAM')),
  event_type text NOT NULL, event_version integer NOT NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','SENT','FAILED')),
  attempts integer NOT NULL DEFAULT 0, next_attempt_at timestamptz,
  UNIQUE(lead_id,event_type,event_version)
);
-- Default deny. Auth-specific policies/grants are intentionally NOT supplied.
DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['admin_memberships','leads','consent_records','partner_records','university_content','counseling_notes','admin_audit','notification_outbox'] LOOP
    EXECUTE format('ALTER TABLE student_korea_private.%I ENABLE ROW LEVEL SECURITY',t);
    EXECUTE format('ALTER TABLE student_korea_private.%I FORCE ROW LEVEL SECURITY',t);
  END LOOP;
END $$;
REVOKE ALL ON ALL TABLES IN SCHEMA student_korea_private FROM PUBLIC;
-- No allowances for anonymous/authenticated roles; server session policies pending approval.
-- SUPERUSER/BYPASSRLS credentials remain privileged: never expose in browser.
-- Server transaction must enforce type-specific assignment, state transition, version,
-- consent policy, country-code/email validation, required fields, idempotency and outbox.
-- HMAC must use canonical intent, excluding locale/timestamps. Same UUID+same intent
-- returns original receipt; same UUID+different intent returns 409. No actual persistence yet.

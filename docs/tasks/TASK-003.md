# TASK-003: Verified Opportunity Catalog (draft, activate after TASK-002 QA)

**Owner:** Claude Code  
**Reviewer:** Codex CLI

Implement a small, curated local JSON catalog of opportunities in three demo tracks: potential college credit (CLEP/Modern States and institution policies), networking skills/certifications, and Louisiana Responsible Vendor training. All real links and claims must be verified by human or Codex against official sources before public demo; never fabricate prices, durations, recognition, or approvals. Show source URL, last-checked date (if actually checked), credit classification, and warnings. Provide filters by goal, level, budget, and career. Avoid direct Handshake API integration.

Acceptance: 3 demo queries yield relevant recommendations; unknown accreditation is explicitly shown as unverified; no broken local links; type check/web export pass.

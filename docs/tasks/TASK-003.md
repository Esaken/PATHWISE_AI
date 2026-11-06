# TASK-003: Curated Offline-First Opportunity Catalog

**Owner:** Claude Code

**Reviewer:** Codex

**Priority:** Critical

**Target:** November 5, 2026

**Branch:** `feature/task-003-opportunity-catalog`, created from `feature/task-002-onboarding` at `f048758`

**Dependency warning:** TASK-002 is feature-branch QA-approved, but its ancestry includes unapproved TASK-001 work. TASK-001 B3 and B4 remain release blockers. TASK-003 cannot merge independently into `main` until they pass or the owner explicitly approves another integration plan.

## Objective

Build a small, deterministic, offline-first catalog of real education and training opportunities. Users can browse, filter, inspect details, and see results matched to anonymous onboarding answers. Every material claim must trace to an official provider, institution, exam owner, or government source. This is a hackathon catalog—not an enrollment system, scraper, marketplace, or AI recommendation engine.

## Required demo flows

1. **High-school cybersecurity learner:** appropriate foundational cybersecurity/computing learning; no credit or credential implication without exact official evidence.
2. **University networking and alternative-credit learner:** networking skills/certification preparation plus a distinct alternative-credit path. Modern States/CLEP must be `Potential credit—confirm with institution/advisor` unless an exact current institution policy is stored.
3. **Louisiana adult seeking Responsible Vendor training:** only current providers/courses supported by Louisiana ATC evidence. Provider approval, course availability, price, duration, training completion, and permit issuance are separate claims requiring separate evidence. Do not imply state endorsement.

Each flow must return at least one honest match or an intentional empty state. Never fabricate a result to fill the UI.

## Evidence rules

Allowed evidence:

- Official provider page: identity, title, description, delivery, price, duration, eligibility.
- Official regulator/government source: approval or legal requirement.
- Official institution catalog/registrar policy: institution-specific credit.
- Official exam owner: exam facts and policy guidance.

Search snippets, aggregators, affiliate pages, blogs, social posts, and AI summaries are not evidence. Claude must open every source, record the actual check date, and write evidence notes. Unknown nonmaterial facts use typed unknown states; unverifiable identity, URL, approval, or safety-critical claims require exclusion.

Official starting points (verify again during implementation):

- Louisiana ATC provider list: `https://atc.louisiana.gov/media/5e4bsyim/responsible-vendor-provider-list-updated-11-7-25.pdf`
- Louisiana ATC rules: `https://atc.louisiana.gov/media/dx4bcx25/2026-atc-lawbook.pdf`
- College Board CLEP policy guidance: `https://clep.collegeboard.org/colleges-that-recognize-clep/how-find-colleges-clep-policy`
- College Board policy search: `https://clep.collegeboard.org/clep-college-credit-policy-search`
- Modern States official guidance: `https://helpdesk.modernstates.org/support/solutions/articles/151000233533-can-i-start-earning-college-credit-with-clep-`
- Cisco/Skills for All or Networking Academy records only when the exact official course page is reachable and supports every stored claim.

## Required typed schema

Implement discriminated TypeScript types and validate seed data in tests/build. No `any`, free-form classification strings, unsafe casts, or magic sentinels.

```ts
type LearnerCategory = 'high-school' | 'university' | 'adult';
type Topic = 'cybersecurity' | 'networking' | 'information-technology' |
  'alternative-credit' | 'responsible-vendor' | 'career-skills';
type OpportunityCategory = 'course' | 'exam-preparation' | 'exam' |
  'certification-preparation' | 'required-training';

type Price =
  | { kind: 'free'; currency: 'USD'; amount: 0; evidenceUrl: string }
  | { kind: 'known'; currency: 'USD'; amount: number; evidenceUrl: string }
  | { kind: 'unknown'; currency: null; amount: null; reason: string };

type Duration =
  | { kind: 'known'; value: number; unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months'; evidenceUrl: string }
  | { kind: 'self-paced'; estimate: string | null; evidenceUrl: string }
  | { kind: 'unknown'; reason: string };

type Availability =
  | { mode: 'online'; jurisdictions: string[] | null }
  | { mode: 'in-person'; jurisdictions: string[]; locationSummary: string }
  | { mode: 'hybrid'; jurisdictions: string[] | null; locationSummary: string | null };

type Verification = {
  status: 'verified-official-source' | 'needs-recheck';
  checkedOn: `${number}-${number}-${number}`;
  sourceUrls: readonly [string, ...string[]];
  evidenceNotes: string;
};

type CreditRecognition =
  | { kind: 'verified-institution-policy'; institution: string; policyUrl: string;
      policyCheckedOn: `${number}-${number}-${number}`; conditions: string }
  | { kind: 'possible-institution-approval';
      disclaimer: 'Credit is not guaranteed. Confirm the current policy and degree applicability with your institution.';
      examOrPathway: string | null }
  | { kind: 'certification-or-required-training'; disclaimer: string; outcome: string | null }
  | { kind: 'skills-only';
      disclaimer: 'Skills learning only; no academic credit or credential is promised.' };

type Opportunity = {
  id: string; // stable lowercase kebab-case, never an array index
  title: string;
  provider: string;
  description: string;
  learnerEligibility: {
    categories: readonly LearnerCategory[];
    summary: string;
    minimumAge: number | null;
    prerequisites: readonly string[];
  };
  topics: readonly Topic[];
  category: OpportunityCategory;
  officialUrl: string;
  price: Price;
  duration: Duration;
  availability: Availability;
  verification: Verification;
  creditRecognition: CreditRecognition;
  searchTags: readonly string[];
};
```

Names may be refined, but every field and explicit unknown variant is mandatory. Use numeric USD values consistently; never filter parsed display strings. Check dates are real source-review dates, not build timestamps.

## Required classifications and copy

Every card/detail shows one prominent status:

- **Verified published credit policy** — exact institution, exact pathway/exam, official current policy and conditions stored.
- **Potential credit — confirm with institution/advisor** — institution controls acceptance and degree applicability.
- **Certification/required training** — exact supported preparation/training outcome and next steps.
- **Skills only** — no credit or credential promised.

Never guarantee credit, transfer, admission, certification, permit, exam passage, employment, price, or outcome. A completion certificate is not automatically a professional certification. Regulator approval does not independently prove current price, schedule, duration, or permit issuance.

## Architecture

- Store reviewed catalog data locally under `apps/mobile/src`, using `satisfies readonly Opportunity[]` plus pure validation where practical.
- Validate unique IDs, HTTPS official/evidence URLs, required evidence, dates, nonnegative price/duration, and union-specific invariants.
- Separate data, validators, deterministic selectors/ranking, formatting, session integration, and UI.
- No runtime catalog fetch, scraper, database, LLM, paid API, fake delay, or remote persistence.
- Catalog list/details must work offline after the bundle loads; official links naturally require connectivity.
- Deterministic ordering: strongest eligibility/topic/location match, then stable title/ID order. Never rank `needs-recheck` above verified records.

## Onboarding integration

- Add the smallest maintainable in-memory session boundary to carry approved onboarding answers into the catalog without URLs, queries, localStorage, cookies, analytics, or network calls.
- Onboarding completion opens catalog results with honest copy such as `Matches based on your selections`.
- Direct entry/refresh without memory shows the general catalog plus `Personalize results`; never crash.
- Show active learner/topic/goal/budget/location filters and explainable stored-field match reasons.
- Users may clear/change catalog filters without mutating onboarding answers.
- Do not call deterministic matching “AI.”

## Screens

### Catalog list

Use `/opportunities` or equivalent. Include heading, result count, active filters, Clear filters, accessible filter controls, and responsive cards containing title, provider, classification, topic/category, price, duration, delivery/location, verification date, and View details.

Minimum filters: learner category, topic, category, credit class, price/budget, delivery mode, and Louisiana relevance. Multi-select rules must be explicit. Unknown price is never free or within a numeric budget.

### Detail

Use stable `/opportunities/[id]`. Invalid IDs show recovery. Render all relevant facts and limitations, unknown reasons, verification date, and official sources. Put the applicable disclaimer beside the status. External web tabs use `noopener,noreferrer`; never render source HTML.

### States

- Empty: explain no verified matches; Clear filters/browse all; never invent fallback data.
- Loading: only if genuine initialization is asynchronous; no fake delay.
- Error: invalid data fails tests/build; runtime failure shows safe recovery without stack traces.
- Offline: local list/detail remain usable; source links are labeled as external/connectivity-dependent.

## Accessibility and responsive requirements

- Preserve the purple/white system and reusable TASK-002 patterns.
- No overflow, clipping, overlap, or unreachable action at 320x800, 390x844, 768x1024, 1440x900, and 200% zoom.
- One-column narrow layout and deliberate bounded grid/list on wider screens.
- Keyboard-accessible controls/links with visible 3:1 focus; correct names, roles, checked/expanded states; announce result-count changes.
- Touch targets at least 44x44; semantic heading hierarchy; status not color-only; clear link purpose; predictable route/clear-filter focus; no traps.

## Scope

Allowed: typed local data/validation, deterministic filtering/ranking, list/filter/detail/empty/error UI, minimal in-memory onboarding handoff, tests, and documentation.

Out of scope: accounts, payments/enrollment, transcripts, favorites, persistence, Handshake, scraping, refresh jobs, external DB/CMS, paid APIs, LLMs, roadmaps, exhaustive catalog, deployment, and TASK-004.

## Acceptance criteria

1. Seed data conforms to the schema; IDs are unique/stable.
2. Every record has official HTTPS identity/evidence URLs, a real checked date, and evidence notes.
3. Unknown price/duration/location uses typed unknown states and never becomes free/zero/online/universally eligible.
4. Every record uses one approved classification with adjacent disclaimer.
5. No unsupported or guaranteed credit, credential, permit, exam, employment, or outcome claim exists.
6. All three demo profiles produce relevant explainable results or an honest verified-data empty state.
7. High-school results exclude adult/regulator-only items without eligibility evidence.
8. Louisiana results have current ATC and provider evidence; approval and course facts are not conflated.
9. Alternative-credit results require institution confirmation unless an exact official institution policy is stored.
10. List, filters, Clear, detail, invalid ID, direct entry, browser Back/Forward, and external source actions work anonymously.
11. Onboarding completion opens temporary personalized results; refresh/direct entry safely falls back to general browsing.
12. Filters/order are deterministic, preserve state, do not mutate data, and handle unknown price correctly.
13. Empty/offline/error/unavailable-session behavior is honest and safe; no fake loading.
14. List/details work with runtime network requests blocked except external source navigation.
15. No prohibited personal data, persistence, analytics, secret, scraping, paid service, or remote catalog call.
16. External links are official, accessible, clearly labeled, and safely opened.
17. Keyboard and Chromium AX checks pass for filters, cards, statuses, result announcements, detail, and Back.
18. Required viewport/zoom matrix has no overflow or clipped control.
19. TASK-001 B3/B4 remain open and are not relabeled or hidden.
20. Dependency check, Jest, TypeScript, ESLint, and Expo web export exit zero.
21. No generated output, environment file, secret, or unrelated change is committed.

## Tests

Automate:

- Schema failures: missing fields, duplicate IDs, non-HTTPS URL, invalid date/evidence, negative values, invalid unknown/classification variants.
- Every filter and representative combinations, unknown price, empty results, deterministic order, and source immutability.
- Three demo-profile matches and explainable reasons.
- Price/duration/availability format variants and all four statuses/disclaimers.
- Browse, Clear, detail, invalid ID, Back, direct entry, onboarding handoff, refresh fallback, and safe external-link props.
- Accessibility semantics supported by the renderer and privacy regression (no answers in URL/storage/network).

Run from `apps/mobile`:

```powershell
npm.cmd ls --depth=0
npm.cmd test -- --runInBand
npx.cmd tsc --noEmit
npm.cmd run lint
npx.cmd expo export --platform web
npx.cmd expo start --web
```

Manual QA:

- Rehearse all three profiles: welcome → onboarding → Review → catalog → detail → official source.
- Test general direct entry/refresh, every filter, representative combinations, Clear, zero results, invalid ID, Back/Forward, and offline browsing.
- Compare every factual claim to stored official evidence.
- Chromium keyboard/AX review and viewport matrix at 320, 390, 768, 1440, plus one 200% zoom flow.
- Android/iOS Expo sanity when available; otherwise report limitation.

## Definition of done and evidence

All criteria pass; no unverifiable record remains. Claude commits focused work on `feature/task-003-opportunity-catalog`, leaves a clean tree, and stops for Codex QA. Handoff must include:

1. Branch/base/final SHAs and ancestry warning.
2. Changed files and architecture.
3. Final schema/validators.
4. Record inventory and classification.
5. Claim-by-claim evidence table covering identity, eligibility, price, duration, delivery, approval/credit, URLs, and checked date.
6. Demo matching/filter explanation.
7. Exact command outputs/exit codes and test coverage.
8. Screenshots: three 390px personalized lists, one desktop list, detail, empty state, invalid ID, and 200% zoom.
9. Keyboard/AX/focus, offline/network, storage/privacy evidence.
10. Limitations and confirmation TASK-001 B3/B4 remain open.

Do not merge, deploy, begin TASK-004, or close TASK-001 defects.

---

# Exact Claude Code implementation handoff

You are Claude Code, the implementation engineer for Pathwise AI TASK-003.

Work in `C:\Users\kenes\Desktop\Code\PATHWISE_AI`. Read `AGENTS.md`, `CLAUDE.md`, `docs/tasks/TASK-003.md`, `docs/technical-debt.md`, and the current onboarding source before changing anything.

Create `feature/task-003-opportunity-catalog` from `feature/task-002-onboarding` at `f048758`. This branch intentionally inherits unapproved TASK-001 ancestry. Do not merge it into `main`, and do not close or relabel TASK-001 B3/B4.

Implement exactly TASK-003: a small strongly typed, curated, offline-first catalog; deterministic filters and explainable matches; responsive accessible list/detail/empty/error states; and minimal in-memory onboarding handoff. Verify every real record against official sources at implementation time. Store official URLs, real checked dates, and evidence notes. Exclude unverifiable records or use the typed unknown variants for nonmaterial unknown facts. Never invent a provider, URL, price, duration, eligibility, approval, credit, credential, or outcome.

Use the approved four-way classification: Verified published credit policy; Potential credit—confirm with institution/advisor; Certification/required training; Skills only. Never guarantee credit, credential, permit, exam passage, employment, or transfer. Keep catalog browsing functional offline without runtime catalog/API calls.

Do not add authentication, persistence, scraping, paid APIs, databases, roadmap generation, deployment, or TASK-004. Run every required automated and manual check, commit only focused TASK-003 changes, provide the complete evidence package, report limitations honestly, confirm a clean worktree, and stop for independent Codex review.

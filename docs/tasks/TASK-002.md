# TASK-002: Anonymous User Onboarding

**Owner:** Claude Code

**Reviewer:** Codex CLI

**Priority:** Critical

**Target:** November 4, 2026

**Implementation branch:** `feature/task-002-onboarding`, created from `feature/task-001-welcome`

**Dependency warning:** This task deliberately depends on unapproved TASK-001 work. TASK-001 remains QA **FAIL** with open release blockers B3 and B4 in `docs/technical-debt.md`. The TASK-002 branch cannot be merged independently into `main`, and completing TASK-002 does not approve or close TASK-001.

## Objective

Replace the TASK-001 onboarding placeholder with a complete anonymous, learner-specific intake flow for high-school students, university students, and adult learners. Collect only information needed to personalize a prototype learning roadmap, keep it in temporary application memory, and let users review and edit their choices before completion.

## User outcomes

Every learner can:

1. Enter through the pathway selected on the welcome screen.
2. Complete questions appropriate to that pathway.
3. Select a primary learning goal and career or skill interest.
4. Choose a budget preference.
5. Move backward and forward without losing in-session answers.
6. See validation that explains how to continue.
7. Review a plain-language summary, edit earlier answers, and submit without an account.
8. Reach an honest completion state that says the roadmap/catalog experience comes next; TASK-002 does not generate recommendations.

## Privacy boundaries

Do not request, infer, store, log, or transmit:

- Name, email, phone number, mailing address, or date of birth
- Student ID, school login, transcript, grades/GPA, or account credentials
- Employer identity, financial account information, payment data, or protected demographic data
- Precise location; adult state/region is optional and must use a bounded selection, not free-form address collection

All answers remain in temporary client memory for the prototype. Do not use AsyncStorage, localStorage, cookies, remote persistence, analytics, APIs, or URL query parameters containing answers. A full refresh may safely restart onboarding with a clear message or default state.

## Learner-specific requirements

### High school

Required:

- Current grade: 9th, 10th, 11th, or 12th
- Career or field of interest; provide curated broad choices plus `Not sure yet`
- Primary goal:
  - Prepare for college
  - Explore courses that may be eligible for college credit
  - Build career skills
  - Explore career pathways

Copy about credit must say eligibility/transfer depends on the institution and should be confirmed with an advisor. Do not ask for school name.

### University

Required:

- Academic program or broad area of study; include `Undecided/Exploring`
- Career or skill interest
- Primary goal:
  - Explore possible college-credit options
  - Prepare for a professional certification
  - Build job-relevant skills
  - Prepare for internships
  - Explore career pathways

Optional:

- Institution name, clearly labeled optional. Use a short free-text field only if it can be implemented accessibly and is never transmitted or persisted. Provide `Skip`/blank behavior without penalty.

Credit copy must require institutional confirmation. Certification copy must describe preparation or learning only and must not promise eligibility, passing, employment, or an official credential.

### Adult learner

Required:

- Career or skill goal; provide broad choices plus `Something else` with a short bounded text input if needed
- Primary goal:
  - Prepare for a professional certification
  - Complete job-related training
  - Build general skills
  - Change or advance a career pathway

Optional:

- US state/region for potentially relevant training requirements. Include `Prefer not to say` and `Outside the United States`. Explain why it may help. Do not collect city, ZIP code, street address, or precise location.

### Common preference

Every pathway must select one budget preference:

- Free only
- Up to $25
- Up to $100
- Flexible / show all options

Budget is a preference, not a price promise. TASK-002 contains no real course pricing or recommendations.

## Expected screens and navigation

Implement a short wizard of no more than four question steps plus review/completion. Reuse screens/components where content is common.

1. **Learner details** — pathway-specific grade, study area, or career/skill goal.
2. **Goal** — pathway-appropriate primary goal choices with safe credit/certification qualifiers.
3. **Preferences** — career/skill interest where not already captured, budget, and optional institution/state as appropriate.
4. **Review** — grouped summary of all answers, clear optional/omitted values, and `Edit` actions that return to the relevant step without discarding other answers.
5. **Completion** — confirm anonymous onboarding is complete and provide a single honest placeholder action for the future roadmap/catalog task. Do not fabricate a roadmap or opportunity.

Navigation rules:

- The existing `/onboarding/[type]` entry supports `high-school`, `university`, and `adult`.
- Missing/invalid learner type must not crash; show a safe route back to pathway selection.
- Back on the first step returns to the welcome screen. Back on later steps returns to the previous onboarding step.
- Next is disabled or validation-blocked until the current required fields are valid.
- Browser back and in-app back must not silently submit or discard the session.
- Progress is announced in text, for example `Step 2 of 4`, and is not conveyed by color alone.
- Review `Edit` returns to the chosen section; after saving, the user can return to Review.
- No nested route or URL may expose the user's answers.

## Architecture and implementation scope

- Continue Expo SDK 58, React Native, TypeScript strict mode, and Expo Router under `apps/mobile/src/app`.
- Preserve web, Android, and iOS support and the approved purple/white Pathwise AI direction.
- Use typed discriminated unions or an equally strict model so pathway-specific answers cannot be mixed accidentally.
- Keep option catalogs, types, validation, and reusable controls outside route files where practical.
- Use temporary React state via a small context/reducer or an equally maintainable in-memory design scoped to onboarding.
- Centralize validation in pure, testable functions. Do not rely only on button disabled state.
- Reuse accessible choice-card/radio-group, text-field, progress, navigation, error-summary, and review-row components instead of duplicating three flows.
- Do not change the stack, generate native `ios`/`android` projects, introduce paid services, or integrate APIs.
- Add only the smallest Expo SDK 58-compatible test dependencies needed for required tests. Use `npx expo install` and justify every dependency.
- Do not fix B3/B4 opportunistically inside TASK-002. If shared code must be touched, keep changes minimal and call them out; B3/B4 remain separate release blockers.

## Validation and error handling

- Required choices show a concise inline error after an attempted Next, receive programmatic error semantics, and move focus/announcement to a useful location on web where feasible.
- Optional fields never block progress when blank.
- Trim free text and reject whitespace-only values.
- Bound any free text to 100 characters or fewer and show the limit before submission.
- Invalid values, unknown route parameters, stale in-memory state, and direct loading of later steps fail safely without blank screens or uncaught exceptions.
- Validation messages explain the remedy and do not blame the user.
- Submitting twice must not duplicate state or navigate unpredictably.

## Accessibility requirements

- Use native interactive primitives and meaningful accessible names, roles, hints, checked/selected/disabled state, and validation state.
- Radio/choice groups support Tab/Shift+Tab, Space, Enter, and arrow keys on web using the expected group pattern.
- Every focused control has a clearly visible focus indicator with at least 3:1 adjacent-color contrast. TASK-001 B3 remains open, but no new TASK-002 control may repeat it.
- Touch targets are at least 44x44 logical pixels.
- Labels remain visible; placeholders are not the only labels.
- Errors and step changes are understandable to screen readers.
- Text and controls meet WCAG AA contrast and remain usable with larger text and at 200% browser zoom.
- Decorative icons are hidden from assistive technology; meaningful icons have equivalent text.

## Acceptance criteria

### Functional

1. Each valid learner type opens the correct first step and presents only relevant questions.
2. High-school flow captures grade, career/field interest, one approved goal, and budget.
3. University flow captures study area, career/skill interest, one approved goal, budget, and optional institution.
4. Adult flow captures career/skill goal, one approved goal, budget, and optional state/region.
5. All required fields are validated; invalid/empty attempts cannot advance and show actionable errors.
6. Back/Next preserve all in-session answers. Browser back does not submit or crash.
7. Review displays every selection accurately. Each Edit action changes the intended answer while retaining unrelated answers.
8. Submission works without an account, reaches one completion state, and creates no network request or persistent storage entry.
9. Refresh/direct-load/invalid learner type behavior is safe and offers a clear recovery path.
10. No screen claims that credit transfer, certification, admission, internship, employment, price, or outcome is guaranteed.

### Privacy and security

11. No prohibited personal field is present in UI, types, fixtures, logs, URLs, or storage.
12. Answers remain in memory only and are not sent to analytics, APIs, or third parties.
13. No secret, API key, paid integration, or `EXPO_PUBLIC_*` credential is introduced.
14. Free text is bounded, trimmed, rendered as text rather than HTML, and cannot inject markup/script.

### Responsive and visual

15. Every step, review, validation state, and completion state has no horizontal overflow, clipping, overlap, or unreachable control at 320px and 390x844.
16. At 768x1024 and 1440x900, the flow uses available space deliberately while keeping forms readable and bounded.
17. At 200% zoom and with larger text, content reflows vertically and all controls remain reachable.
18. Purple/white styling, spacing, typography, cards, and buttons are consistent with TASK-001.

### Accessibility

19. Keyboard users can complete all three flows, including choices, optional fields, navigation, Edit, and Submit, without a trap.
20. Focus is visible on every control; step changes and validation errors provide useful focus/announcement behavior.
21. Chromium's accessibility tree exposes correct names, roles, checked/selected state, required/invalid state, and button disabled state.
22. Touch targets meet 44x44 minimum and information is not conveyed by color alone.

### Engineering and regression

23. Types and validation use one canonical typed data model; there are no `any` shortcuts for onboarding state.
24. Automated tests cover each learner's happy path, required-field failures, back/edit preservation, invalid route fallback, and summary accuracy.
25. Existing welcome selection and learner-route mapping do not regress. TASK-001 B3/B4 remain documented and are not falsely marked resolved.
26. `npm ls --depth=0`, TypeScript, ESLint, automated tests, and Expo web export all exit zero.
27. The final commit is on `feature/task-002-onboarding`; no generated build output, dependency directory, secret, or local environment file is tracked.

## Required tests

Run from `apps/mobile`:

```powershell
npm.cmd ls --depth=0
npx.cmd tsc --noEmit
npm.cmd run lint
npm.cmd test -- --runInBand
npx.cmd expo export --platform web
npx.cmd expo start --web
```

If the repository has no test script, add the smallest official Expo-compatible test configuration and document why. Tests must exercise behavior, not snapshots alone.

Automated coverage must include:

- High-school, university, and adult happy paths
- Required validation for every pathway-specific field and common budget/goal fields
- Back, Next, Edit, and answer preservation
- Accurate review summary and safe completion
- Invalid/missing learner type fallback
- No submission when state is invalid
- Keyboard behavior and accessible state for reusable choice controls where the test environment supports it

Manual QA matrix:

- All three flows at 320x800, 390x844, 768x1024, and 1440x900
- At least one complete flow at 200% browser zoom and enlarged system text
- Keyboard-only completion of all three flows
- Mouse and touch interaction
- Chromium accessibility-tree inspection for roles, state, labels, errors, progress, and focus
- Refresh/direct URL/browser back/in-app back behavior
- Network and storage inspection confirming no answer persistence or transmission
- Android and iOS Expo runtime sanity checks when an emulator/device is available; otherwise report unavailable
- Regression check of welcome-to-onboarding mapping and open B3/B4 behavior

## Definition of done

- All acceptance criteria above are met.
- Required automated commands pass without ignored errors.
- Manual QA matrix is completed or unavailable environments are clearly identified.
- No prohibited data, unsupported claim, secret, API, persistence, deployment, or unrelated feature is introduced.
- Claude commits the focused implementation on `feature/task-002-onboarding` and leaves a clean working tree.
- Claude stops with a complete evidence handoff and requests independent Codex review.
- TASK-002 is not mergeable to `main` until TASK-001's dependency is approved or the product owner provides an explicit alternative integration plan.

## Evidence required from Claude Code

1. Branch name, base commit, final commit SHA, and explicit dependency warning.
2. Complete changed/deleted file list and architecture summary.
3. Typed state model and validation approach.
4. Dependency/configuration changes with justification.
5. Exact commands, exit codes, and meaningful results for every automated check.
6. Test names/results covering every required automated scenario.
7. Manual QA table for every learner and viewport.
8. Screenshots for each learner's first step and review summary at 390px, plus one 1440px flow and validation-error evidence.
9. Accessibility evidence: keyboard sequence, focus screenshots, and accessibility-tree names/roles/states.
10. Privacy evidence: network/storage inspection and confirmation that prohibited fields do not exist.
11. Known limitations, including unavailable native runtime checks and inherited B3/B4 debt.
12. Confirmation of clean working tree and no tracked secrets/generated artifacts.

## Stop condition

After implementation, testing, commit, and evidence handoff, stop. Do not merge, deploy, start TASK-003, close B3/B4, or modify external resources.

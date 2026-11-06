# Pathwise AI — Comprehensive QA and Free Deployment Audit

**Audit date:** 2026-11-06  
**Branch:** `feature/task-005-healthcare-pathways`  
**Commit:** `b8a29b4ec97f753e6af63eef40ffed43328ac19c`  
**Base:** `main` at `9be4c0a091deaf09bd37cee9baae7b747af4c562`  
**Verdict:** **FAIL — not ready for public deployment**

The core prototype works through normal client-side navigation and all 522 automated tests pass. The latest remediation fixes healthcare-card Enter activation and the welcome screen's initial desktop composition. Public deployment is nevertheless blocked by broken static deep-link routing, unresolved welcome focus visibility, a remaining hydration failure under fallback routing, and insufficient contrast in healthcare status text.

## 1. Repository and implementation assessment

- Current branch/commit are correct as stated above, but the branch is not merged to `main`.
- Working tree was not clean at audit start: `PATHWAYAI_DEMO_BRIEF.md` was untracked.
- Architecture is Expo SDK 58, React Native 0.88.1, React 19.3, Expo Router, TypeScript 6, static web output, in-memory React context, local catalog data, deterministic matching, and deterministic healthcare pathway data.
- Export contains 41 files totaling 1,649,266 bytes. The largest asset is the shared JavaScript entry at 1,116,743 bytes uncompressed. This is acceptable for a short demo but is the primary performance optimization target.
- Implemented: welcome, three onboarding variants, review/edit flow, five-record opportunity catalog, deterministic recommendations, six healthcare careers, 18 learner-specific pathway variants, six Louisiana program records, details, validation, accessibility metadata, and responsive web layouts.
- Incomplete or future-only: actual AI/model inference, healthcare opportunity records in recommendations, authentication, persistence, enrollment, progress tracking, exhaustive program coverage, and native-device QA for this release.

## 2. Release blockers

### AUD-B1 — Dynamic routes return HTTP 404 from the production static server

**Severity:** Critical / deployment-blocking

`app.json` uses `web.output: "static"`, but the dynamic routes do not export `generateStaticParams` and there is no host routing configuration. The export therefore contains literal placeholder files:

- `dist/onboarding/[type].html`
- `dist/healthcare/pathways/[careerId].html`
- `dist/opportunities/[id].html`

Using the official `npx expo serve --port 8098` production server:

| URL | HTTP result |
|---|---:|
| `/` | 200 |
| `/healthcare` | 301 to canonical static path |
| `/opportunities` | 301 to canonical static path |
| `/onboarding/adult` | **404** |
| `/healthcare/pathways/rn` | **404** |
| `/opportunities/cisco-intro-cybersecurity` | **404** |

This means refreshes, bookmarks, shared links, and direct competition-demo navigation to dynamic screens fail on a generic static deployment. Expo documents that static dynamic routes must be generated explicitly; static output does not infer every parameter.

**Required remediation:** either add complete `generateStaticParams` coverage for the three learner types, six healthcare careers, and five opportunity IDs, or deliberately use SPA output plus a tested host fallback. Re-export, serve with the intended production routing semantics, and verify direct loads and refreshes for every dynamic route.

### AUD-B2 — Welcome learner cards still lack a distinct visible keyboard focus indicator

**Severity:** High / accessibility release blocker (existing TASK-001 B3)

At 390 px, focusing the selected High school radio produced:

- `outline: rgb(0, 0, 0) none 3px`
- ordinary card shadow only: `rgba(26, 15, 60, 0.06) 0 2px 8px`
- border `rgb(108, 92, 231)`, identical to its selected border

The focused state is not visually distinguishable from selection. Source: `apps/mobile/src/app/index.tsx:357-364`. This is not fixed by the B4 hydration remediation.

**Required remediation:** use a distinct focus-visible ring with at least 3:1 non-text contrast, verify it on selected and unselected radios, and re-test Tab, Shift+Tab, arrow navigation, Space, and Enter at all target widths and 200% zoom.

### AUD-B3 — Direct protected dynamic fallback can still produce React hydration error #418

**Severity:** High / production stability

The welcome page itself no longer emitted #418 at 390, 768, or 1440, so the narrow TASK-001 B4 hydration fix is effective. However, when a generic static fallback served application HTML for `/healthcare/pathways/rn`, Chromium still captured minified React error #418 before redirecting to `/` for the missing session.

This is currently masked by AUD-B1 on the official static server, which returns 404 first. Routing remediation must not merely hide the 404 with a catch-all rewrite; it must also produce hydration-compatible HTML for dynamic protected routes.

### AUD-B4 — Healthcare status text fails WCAG contrast

**Severity:** High / accessibility

The 10 px “Verify with provider” badge uses `#E67E22` on `#FEF3E2`, which calculates to approximately **2.60:1**, below WCAG AA's 4.5:1 requirement for normal text. The same orange is also used for examination labels. Source: `apps/mobile/src/app/healthcare/pathways/[careerId].tsx:587-596` and `:40-47`.

**Required remediation:** darken the text color or change the background, audit every milestone-kind color on its actual background, and validate computed colors in Chromium.

## 3. Functional Chromium results

Production export, Chromium 156, real pointer/key input:

| Journey/check | Result |
|---|---|
| High school → healthcare → RN | PASS; RN route and high-school-specific nine-step content rendered |
| University → healthcare → RN | PASS; prerequisite-equivalency language did not assume transfer |
| Adult → healthcare → CNA | PASS; six-step adult pathway rendered |
| Adult → healthcare → LPN | PASS; eight-step adult pathway rendered |
| All six healthcare cards/routes | PASS |
| Browser Back and Forward | PASS; Back returned to healthcare and Forward restored CNA |
| Recommendations | PASS; healthcare profile honestly showed zero verified matches |
| Full catalog | PASS; five records and filter UI rendered |
| Missing session | PASS; protected client navigation returned safely to `/` |
| Invalid ID with live in-memory session | NOT VERIFIED without artificial state/router injection |
| Direct dynamic URL/refresh | FAIL; HTTP 404 on official production static server |
| Runtime network calls during core journeys | PASS; no non-local requests until an official source was intentionally opened |

No crashes or dead ends occurred during ordinary in-app journeys. The largest deployment risk is direct/refresh routing rather than client navigation.

## 4. Accessibility results

- T5-B4 is **resolved**: focused RN card + Enter navigated to `/healthcare/pathways/rn`; focused LPN + Space navigated to its pathway.
- Official program source link exposed role `link`, an explicit accessible name, `tabIndex=0`, and 148×44 px bounds. Enter opened the official Delgado URL.
- Chromium accessibility tree exposed named buttons, headings, radio groups, and radio options.
- Failed onboarding submission exposed `aria-invalid=true` on the Career or skill goal radio group and associated it with `career-goal-choice-error` through `aria-describedby`.
- Healthcare pathway visible controls measured at least 44 px high; the smallest measured width was 108.4 px.
- Healthcare card focus rings were visible. Welcome radio focus failed as AUD-B2.
- Color checks passed for primary white text (`#6C5CE7/#FFFFFF` ≈ 4.86:1), secondary body text (`#6E6193/#FFFFFF` ≈ 5.53:1), and purple-header secondary text (`#C4B9F9/#1E1458` ≈ 8.99:1), but healthcare orange status text failed as AUD-B4.
- A complete screen-reader session with NVDA/VoiceOver was not performed; Chromium AX inspection is not a substitute for assistive-technology usability testing.

## 5. Responsive results

`scrollWidth` equaled `clientWidth` at 390, 768, and 1440 for:

- welcome;
- onboarding;
- healthcare selection;
- CNA/LPN pathway detail;
- recommendations; and
- opportunity catalog.

The welcome page now renders one column at 390 and a three-card row at both 768 and 1440 on the initial production load. No #418 was observed on those fresh welcome loads. Therefore TASK-001 B4's welcome-layout symptom is resolved at this commit, although the broader dynamic-route hydration issue remains AUD-B3.

No horizontal overflow was measured. Automated geometry cannot fully replace visual/manual inspection for text clipping; no clipping was observed in the exercised content.

## 6. Automated validation and project health

| Gate | Result |
|---|---|
| `npm.cmd test -- --runInBand` | PASS, exit 0; 8 suites, 522 tests, 0 failures, 63.21 s |
| `npx.cmd tsc --noEmit` | PASS, exit 0 |
| `npm.cmd run lint` | PASS, exit 0 |
| `npm.cmd ls --depth=0` | PASS, exit 0 |
| `npx.cmd expo export --platform web` | PASS, exit 0; 9 static route templates, 12 bundles |
| `npx.cmd expo-doctor` | FAIL; 19/20 checks passed; expected `@types/jest` 30.0.0 but found 29.5.14 |
| `git diff --check main...HEAD` | FAIL; trailing whitespace in committed TASK-005 QA reports |
| `npm audit --omit=dev` | FAIL policy gate; 22 advisories: 21 moderate, 1 low, 0 high, 0 critical |

The audit's Expo advisories are largely transitive CLI/test tooling (`glob`, `minimatch`, Jest chain), but `expo` is reported as a direct affected package through CLI/fingerprint dependencies. npm's proposed downgrade to Expo 52 is not an acceptable automatic fix. Review Expo SDK 58 updates and advisory applicability before public release; do not run `npm audit fix --force` blindly.

## 7. Security and privacy

- No current product source contains API keys, paid-LLM clients, authentication tokens, fetch/Axios calls, cookies, AsyncStorage, localStorage, or sessionStorage.
- Onboarding answers remain only in React memory and disappear on refresh. They are not placed in URLs or sent remotely.
- The app collects learner category, educational/career goals, budget, and optional institution/state. It does not collect name, email, date of birth, student ID, transcript, or account credentials.
- Key-pattern history review matched only QA/task documentation discussing secret policies; no product-code secret-bearing file was identified. This is a pattern audit, not a substitute for a dedicated secret scanner in CI.
- Exported `dist` contains application assets/HTML only, not repository documentation or Git internals.
- Official outbound URLs are curated local data. No user-supplied URL execution was found.
- No CSP, Permissions-Policy, Referrer-Policy, frame restriction, or other deployment `_headers` configuration exists. Add host-specific security headers after choosing the host, while allowing Expo's required scripts/assets.
- Because the app has no backend and no persistent data, its attack surface is limited, but dependency advisories and routing configuration remain relevant.

## 8. Healthcare accuracy

Primary-source spot verification supports the major safety claims:

- LDH requires state approval of nurse-aide training programs and competency evaluation before registry placement. LDH's current materials distinguish core program hours from clinical-site orientation.
- Delgado's official CNA page states LDH approval, at least 80 hours including at least 40 hours in long-term care, an eight-week format, and an estimated $1,673.66 tuition/fees figure.
- LSBPNE's current program list shows BRCC Acadian as provisional, Delgado City Park as provisional, and Delgado Sidney Collier as full for 2025–26.
- Delgado's official nursing page states full RN board approval and ACEN continuing accreditation, while its PN program is separately governed by LSBPNE.
- LSBN material supports full approval for Delgado, BRCC, and LSUHSC pre-licensure RN programs in the reviewed reporting material.
- RN/LPN graduation is consistently distinguished from licensure; CNA registry placement is distinguished from RN/LPN licensure; allied-health credentials are described as employer/program dependent.

Remaining content risks:

- `programs.ts:38-39` says Delgado ADN duration is unconfirmed, then adds a generic “approximately 2 years” claim without claim-level source support.
- `programs.ts:171-172` similarly adds a generic approximately 12-month Delgado PN duration despite saying it is not confirmed.
- `careers.ts:127-128` encodes a 10–14 month LPN typical range without a stored claim-specific source.

These should be removed, set to unknown, or given exact authoritative evidence. Healthcare data is time-sensitive; approval and application statuses require a checked date and re-verification immediately before any later public reuse.

## 9. AI capability audit

The current application performs **no AI inference**.

- Personalization is deterministic TypeScript: learner-category hard filtering, fixed topic maps, a substantive topic-match gate, and fixed scoring weights of 40 goal + 25 career/study + 15 education baseline + 10 budget + 10 location.
- Healthcare pathways are selected from 18 hardcoded milestone sets by learner category and career ID.
- There is no LLM SDK, model endpoint, embedding service, external AI API, inference server, or API key.
- The five-record catalog and six healthcare-program records are local curated data.
- “Pathwise AI” is currently an aspirational brand name. Public copy should say “personalized, rules-based recommendations” and must not claim generative AI, predictive modeling, or model-generated roadmaps.
- Healthcare recommendations are currently empty because the opportunity catalog has no healthcare opportunity records; users instead receive healthcare pathway content.

## 10. Free deployment feasibility

All four platforms can host the 1.65 MB static export after AUD-B1 is fixed, but none should be used before routing and accessibility remediation.

| Platform | Free feasibility | Fit and risk |
|---|---|---|
| **Cloudflare Pages** | Strong | Best general recommendation after remediation. Free plan documents 500 builds/month, 20,000 files, 25 MiB per file, and 100 projects. Current export is far below these limits. Add tested static dynamic-route handling and security headers. |
| **Netlify Free** | Good for a temporary demo | Simple manual/Git deployment and Expo documents high compatibility. Current free plan uses 300 credits/month with a hard cap and no automatic paid recharge. Routing configuration remains mandatory. |
| **Vercel Hobby** | Technically feasible, policy caution | Static limits are ample, but Hobby is restricted to personal/non-commercial use. A competition prototype may be non-commercial, but the owner should confirm it fits Vercel's fair-use terms. Dynamic-route configuration remains mandatory. |
| **Expo Hosting** | Strong ecosystem fit | Expo's recommended option and supports Expo Router deployments, SSL, preview/production URLs, and free usage within plan quotas. It requires an Expo account/EAS setup. Static dynamic parameters still need correct export/routing behavior; Expo's own static server currently proves the project is incomplete. |

**Recommended path:** fix AUD-B1–B4, then deploy a preview to Cloudflare Pages or Expo Hosting, apply HTTPS/security headers, and repeat the entire direct-link/refresh matrix against the real public URL. Cloudflare Pages is the most predictable no-cost temporary choice; Expo Hosting is the lowest-friction Expo-native alternative.

Official references used for deployment evaluation:

- https://docs.expo.dev/deploy/web/
- https://docs.expo.dev/guides/publishing-websites/
- https://docs.expo.dev/router/web/static-rendering/
- https://developers.cloudflare.com/pages/platform/limits/
- https://docs.netlify.com/manage/accounts-and-billing/billing/credit-based-pricing-plans/
- https://vercel.com/docs/plans/hobby

## 11. Release decision

**Do not deploy this commit publicly yet.** Minimum release gate:

1. Fix static dynamic-route generation/routing and prove HTTP 200 plus functional refresh for every parameterized route.
2. Fix welcome-card focus visibility and orange healthcare text contrast.
3. Re-test dynamic protected routes for hydration #418 using the exact intended host configuration.
4. Align `@types/jest` with Expo SDK 58 or explicitly justify/exclude it after compatibility review.
5. Triage the 22 dependency advisories without unsafe forced downgrades.
6. Remove unsupported generic healthcare duration claims or attach claim-specific primary evidence.
7. Decide whether the untracked demo brief belongs in the release and obtain owner approval before merge/deployment.
8. Run smoke, keyboard, direct-link, refresh, console, and responsive checks against the actual HTTPS preview URL.

No code was modified, merged, deployed, or uploaded as part of this audit. Only this QA report and temporary local audit artifacts were created.

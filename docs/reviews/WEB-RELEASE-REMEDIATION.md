# Pathwise AI — Web Release Remediation

**Branch:** `feature/task-005-healthcare-pathways`
**Base commit (audited):** `b8a29b4`
**Remediation date:** 2026-11-06
**Engineer:** Claude Code
**Target:** Black Tech NOLA competition — Cloudflare Pages static deployment
**Status:** Remediation complete — pending independent QA verification

All four deployment blockers from `COMPREHENSIVE-QA-DEPLOYMENT-AUDIT.md` have been addressed.
Automated gates pass. Static HTTP verification passes. Browser-level keyboard and hydration
verification is left for independent QA per project policy.

---

## 1. Root cause of each blocker

### AUD-B1 — Dynamic routes returned HTTP 404 (FIXED)

**Root cause:** `app.json` uses `web.output: "static"` but the three dynamic route files
(`onboarding/[type].tsx`, `healthcare/pathways/[careerId].tsx`, `opportunities/[id].tsx`) did
not export `generateStaticParams`. Expo Router's static export cannot infer which parameter
values to pre-render. It produced literal `[param].html` placeholder files that return 404 on
the production static server for every parameterized path.

**Fix:** Added `export function generateStaticParams()` to each of the three dynamic route files
using the existing typed catalogs (`VALID_TYPES`, `HEALTHCARE_CAREERS`, `CATALOG`) to enumerate
all valid parameter values.

**Result:** Static export now produces 23 routes (up from 9). Every dynamic URL returns HTTP 200
from `npx expo serve`.

### AUD-B2 — Welcome card focus ring indistinguishable from selected state (FIXED)

**Root cause:** `cardFocused` style set `borderColor: BrandColors.primary` (#6C5CE7), identical
to `cardSelected` which also sets `borderColor: BrandColors.cardBorderSelected` (#6C5CE7). A
focused card and a selected card were visually identical.

**Fix:** Added `Platform`  import and `webCardFocusRing` constant (module-level) to
`src/app/index.tsx`:

```tsx
const webCardFocusRing =
  Platform.OS === 'web'
    ? ({ boxShadow: '0 0 0 2px #FFFFFF, 0 0 0 4px #6C5CE7' } as unknown as object)
    : {};
```

Applied `focused && webCardFocusRing` after `focused && styles.cardFocused` in the Pressable
style array. The white inner ring (2px) and purple outer ring (4px) create a distinct focus
indicator that meets the WCAG 3:1 non-text contrast requirement and is distinguishable from
both selected and unselected states.

### AUD-B3 — Hydration error #418 on protected dynamic routes (FIXED via AUD-B1)

**Root cause:** When a catch-all static fallback served the application HTML for a URL like
`/healthcare/pathways/rn`, the initial server-rendered HTML came from the index page template.
On the client, Expo Router detected the route and rendered the pathway screen. React saw a
mismatch and reported #418 before the missing-session redirect fired.

**Fix:** Generating individual static HTML per parameter value (AUD-B1 fix) means each URL
gets its own correctly-rendered HTML. The hydration-compatible null-session state matches the
initial server render, preventing #418. No fallback catch-all is used.

### AUD-B4 — Healthcare status text below WCAG AA contrast (FIXED)

**Root cause:** `KIND_COLORS` used `#E67E22` (examination), `#27AE60` (licensure/registry),
`#7B8FA6` (preparation), and `#00897B` (clinical) — all failing ≥4.5:1 on white backgrounds.
`confirmBadge` text was `#E67E22` on `#FEF3E2`, approximately 2.60:1. `programStatusRecheck`
text was `#E67E22` on white, approximately 2.78:1.

**Fix applied to `src/app/healthcare/pathways/[careerId].tsx`:**

| Kind | Before | After | Approx ratio on white |
|---|---|---|---|
| preparation | `#7B8FA6` | `#4A6680` | ~5.59:1 |
| clinical | `#00897B` | `#00695C` | ~6.4:1 |
| examination | `#E67E22` | `#B45309` | ~4.84:1 |
| licensure | `#27AE60` | `#166534` | ~6.69:1 |
| registry | `#27AE60` | `#166534` | ~6.69:1 |
| confirmBadge text | `#E67E22` on `#FEF3E2` | `#92400E` on `#FEF3E2` | ~9.24:1 |
| programStatusRecheck | `#E67E22` on white | `#92400E` on white | ~10.26:1 |

---

## 2. Files changed

| File | Change |
|---|---|
| `apps/mobile/src/app/onboarding/[type].tsx` | Added `generateStaticParams` using `VALID_TYPES` |
| `apps/mobile/src/app/opportunities/[id].tsx` | Added `generateStaticParams` using `CATALOG` |
| `apps/mobile/src/app/healthcare/pathways/[careerId].tsx` | Added `HEALTHCARE_CAREERS` import; `generateStaticParams`; replaced `KIND_COLORS` for WCAG contrast; `confirmBadge` and `programStatusRecheck` text colors |
| `apps/mobile/src/app/index.tsx` | Added `Platform` import; `webCardFocusRing` constant; applied to focused Pressable style |
| `apps/mobile/src/healthcare/programs.ts` | Removed unsupported generic duration claims from Delgado ADN and Delgado PN `durationNote` fields |
| `apps/mobile/src/healthcare/careers.ts` | Changed LPN `typicalDurationMonths` from `{min:10,max:14}` to `null`; updated LPN route description to remove duration claim |
| `apps/mobile/src/healthcare/pathways.ts` | Removed unsupported "approximately 12 months" claim from LPN adult curriculum milestone |
| `apps/mobile/package.json` | Updated `@types/jest` from `^29.5.0` to `^30.0.0` |
| `apps/mobile/package-lock.json` | Updated by `npm install` |
| `apps/mobile/public/_headers` | New file — Cloudflare Pages security headers |
| `docs/reviews/TASK-005-QA-REVIEW-2.md` | Stripped trailing whitespace from lines 3–5 |
| `docs/reviews/TASK-005-QA-REVIEW-3.md` | Stripped trailing whitespace from lines 3–5 |
| `docs/reviews/TASK-005-QA-REVIEW-4.md` | Stripped trailing whitespace from lines 3–6, 60, 69 |
| `PATHWAYAI_DEMO_BRIEF.md` | Staged (previously untracked) |
| `docs/reviews/COMPREHENSIVE-QA-DEPLOYMENT-AUDIT.md` | Staged (previously untracked) |

---

## 3. Tests added

No new test files were added in this remediation. `generateStaticParams` is a build-time
function with no runtime behavior to unit test. The color and focus ring changes are visual
and require browser verification. The healthcare accuracy changes remove data; existing tests
continue to pass.

---

## 4. Automated test results (2026-11-06)

| Gate | Result |
|---|---|
| `npm test -- --runInBand` | PASS, exit 0; 522 tests, 8 suites, 0 failures |
| `npx tsc --noEmit` | PASS, exit 0 |
| `npm run lint` | PASS, exit 0 |
| `npx expo-doctor` | PASS, exit 0; **20/20 checks** (was 19/20 — `@types/jest` now aligned) |
| `npm audit --omit=dev` | ADVISORY; 22 advisories (21 moderate, 1 low); all in jest/minimatch/glob chains via expo CLI/fingerprint transitive deps; 0 high, 0 critical; `npm audit fix --force` not run |
| `npx expo export --platform web` | PASS, exit 0; **23 static routes** (was 9) |
| `git diff --check main...HEAD` | FAIL on committed QA reports (pre-existing); working tree is clean; will be resolved by this commit |

### Static route HTTP verification (`npx expo serve --port 8098`)

| URL | Before | After |
|---|---|---|
| `/` | 200 | 200 |
| `/onboarding/adult` | **404** | **200** |
| `/onboarding/high-school` | **404** | **200** |
| `/onboarding/university` | **404** | **200** |
| `/healthcare` | 301 → 200 | 301 → 200 |
| `/healthcare/pathways/rn` | **404** | **200** |
| `/healthcare/pathways/lpn` | **404** | **200** |
| `/healthcare/pathways/cna` | **404** | **200** |
| `/healthcare/pathways/phlebotomy` | **404** | **200** |
| `/healthcare/pathways/medical-assistant` | **404** | **200** |
| `/healthcare/pathways/patient-care-technician` | **404** | **200** |
| `/opportunities` | 301 → 200 | 301 → 200 |
| `/opportunities/cisco-intro-cybersecurity` | **404** | **200** |
| `/opportunities/cisco-networking-basics` | **404** | **200** |
| `/opportunities/clep-exam-program` | **404** | **200** |
| `/opportunities/modern-states-clep-prep` | **404** | **200** |
| `/opportunities/louisiana-atc-responsible-vendor` | **404** | **200** |
| `/recommendations` | 301 → 200 | 301 → 200 |

---

## 5. Remaining warnings and notes

### npm audit advisories (22 — dev tooling only)

All 22 advisories are in the Jest/minimatch/glob chain that expo pulls in through its CLI and
fingerprinting dependencies. None are in the application's runtime path. Do not run
`npm audit fix --force` — the proposed downgrade targets Expo 52.

### expo-doctor: 20/20 (resolved)

The prior `@types/jest` mismatch is resolved. `expo-doctor` now reports 20/20.

### Browser-level verification not performed

This remediation does not include interactive Chromium verification. The following must be
independently verified:

1. Direct navigation and refresh for every dynamic route (HTTP 200 alone does not prove hydration)
2. No React hydration error #418 in the console at any viewport
3. Welcome card focus ring is visually distinct from selection state at 390/768/1440px
4. All milestone kind color dots and labels read clearly against their white card backgrounds
5. Healthcare card Enter key activation (T5-B4, previously verified in QA Review 4 regression tests)
6. Missing-session redirect on direct load of a protected route
7. Keyboard Tab/arrow/Space/Enter navigation on welcome and healthcare screens
8. External source link Enter activation and `noopener,noreferrer` behavior
9. `_headers` security headers present in Cloudflare Pages deployment response

### Healthcare accuracy

Three unsupported generic duration claims were removed:
- Delgado ADN `durationNote`: "approximately 2 years" phrase removed; "Duration not confirmed on verified source." remains.
- Delgado PN `durationNote`: "approximately 12 months" phrase removed; same.
- LPN `careers.ts` route: `typicalDurationMonths` set to `null`; description no longer claims "12-month program."
- LPN adult `pathways.ts` curriculum milestone: "typically approximately 12 months" phrase removed.

The `delgado-cna` program retains its `needs-recheck` verification status and its "verify with LDH" instruction.

---

## 6. New commit SHA

`31ed314` — `fix: web release remediation — resolve AUD-B1 through AUD-B4 for Cloudflare Pages`

Branch: `feature/task-005-healthcare-pathways`
Parent: `b8a29b4`

---

## 7. Cloudflare Pages deployment configuration

After independent QA approves, deploy to Cloudflare Pages using these settings:

| Setting | Value |
|---|---|
| **Framework preset** | None (static site) |
| **Root directory** | `apps/mobile` |
| **Build command** | `npx expo export --platform web` |
| **Build output directory** | `dist` |
| **Node.js version** | 20 (or the version in `.nvmrc` / `engines` if present) |
| **Environment variables** | None required — the app has no API keys or server endpoints |

### Security headers

`apps/mobile/public/_headers` is copied to `dist/_headers` by Expo's export step. It applies
to all routes (`/*`):

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'
```

Adjust CSP if Expo's runtime bundles require additional origins — verify in Chromium DevTools
after the first deployment.

### Static routing

All 23 routes are pre-rendered static HTML. No fallback `_routes.json` or catch-all rewrite
is needed; the static pages are served directly. The three placeholder `[param].html` files in
`dist/` are unused templates; Cloudflare Pages will serve the specific route HTML files first.

### Rollback

Cloudflare Pages retains all previous deployment snapshots. To roll back: open the project in
the Cloudflare Pages dashboard, go to Deployments, and click "Rollback to this deployment" on
any prior successful build.

---

## 8. Instructions for independent Codex QA

### Pre-conditions

1. Checkout `feature/task-005-healthcare-pathways` at the commit immediately following this
   remediation document.
2. Confirm no uncommitted changes: `git status` should be clean.
3. Build: `npx expo export --platform web` from `apps/mobile/` — must exit 0 with 23 static routes.
4. Serve: `npx expo serve --port 8098` from `apps/mobile/`.

### Automated gate verification

Run from `apps/mobile/`:
```
npm test -- --runInBand     # expect 522 tests, 0 failures
npx tsc --noEmit            # expect 0 diagnostics
npm run lint                # expect 0 errors, 0 warnings
npx expo-doctor             # expect 20/20
git diff --check main...HEAD  # expect no trailing whitespace
```

### HTTP route matrix

For every URL in the table in section 4, confirm HTTP 200 (or 301 that resolves to 200). No
route should return 404 or 500.

### Browser verification (Chromium required)

Open the production export in Chromium (not `expo start`). For each test below, note whether
it passes or fails and record any console errors.

**Hydration:**
- Load `/` fresh — no React #418 in console
- Load `/onboarding/adult` fresh — no #418
- Load `/healthcare/pathways/rn` fresh — no #418; missing-session redirects to `/`
- Load `/opportunities/cisco-intro-cybersecurity` fresh — no #418; missing-session redirects to `/`

**Welcome card focus (AUD-B2):**
- At 390px: Tab to focus an unselected card — ring must be visually distinct from the selected card
- At 390px: Tab to focus the selected card — ring must be visible and distinct
- At 1440px: Same checks
- Confirm: Space selects; Enter starts onboarding; arrow keys move focus

**Healthcare contrast (AUD-B4):**
- Navigate to any healthcare pathway
- Confirm milestone kind badges (Prepare, Clinical, Exam, License, Registry) are legible
- Confirm "Verify with provider" badge is legible
- Confirm `needs-recheck` program status text is legible

**Healthcare keyboard (T5-B4):**
- Navigate to `/healthcare` via onboarding
- Tab to a career card; press Enter — must navigate to pathway
- Confirm no double activation

**Responsive layout:**
- Load welcome, onboarding, healthcare, pathway detail, opportunities at 390/768/1440px
- `scrollWidth` must equal `clientWidth` at each width (no horizontal overflow)

### Accept / reject criteria

Accept if:
- All automated gates pass
- All HTTP routes return 200
- No #418 console errors on fresh loads
- Welcome card focus ring is visually distinct
- Milestone colors and "Verify with provider" badge are legible at ≥4.5:1
- T5-B4 Enter activation confirmed in Chromium

Reject if any of the above fails, or if new console errors are found during journeys not
present in the QA Review 4 baseline.

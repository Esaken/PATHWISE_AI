# TASK-001 QA Review 4

**Overall verdict:** FAIL

**B1 mobile overflow verdict:** RESOLVED

**Reviewed branch:** `feature/task-001-welcome`

**Implementation commit:** `535432d`

**Documentation commit / reviewed HEAD:** `41b5a8c5d04a04d5e67ea7561c7d5125fc8f94ca`

**Base:** `main` at `8238bd1d5d6506e8e8436482d3ef3510e1f70e99`

**Review date:** November 4, 2026

## Executive result

The `width: '100%'` ScrollView correction resolves B1. Fresh Chromium renders and DOM measurements show no horizontal overflow, clipping, overlapping cards, or clipped CTA at any required welcome or onboarding viewport.

TASK-001 nevertheless remains **FAIL** because pathway selection is not exposed correctly to assistive technology and does not respond to Space as a radio control. This fails acceptance criteria 16 and 17.

## Blocking defect

### B2 — Pathway radios do not expose checked state or support Space activation

**Severity:** High / acceptance-blocking

**Acceptance criteria failed:** 16 and 17

Each pathway renders on web as a focusable `<div role="radio">`, but none has `aria-checked`. Chromium's accessibility tree consequently reports all three radios as `checked: false`, including the visually selected High school card. After clicking College/University, the visual selection moves but the DOM still has no `aria-checked`, and Chromium still reports all three as unchecked.

A DevTools keyboard test focused College/University and sent a native Space key sequence. Selection did not change. Because these are `div` elements with radio roles rather than native radio inputs, browser-native Space behavior is not supplied automatically.

This means a keyboard-only or screen-reader user cannot reliably determine or change the selected pathway even though mouse activation works.

**Reproduction:**

1. Run the web app and open `/`.
2. Inspect the three `[role="radio"]` elements. Observe that `aria-checked` is absent.
3. Inspect Chromium's accessibility tree. All three expose `checked: false` while High school is visibly selected.
4. Click College/University. Visual selection changes, but accessibility checked states remain false.
5. Focus a pathway with Tab and press Space. The selected pathway does not change.

**Required fix:**

- Ensure exactly one pathway exposes `aria-checked="true"` and the others expose `aria-checked="false"` on web, updating synchronously with visual selection.
- Implement standard radio keyboard behavior: Space selects the focused option. Prefer a native/accessibility-correct radio implementation or add explicit cross-platform-safe key handling where required.
- Re-test the browser accessibility tree, Tab/Shift+Tab, Space, Enter, mouse/touch selection, and CTA navigation.

## B1 responsive verification

For all cases below:

- `document.documentElement.scrollWidth === document.documentElement.clientWidth`
- `document.body.scrollWidth === document.body.clientWidth`
- Automated bounding-rectangle inspection found zero visible elements outside the viewport.
- Fresh screenshots show no clipped text, overlapping cards, horizontal overflow, or clipped CTA.

| Route / viewport | Width measurement | Control boundaries | Result |
|---|---|---|---:|
| Welcome 320x800 | `320 / 320` | Cards and CTA: left 20, right 300 | PASS |
| Welcome 390x844 | `390 / 390` | Cards and CTA: left 20, right 370 | PASS |
| Welcome 768x1024 | `768 / 768` | Cards: left 32 through right 736; CTA 32–736 | PASS |
| Welcome 1440x900 | `1440 / 1440` | Cards: left 272 through right 1168; CTA 272–1168 | PASS |
| Welcome 200% equivalent | `720 / 720` | Cards and CTA: left 20, right 700 | PASS |
| Onboarding 320x800 | `320 / 320` | No out-of-bounds element | PASS |
| Onboarding 390x844 | `390 / 390` | No out-of-bounds element | PASS |
| Onboarding 768x1024 | `768 / 768` | No out-of-bounds element | PASS |
| Onboarding 1440x900 | `1440 / 1440` | No out-of-bounds element | PASS |
| Onboarding 200% equivalent | `720 / 720` | No out-of-bounds element | PASS |

The 200% equivalent uses a 720px effective CSS viewport, representing a 1440px page at 200% browser zoom. Content reflows vertically and remains reachable through the ScrollView.

## Fresh screenshot evidence

Welcome:

- [320px](evidence/task001-qa4/qa4-welcome-320.png)
- [390x844](evidence/task001-qa4/qa4-welcome-390.png)
- [768x1024](evidence/task001-qa4/qa4-welcome-768.png)
- [1440x900](evidence/task001-qa4/qa4-welcome-1440.png)
- [200% zoom equivalent](evidence/task001-qa4/qa4-welcome-zoom200.png)

Onboarding:

- [320px](evidence/task001-qa4/qa4-onboard-320.png)
- [390x844](evidence/task001-qa4/qa4-onboard-390.png)
- [768x1024](evidence/task001-qa4/qa4-onboard-768.png)
- [1440x900](evidence/task001-qa4/qa4-onboard-1440.png)
- [200% zoom equivalent](evidence/task001-qa4/qa4-onboard-zoom200.png)

These are fresh QA4 captures from the current implementation; QA3 screenshots were not reused as passing evidence.

## Navigation and route results

Mouse/DOM activation of each pathway followed by `Get started` passed:

| Selection | Destination | Visible label | Result |
|---|---|---|---:|
| High school | `/onboarding/high-school` | High school | PASS |
| College/University | `/onboarding/university` | College/University | PASS |
| Adult learner | `/onboarding/adult` | Adult learner | PASS |

Direct loading also passed for all three valid routes. `/onboarding/not-valid` renders the safe generic `learner` fallback without crashing. The onboarding back control remains a focusable native button with a 44px height and a meaningful `Back to welcome` accessible name.

## Automated test results

Run from `apps/mobile` against the reviewed branch:

| Command | Result |
|---|---:|
| `npm.cmd ls --depth=0` | PASS — exit 0; no missing or invalid top-level dependency |
| `npm.cmd ci --dry-run --ignore-scripts` | PASS — exit 0 |
| `npx.cmd tsc --noEmit` | PASS — exit 0; no diagnostics |
| `npm.cmd run lint` | PASS — exit 0; no findings |
| `npx.cmd expo export --platform web` | PASS — exit 0; `/`, sitemap, not-found, and dynamic onboarding route exported |
| `npx.cmd expo start --web --port 8091` | PASS — Metro served the reviewed implementation |

## Nonblocking improvements

1. Add automated browser tests asserting `scrollWidth <= clientWidth` at the required breakpoints so B1 cannot regress.
2. Add automated accessibility tests for exactly one checked radio, Space selection, visible focus, and CTA keyboard navigation.
3. The lockfile remains unusually large for the lint-only dependency addition noted in earlier reviews. It is reproducible (`npm ci --dry-run` passes), but future dependency work should minimize unrelated lockfile churn.

## Limitations

- The 200% test used the equivalent 720px CSS viewport rather than browser chrome zoom controls.
- No Android or iOS emulator/device was available; this review validates web rendering and source-level cross-platform compatibility.
- Full screen-reader software was not available. Chromium's accessibility tree was inspected directly and is sufficient to establish B2.
- CTA Enter activation through the DevTools synthetic key path was inconclusive, so no CTA-specific keyboard defect is asserted. The radio checked-state and Space defects are independently reproducible and blocking.

## Conclusion

B1 is fixed, and the width correction passes all requested responsive measurements and fresh visual checks. TASK-001 as a whole remains **FAIL** until B2 is corrected and independently re-reviewed.

No application code was modified. No branch was merged or deployed, and TASK-002 was not started.

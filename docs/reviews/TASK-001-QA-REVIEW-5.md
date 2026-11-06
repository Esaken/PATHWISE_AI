# TASK-001 QA Review 5

**Verdict:** FAIL

**Reviewed branch:** `feature/task-001-welcome`

**Implementation commit:** `4c4cd28` (`fix: expose aria-checked and add keyboard navigation to pathway radio group`)

**Reviewed HEAD:** `1c465ac`

**Base:** `main` at `8238bd1`

**Review date:** November 4, 2026

## Executive result

The B2 checked-state and keyboard-selection correction is functionally successful: Chromium exposes exactly one checked pathway, selection state remains synchronized, and Space, Enter, arrow keys, mouse, and emulated touch all select the expected option.

TASK-001 remains **FAIL** because focused pathway cards have no visible focus indicator, and the production static web export initially renders tablet/desktop widths with the stacked mobile layout instead of the intended desktop card row. These fail acceptance criteria 13 and 16.

## Blocking defects

### B3 — Pathway focus is not visibly indicated

**Severity:** High / accessibility blocking  
**Acceptance criterion failed:** 16

Chromium successfully focuses an unselected College/University radio, and the accessibility tree marks it focused. However, its computed presentation is unchanged:

| State | Border | Box shadow |
|---|---|---|
| Before focus | `rgb(226, 220, 255)` | `rgba(26, 15, 60, 0.06) 0px 2px 8px` |
| After focus | `rgb(226, 220, 255)` | `rgba(26, 15, 60, 0.06) 0px 2px 8px` |

The fresh 390px focus screenshot likewise shows no discernible focus ring or other focus-only cue on College/University.

**Evidence:** [focused College/University at 390px](evidence/task001-qa5/qa5-focus-390.png)

**Required fix:** provide a clear focus-visible treatment that is distinct from both selected and unselected states, works with Tab and arrow-key focus movement, and meets the 3:1 component-boundary contrast requirement. Verify computed style and screenshot evidence after remediation.

### B4 — Production web export does not apply desktop/tablet card layout on initial load

**Severity:** High / responsive production regression  
**Acceptance criterion failed:** 13

Fresh, independent Chromium processes loaded directly from the exported static build at 768x1024 and 1440x900. Both initially display three full-width stacked cards. The source intends `isDesktop` at widths >=768 and a three-card row, but that responsive state is not applied on the production static page's initial load.

At 1440px this produces a vertically stretched mobile composition instead of the intended deliberate desktop layout previously accepted in QA4.

**Evidence:**

- [fresh production 768x1024](evidence/task001-qa5/qa5-fresh-768.png)
- [fresh production 1440x900](evidence/task001-qa5/qa5-fresh-1440.png)

**Required fix:** ensure the exported web build calculates or refreshes window dimensions after hydration so a fresh desktop/tablet load applies the intended responsive layout without requiring a manual resize. Re-test from a fresh browser process against the production export, not only the Metro development server.

## B2 correction verification

### Initial accessibility state

Exactly one selected pathway is exposed:

| Pathway | DOM `aria-checked` | Chromium AX checked | `tabIndex` |
|---|---:|---:|---:|
| High school | true | true | 0 |
| College/University | false | false | -1 |
| Adult learner | false | false | -1 |

### State synchronization and interaction

| Interaction | Expected result | DOM / AX result | Status |
|---|---|---|---:|
| Space on focused College/University | College selected | College true; others false; focus retained | PASS |
| Enter on focused Adult learner | Adult selected | Adult true; others false; focus retained | PASS |
| ArrowRight from Adult | Wrap to High school | High school true and focused | PASS |
| Mouse click College/University | College selected | College true and focused | PASS |
| Emulated touch tap Adult learner | Adult selected | Adult true and focused | PASS |

Roving `tabIndex` also stays synchronized: the selected radio is 0 and the other two are -1 after each change.

## Navigation

- `Get started` is a native focusable button with the accessible name `Get started`.
- Pointer activation after scrolling the CTA into view navigates successfully to `/onboarding/high-school` for the default selection.
- The selected learner mapping and onboarding routes were unchanged from QA4, where all three mappings and the invalid-route fallback passed.
- Synthetic DevTools Enter activation on the CTA was inconclusive and did not navigate, so no CTA-specific keyboard defect is asserted. Pathway Enter activation was independently confirmed.

## Responsive regression measurements

No horizontal overflow returned at any measured viewport:

| Viewport | `clientWidth` | `scrollWidth` | Out-of-bounds visible elements | Status |
|---|---:|---:|---:|---:|
| 320x800 | 320 | 320 | 0 | PASS |
| 390x844 | 390 | 390 | 0 | PASS |
| 768x1024 | 768 | 768 | 0 | PASS for overflow; FAIL for intended layout |
| 1440x900 | 1440 | 1440 | 0 | PASS for overflow; FAIL for intended layout |

Mobile screenshots confirm B1 remains fixed:

- [320px](evidence/task001-qa5/qa5-welcome-320.png)
- [390x844](evidence/task001-qa5/qa5-welcome-390.png)

There is no clipping, overlap, horizontal overflow, or clipped CTA at 320px or 390px. The CTA sits below the initial viewport on short screens but remains reachable through vertical scrolling, as allowed by the task.

## Automated test results

Run from `apps/mobile` against the reviewed branch:

| Command | Result |
|---|---:|
| `npm.cmd ls --depth=0` | PASS — exit 0 |
| `npm.cmd ci --dry-run --ignore-scripts` | PASS — exit 0 |
| `npx.cmd tsc --noEmit` | PASS — exit 0, no diagnostics |
| `npm.cmd run lint` | PASS — exit 0, no findings |
| `npx.cmd expo export --platform web` | PASS — exit 0; expected routes and bundles exported |
| Expo Metro web startup | PASS — served during initial QA |
| Exported static build through local HTTP server | PASS — assets/routes loaded; B4 reproduced there |

## Nonblocking improvements

1. Add automated browser tests for checked-state synchronization, Space/Enter/arrow behavior, roving tab order, and focus-visible styling.
2. Add a production-export viewport test so responsive behavior cannot pass in Metro while failing on initial static load.
3. Add a direct automated assertion that CTA keyboard activation changes the route; the DevTools synthetic native-button check was inconclusive in this review.

## Limitations

- No full screen-reader application was available; Chromium's accessibility tree was inspected directly.
- No Android or iOS emulator/device was available.
- CTA Enter activation could not be conclusively verified through the synthetic DevTools event path; pointer navigation passed.
- This review did not repeat every onboarding route because the B2 change is isolated to the welcome radio group and QA4 already verified all valid mappings and invalid fallback.

## Conclusion

The latest correction resolves the checked-state and pathway activation portion of B2. TASK-001 still fails until visible focus and production initial-load responsiveness are corrected and independently re-reviewed.

No product code was modified. No branch was merged or deployed, and TASK-002 was not started.

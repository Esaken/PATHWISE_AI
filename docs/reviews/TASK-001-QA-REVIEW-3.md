# TASK-001 QA Review 3

**Verdict:** FAIL

**Reviewed branch:** `feature/task-001-welcome`

**Reviewed commit:** `6cec4a09b30a7d39350316bd2c70e596cb7046c9`

**Base:** `main` at `8238bd1d5d6506e8e8436482d3ef3510e1f70e99`

**Review date:** November 4, 2026

## Blocking defect

### B1 — Mobile horizontal overflow remains at 390x844

**Status:** Not resolved

The remediated welcome screen was rendered in headless Chromium at 390x844 after client hydration. It still extends past the right viewport edge:

- The mission sentence is cut off instead of wrapping.
- Each pathway card extends beyond the right edge.
- Pathway descriptions are visibly clipped.
- The `Get started` button extends beyond the right edge.

This directly fails TASK-001 acceptance criteria 12 and 14. A single required viewport failure is sufficient to block TASK-001.

Commit `6cec4a0` adds `minWidth: 0` to `heroContent`, `selectionContent`, and onboarding `centerContent`. Those changes are sensible but do not eliminate the rendered overflow. The remaining sizing issue is likely higher in the ScrollView/flex-row containment chain or involves the padded flex item receiving the full viewport width before padding. Claude must diagnose using actual computed widths/`scrollWidth`, not add another unverified style change.

**Required remediation and proof:**

1. In a real browser, inspect `document.documentElement.scrollWidth`, the ScrollView content wrapper, row wrappers, and padded content bounds at 320px and 390px.
2. Ensure both welcome and onboarding have no horizontal overflow (`scrollWidth <= clientWidth`) and all text wraps within the visible content area.
3. Re-run and provide screenshots for both routes at 320px, 390x844, 768x1024, 1440x900, and 200% browser zoom.

## Viewport evidence

| Route / viewport | Result | Evidence |
|---|---:|---|
| Welcome, 390x844 | **FAIL** | Fresh commit `6cec4a0` render shows the same right-edge clipping described above. |
| Welcome, 1440x900 | PASS | Three equal-width cards, CTA, hero, and copy remain within the centered 960px content region. |
| Welcome, 200% zoom equivalent | PASS | A 720x450 effective CSS viewport (1440px page at 200% responsive reflow) shows no horizontal clipping; vertical scrolling is expected. |
| Onboarding, 768x1024 | PASS | Back control, learner badge, heading, copy, and preview card remain within bounds. |
| Welcome, 320px | NOT COMPLETED | Headless renderer did not finish the file before the Windows process session was exhausted. The confirmed 390px failure already fixes the verdict at FAIL. |
| Welcome, 768x1024 | NOT COMPLETED in this run | Prior review passed this size; no fresh QA-3 capture completed. |
| Onboarding, 320px / 390x844 / 1440x900 / zoom equivalent | NOT COMPLETED | The Windows process session rejected further process creation after the parallel headless render batch. No pass is claimed. |

The incomplete rows do not weaken the blocking result: B1 is independently reproduced at a required mobile viewport on the reviewed commit.

## Automated quality gates

Run from `apps/mobile` against commit `6cec4a0`:

| Command | Result |
|---|---:|
| `npx.cmd tsc --noEmit` | PASS — exit 0, no diagnostics. |
| `npm.cmd run lint` | PASS — exit 0, no findings. |
| `npx.cmd expo export --platform web` | PASS — exit 0; `/`, `/_sitemap`, `/+not-found`, and `/onboarding/[type]` exported. |
| Expo web development server on port 8090 | PASS — Metro started and served the reviewed code. |

## Remaining test limitations

- Exact browser UI zoom keystrokes were unavailable; the 200% check used the equivalent 720px effective CSS viewport for a 1440px page.
- Interactive keyboard and screen-reader testing was not repeated because the browser automation host was unavailable.
- Android and iOS device/emulator testing was not available.
- The Windows account/process session returned `CreateProcessWithLogonW failed: 1909` after the parallel Chrome render batch, preventing completion of the remaining fresh screenshots. No unavailable check is reported as passed.

## Conclusion

TASK-001 remains **FAIL**. TypeScript, ESLint, and Expo web export are healthy, and desktop/zoom-equivalent evidence is good, but the release-blocking mobile overflow is still visibly present at 390x844.

No application code was modified and no branch was merged.

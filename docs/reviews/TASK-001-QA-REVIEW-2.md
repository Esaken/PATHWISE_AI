# TASK-001 Remediation Re-review

**Verdict:** FAIL  
**Reviewed branch:** `feature/task-001-welcome`  
**Reviewed commit:** `1da1824`  
**Prior reviewed commit:** `40176dc`  
**Base:** `main` at `8238bd1`

## Blocking defect

### B1 remains unresolved at required mobile widths

Rendered Chromium evidence shows horizontal clipping at both 320px and 390x844:

- The hero mission is cut off rather than wrapping.
- Pathway cards extend past the right viewport edge.
- Card descriptions are clipped.
- At 390x844 the CTA reaches beyond the right edge.
- The direct `/onboarding/adult` route at 390x844 also clips its subheading and preview card content.

Tablet (768x1024), desktop (1440x900), and a 720px effective viewport representing a 1440px page at 200% zoom rendered without horizontal clipping. Because 320px and 390px are explicit acceptance sizes, B1 still blocks release.

The remediation added `minWidth: 0` only to desktop cards. The centered row-wrapper children can still preserve their content min-width on web:

- `apps/mobile/src/app/index.tsx:184` (`heroRow`)
- `apps/mobile/src/app/index.tsx:189` (`heroContent`)
- `apps/mobile/src/app/index.tsx:227` (`selectionRow`)
- `apps/mobile/src/app/index.tsx:233` (`selectionContent`)
- `apps/mobile/src/app/onboarding/[type].tsx:104` (`centerRow`)
- `apps/mobile/src/app/onboarding/[type].tsx:110` (`centerContent`)

**Required fix:** allow the bounded flex children to shrink below their text min-content width (typically `minWidth: 0` on the relevant row children), then rerun the complete viewport matrix on both welcome and onboarding routes.

## Regression checks

- **TypeScript:** PASS — `npx.cmd tsc --noEmit`, exit 0.
- **ESLint:** PASS — `npm.cmd run lint`, exit 0 with no findings.
- **Web export:** PASS — `npx.cmd expo export --platform web`, exit 0; all expected routes exported.
- **Dependencies:** PASS — `npm.cmd ls --depth=0`, exit 0.
- **Web startup:** PASS — Metro served the remediated app on localhost:8088.
- **Onboarding navigation contract:** PASS by code and direct-route rendering. All three route parameter mappings remain, valid `adult` renders “Adult learner,” invalid/missing values retain the generic fallback, and the back handler still falls back to `/` when history is absent.
- **Keyboard accessibility implementation:** PASS by regression inspection. Pathway cards remain native pressables with radio semantics and checked state; CTA/back remain native buttons; focus handlers/styles and 44px targets remain. No keyboard-related code regressed.

## Test limitations

- The browser automation host was unavailable, so Tab/Shift+Tab, Enter/Space, browser-back interaction, and screen-reader announcements were not exercised interactively. Keyboard findings above are based on rendered DOM/source semantics.
- No Android or iOS device/emulator runtime was available.
- Device-scale-factor rendering was captured, and a 720px effective CSS viewport was used to verify the responsive reflow expected at 200% zoom on a 1440px viewport. Exact browser UI zoom keystrokes could not be automated.

No application code was changed and the branch was not merged.

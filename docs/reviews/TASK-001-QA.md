# TASK-001 Independent QA Review

**Verdict:** FAIL  
**Reviewed branch:** `feature/task-001-welcome`  
**Reviewed commit:** `40176dc5710f9229f8e872d93721e36180a1e996`  
**Comparison base:** `main` at `8238bd1d5d6506e8e8436482d3ef3510e1f70e99`  
**Review date:** November 3, 2026

## Blocking defects

### B1 — Responsive containers overflow and clip required content

**Severity:** High / release-blocking  
**Acceptance criteria failed:** 12, 13, 14

At a 390x844 Chromium viewport, the mission sentence, every pathway card, card descriptions, and the primary CTA extend past the right edge. Required text and controls are visibly clipped. At 1440x900 after client hydration, the three-card row also exceeds its bounded container; the Adult learner card is cut off on the right.

The cause is the combination of `width: '100%'` and horizontal padding on bounded containers in `apps/mobile/src/app/index.tsx:171-177` and `apps/mobile/src/app/index.tsx:209-216`, plus row cards with no shrinking/equal-width constraint in `apps/mobile/src/app/index.tsx:232-236`.

**Reproduction:**

1. From `apps/mobile`, run `npx.cmd expo start --web --port 8087`.
2. Open `/` in Chromium at 390x844 and wait for hydration.
3. Observe right-edge clipping beginning in the mission line and continuing through cards and CTA.
4. Resize to 1440x900.
5. Observe the hydrated three-card row: the third card extends beyond the content area and viewport.

**Required fix:**

- Make padded `width: '100%'` containers account for padding on web (or remove the conflicting width/padding combination).
- Give desktop cards equal flexible widths that can shrink, such as an appropriate `flex`/`flexBasis`/`minWidth` combination.
- Recheck 320px, 390x844, 768x1024, 1440x900, and 200% zoom with no horizontal overflow, clipping, or overlap.

## Nonblocking improvements

1. `apps/mobile/src/app/onboarding/[type].tsx:74` promises “verified, affordable” resources “matched to your goals.” TASK-001 excludes opportunity/course claims and real personalization. Replace this with neutral placeholder wording until verified catalog/personalization work exists.
2. The placeholder exposes two back controls performing the same action (`apps/mobile/src/app/onboarding/[type].tsx:37-53` and `:79-92`). One clear back action would reduce redundancy and tab stops.
3. `package-lock.json` has a very large mechanical rewrite (5,053 additions/1,334 deletions) for two lint packages, and its root package metadata categorizes `eslint-config-expo` differently from `package.json`. `npm ci --dry-run` passes, so this is not blocking, but regenerate/review the lockfile with the repository's intended npm version to minimize unexplained churn.
4. Add automated component or browser coverage for pathway selection, all route parameters, invalid parameter fallback, and responsive overflow. Current quality gates are build/static-analysis checks only.

## Acceptance and quality summary

- **Project structure/dependencies:** PASS. Expo Router entry, SDK 58 packages, strict TypeScript, and platform support remain. Starter tab code was removed cleanly.
- **Required content/navigation implementation:** PASS by source inspection. All three pathways, default selection, `Get started`, typed route construction, selected learner display, invalid-parameter fallback, and back fallback are present.
- **Visual direction:** PASS. Purple/white/lilac palette, rounded cards, bold typography, selection check, and education/career cues follow the reference.
- **Responsiveness:** FAIL due to B1.
- **Accessibility implementation:** PARTIAL PASS. Native pressables, radio/radiogroup roles, checked state, labels, hints, 44px minimum targets, and focus styles are present. Full keyboard/screen-reader behavior was not interactively verified.
- **Security/scope:** PASS with the nonblocking wording caveat above. No API calls, credentials, `EXPO_PUBLIC_*` keys, auth, payments, personal-data fields, or tracked secret/generated artifacts were found in the feature commit.
- **Code quality:** PASS except for the responsive layout defect. Routes and constants are focused; obsolete starter code is removed.
- **Branch discipline:** PASS. Feature commit is on `feature/task-001-welcome`, not `main`; no merge was performed.

## Automated test results

Run from `apps/mobile` against commit `40176dc`:

| Command | Result |
|---|---|
| `npm.cmd ls --depth=0` | PASS (exit 0) |
| `npm.cmd ci --dry-run --ignore-scripts` | PASS (exit 0) |
| `npx.cmd tsc --noEmit` | PASS (exit 0) |
| `npm.cmd run lint` | PASS (exit 0, no findings) |
| `npx.cmd expo export --platform web` | PASS (exit 0; `/`, sitemap, not-found, and dynamic onboarding route exported) |
| `npx.cmd expo start --web --port 8087` | PASS in CI mode; Metro served the app at localhost |
| `npx.cmd expo-doctor` | INCONCLUSIVE; two attempts produced no output before the tool session ended, so no pass is claimed |

## Tests not fully run

- Interactive browser keyboard testing (Tab/Shift+Tab, Enter/Space, focus order, browser back) because the browser automation host was unavailable. Headless Chromium was sufficient for rendered screenshots and invalid-route DOM inspection, but not reliable interactive input.
- Screen-reader announcements on web, Android, and iOS.
- Android and iOS runtime sanity checks; no emulator/device session was available.
- 200% zoom interaction and full 768x1024 visual inspection. Given the confirmed overflow at both required endpoint widths, these cannot change the FAIL verdict.

## Working-tree note

Before review, the branch already had an uncommitted `docs/tasks/TASK-001.md` modification and an untracked `.claude/` directory. They were preserved and excluded from the feature diff. QA created no application-code changes and did not merge the branch.

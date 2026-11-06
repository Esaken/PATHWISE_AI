# TASK-001: Expo foundation and polished welcome screen

**Owner:** Claude Code

**Reviewer:** Codex CLI

**Priority:** Critical

**Target:** November 3, 2026

**Branch:** `feature/task-001-welcome` created from `main`

## Objective

Replace the Expo starter in `apps/mobile` with a polished, anonymous-first Pathwise AI welcome screen and a minimal onboarding placeholder. Support web, Android, and iOS, with the public web demo first priority.

Use the repository-root `Pathwise AI Education Journey.png` as visual direction, not as a full-screen asset or a pixel-perfect mandate. Preserve its purple/violet accents, white/lilac surfaces, bold readable typography, rounded pathway cards, restrained depth, and education/career character. Do not copy its future roadmap or opportunity content.

## Verified baseline

- The app is in `apps/mobile` (not the repository root) and uses Expo SDK 58, React Native, TypeScript strict mode, and Expo Router routes under `src/app`.
- `package-lock.json` exists. Installed top-level dependencies resolve: `npm.cmd ls --depth=0` passes.
- The UI is the untouched Expo starter with tabs and an Explore screen.
- Baseline `npx.cmd tsc --noEmit` fails in `src/components/app-tabs.web.tsx`. Removing or repairing obsolete starter navigation is part of this task; final typecheck must pass.
- No ESLint config is checked in. `npm run lint` attempts automatic setup and may require network. Commit a minimal Expo-compatible config and, only if required, install an SDK-compatible lint package with `npx expo install`.
- Root `.gitignore` covers dependencies, Expo/build output, local env files, signing files, and generated native projects.

## Scope

1. Replace visible Expo starter UI with a welcome route at `/`.
2. Present exactly three choices: `High school`, `College/University`, and `Adult learner`.
3. Provide a clear selection state and one primary `Get started` action.
4. Navigate to a separate accessible onboarding placeholder that identifies the selected pathway and has a working back action.
5. Remove visible starter tabs, badges, tutorials, and unused starter-only code/assets when safe. Do not retain dead starter navigation merely to avoid its type error.
6. Replace generic user-visible `mobile` metadata with sensible Pathwise AI branding where applicable.

## Out of scope

- Real onboarding, persistence, authentication, personal-data collection, payments, uploads, or Handshake integration
- APIs, LLMs, secrets, analytics, paid/external services, or deployment
- Opportunity/course data or claims about credits, credentials, prices, transferability, or outcomes
- EAS builds, native project generation, or TASK-002 work

## Claude Code implementation instructions

1. Read root `AGENTS.md`, root `CLAUDE.md`, `apps/mobile/AGENTS.md`, and this file before editing.
2. Confirm `main` is clean; create `feature/task-001-welcome` from `main`. Never commit to or merge into `main`.
3. Work only in `apps/mobile` except for evidence. Do not edit the reference PNG.
4. Consult matching Expo SDK 58 documentation before using Expo/React Native APIs, per `apps/mobile/AGENTS.md`.
5. Prefer existing cross-platform primitives and dependencies. Avoid custom native modules and decorative complexity.
6. Use Expo Router for both screens. Pass learner type through a typed route parameter or equally small local navigation contract; add no persistence.
7. Make each entire pathway card a native pressable control. Selecting a card updates selection; `Get started` opens the placeholder. Focus alone must not navigate.
8. Keep all text live in code. Ensure short viewports and enlarged text remain reachable through safe-area-aware scrolling.
9. Remove obsolete imports/files from the starter experience and keep the diff focused.
10. Run the full test plan, commit, and provide the evidence below. Stop without merging or deploying.

## Acceptance criteria

### Structure and behavior

1. `package.json` retains `expo-router/entry`, Expo SDK 58-compatible dependencies, and web/Android/iOS support. `npm ls --depth=0` has no invalid/missing top-level packages.
2. `/` renders the welcome screen and a separate Expo Router route renders the placeholder. No starter tab bar, Explore screen, WebBadge, tutorial, or “Welcome to Expo” content remains visible.
3. The welcome screen visibly includes `Pathwise AI` and the exact mission: `Find affordable learning and career opportunities.`
4. It visibly includes exactly the three required pathway labels with concise, non-claiming supporting copy.
5. One pathway is clearly selected by default, or `Get started` is disabled until selection. Only one can be selected. State is conveyed by more than color (for example border and check mark).
6. The primary action is labeled exactly `Get started`. Each selection reaches a placeholder that displays the corresponding learner type.
7. Direct-loading/refreshing the placeholder never crashes. Missing or invalid learner parameters show a safe generic fallback.
8. The placeholder is explicitly a preview/coming-next state, has no fake form, and includes an accessible back action to `/`.
9. No API call, secret, `EXPO_PUBLIC_*` key, account/personal-data flow, or opportunity/course claim is introduced.
10. Any new dependency is essential, Expo 58-compatible, installed with `npx expo install`, and justified. Prefer no new runtime dependency.

### Visual and responsive quality

11. The result clearly follows the reference’s deep purple/violet, white/lilac, high-contrast typography, rounded cards/buttons, education/career cues, and restrained shadows.
12. At 390x844 it is a clean single column with no horizontal overflow, clipping, overlap, or unreachable action. Touch targets are at least 44x44 logical pixels.
13. At 1440x900 it uses width deliberately (for example bounded hero plus three-card row or balanced columns), remains centered, and does not look like a stranded phone canvas.
14. At about 768px it reflows cleanly. It remains usable at 320px width and 200% browser zoom.
15. Spacing and hierarchy are consistent. Decorative visuals never obscure content and are hidden from assistive technology if they add no meaning.

### Accessibility

16. Every control is keyboard reachable on web in logical order, has visible focus, and uses standard Enter/Space behavior. Do not make plain `View` or text elements clickable.
17. Pathway controls expose meaningful accessible names, appropriate button/radio semantics, and selected/disabled state. Action names are unambiguous.
18. Text and meaningful UI meet WCAG AA contrast: 4.5:1 normal text and 3:1 large text/component boundaries. Color is not the sole signal.
19. Safe areas and larger system text are supported. Animation, if any, does not block navigation or comprehension.

### Quality gates

20. From `apps/mobile`, `npx tsc --noEmit`, `npm run lint`, and `npx expo export --platform web` all exit zero without ignored errors.
21. `npx expo start --web` renders both routes; manual QA confirms all three flows, responsive states, keyboard/focus behavior, direct-route fallback, in-app back, and browser back.
22. The final commit is on `feature/task-001-welcome`, the tree is clean, and no `.expo`, `dist`, dependency, secret, signing, or local-env artifact is tracked.

## Test plan

Run from `apps/mobile` and preserve exact results:

```powershell
npm.cmd ls --depth=0
npx.cmd expo-doctor
npx.cmd tsc --noEmit
npm.cmd run lint
npx.cmd expo export --platform web
npx.cmd expo start --web
```

Equivalent `npm`/`npx` commands are fine where PowerShell execution policy permits them. Do not weaken execution policy.

Manual QA:

- Chromium: 390x844, 768x1024, and 1440x900; additionally 320px wide and 200% zoom.
- Keyboard: Tab/Shift+Tab order, visible focus, Enter/Space, browser back, and no trap.
- Navigation: submit all three pathways; refresh/direct-load placeholder with valid, missing, and invalid parameters; use in-app back.
- Accessibility: inspect names, roles, selected/disabled states, and decorative-element exposure.
- Native sanity: run in an available Android/iOS Expo environment. If unavailable, say so; do not generate native projects or use cloud/paid builds.

## Evidence required in handoff

1. Branch and final commit SHA.
2. Summary and complete changed/deleted file list.
3. Dependency/config rationale, explicitly stating whether dependencies changed.
4. Every automated command with exit code and meaningful output. Report environment failures honestly; never call an unrun check passed.
5. Results for every manual QA item, with unavailable platforms marked.
6. Welcome screenshots at 390x844 and 1440x900, plus one placeholder screenshot showing learner type.
7. Known limitations/risks.
8. Confirmation of clean tree and no tracked secrets/generated artifacts.
9. Request independent Codex review. Do not request or perform merge/deployment.

## Risks to manage

- **Starter architecture:** retaining `AppTabs` preserves irrelevant UI and the current type failure.
- **Responsive divergence:** validate both defined mobile and desktop layouts, not just one stretched composition.
- **Web/native drift:** avoid web-only CSS, hover-only meaning, unsupported effects, and platform-fragile icon APIs.
- **Custom selector accessibility:** preserve roles, state, focus, keyboard behavior, and 44px targets.
- **Text scaling/short screens:** avoid fixed-height centering; use intrinsic sizing, wrapping, scrolling, and safe areas.
- **Reference overreach:** later roadmap/opportunity concepts are visual context only and remain out of scope.
- **Restricted network:** lint setup and `expo-doctor` may need network. Distinguish environment failures from code failures and report both.

## Stop condition

After committing and producing the evidence, stop and hand the branch to Codex for independent QA. Do not merge, deploy, start TASK-002, or modify external resources.

# TASK-001: Working Expo app and Welcome Screen

**Owner:** Claude Code  
**Reviewer:** Codex CLI  
**Priority:** Critical  
**Target:** November 3, 2026

## Objective
Create or verify a functioning Expo/React Native/TypeScript app at the repository root and replace boilerplate with a polished Pathwise AI landing screen closely following the agreed purple-and-white mockup.

## UI requirements
- Wordmark Pathwise AI and concise mission: "Find affordable learning and career opportunities."
- Three entry options: High school, College/University, Adult learner.
- Clear primary "Get started" action; clicking a pathway takes user to an accessible placeholder onboarding screen (even if functionality comes in TASK-002).
- Mobile-first layout that also looks good at desktop widths; keyboard and screen-reader friendly.
- No authentication, API calls, or invented opportunity content in TASK-001.

## Engineering requirements
- Use Expo Router and TypeScript; do not remove platform support.
- No unrelated dependencies or custom native modules without justification.
- Ensure standard ignored files and secrets are excluded from Git.
- No paid services or deployment.

## Acceptance criteria
1. `npm install` or existing installation succeeds.
2. `npx tsc --noEmit` passes.
3. `npx expo export --platform web` succeeds.
4. `npx expo start --web` renders the welcome screen locally.
5. All three pathway options work and show an onboarding placeholder.
6. Visual style follows approved purple/white mockup.
7. Commit changes on `feature/task-001-welcome`, not main.

## Handoff
Report summary, changed files, full test commands and outputs, manual QA checklist, known limitations, and commit SHA. Ask Codex for independent review.

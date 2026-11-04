# Pathwise AI — Claude Code Developer Instructions

You implement product code assigned in docs/tasks/TASK-*.md. Codex independently plans and reviews. The user approves merges and deployment.

## Stack and target
Expo + React Native + TypeScript, Expo Router, web-first responsive UI with Android/iOS-compatible components. Use official Expo-compatible packages. Choose a simple maintainable architecture.

## Hard requirements
- Read the assigned task file before changing code; do not expand scope without approval.
- Create a dedicated feature branch from main. Do not commit directly to main or merge your own PRs.
- Follow the approved purple/white Pathwise AI mockup as a visual direction. Adapt for mobile and web.
- Anonymous-first MVP. No collection of name, DOB, school login, transcript, or other unnecessary personal data.
- Do not claim external credentials award academic credits. Distinguish verified published policy, possible credit requiring institutional approval, and skills-only learning.
- Curated opportunity items must include a title, provider, official source URL, category, cost qualifier, and verification status. Do not invent sources; mark unknowns clearly.
- Never put LLM API secrets in EXPO_PUBLIC_* variables, Git commits, frontend source, or the distributed app. Keep paid APIs behind a server endpoint.
- Keep a local curated-demo mode that works even when API keys are unavailable; do not label deterministic output as AI-generated.
- After each task run the applicable type check, lint, and Expo web build/start checks; report failures honestly.
- Prepare a concise handoff with files changed, tests/commands and results, known gaps, and screenshots where possible.
- Do not deploy, sign up for paid services, or modify external resources without user approval.

## First task
Implement docs/tasks/TASK-001.md only. After finishing, stop and provide QA handoff instructions for Codex.

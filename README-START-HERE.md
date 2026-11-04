# Pathwise AI Agent Starter Pack

These are instruction documents, not application code. Scaffold the Expo app FIRST, then extract/copy AGENTS.md, CLAUDE.md and docs/ into the Expo project root. The existing Expo AGENTS.md may be replaced after reviewing the difference; this starter is intentionally specific to Codex as supervisor.

Suggested Windows commands (from E:\Projects):

```powershell
npx create-expo-app@latest Pathwise-AI
Set-Location .\Pathwise-AI
npx expo install react-dom react-native-web @expo/metro-runtime
npx expo start --web
```

If Pathwise-AI already exists and is EMPTY, use `npx create-expo-app@latest .` inside it. If it already contains package.json, do not scaffold again.

Then copy starter files into root, run `git status`, and create baseline commit. Start Codex in one terminal to read AGENTS.md and task spec; start Claude in a second terminal on a feature branch to implement TASK-001. Do not run agents with unrestricted permissions. See README and docs/tasks for acceptance criteria.

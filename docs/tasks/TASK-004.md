# TASK-004: Roadmap Engine and AI (draft, activate after TASK-003 QA)

**Owner:** Claude Code  
**Reviewer:** Codex CLI

Implement deterministic catalog-grounded roadmap generation first. Then optionally wire a server-side LLM endpoint controlled by environment variables and usage limits. The LLM may summarize and sequence only IDs/records that exist in the curated catalog, and must not assert credit transfer without institution-specific evidence. Provide graceful fallback and explicit labels "Sample roadmap" or "AI-generated roadmap" as applicable. Test network and rate-limit failures.

Acceptance: each demo learner can generate a roadmap; all opportunity links trace to stored entries; no API keys in frontend bundle; errors are handled; tests/type check/web export pass.

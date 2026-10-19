# Security notes

This app runs a small server (`server.ts`). It can call Gemini, fetch web pages and push to GitHub, so it must not be reachable by strangers.

## What is enforced
- **Access key.** Every `/api` route except `/api/health` needs `SYMVIBE_API_KEY`, sent as `Authorization: Bearer <key>` or `x-api-key`. The web app asks for the key once per browser session and keeps it in `sessionStorage` only. With no key set, the server answers only direct connections from the same machine; anything arriving through a proxy (such as a deployed copy) gets a 503 until a key is set.
- **GitHub pushes.** Only to repositories in `GITHUB_ALLOWED_REPOS` (default `dev4-gpt/local-AgenticOS`), only to branches starting with `GITHUB_PUSH_BRANCH_PREFIX` (default `feat/symvibe`), never to the repository's default branch, and `targetSubdir` may not contain `..`. The push still force-updates the chosen tool-owned branch, so do not reuse that branch name for other work.
- **URL inspection.** `/api/rea/inspect` fetches only public web addresses (http/https on ports 80, 443, 8080, 8443). Loopback, private, link-local and cloud-metadata addresses, `.local`/`.internal` names and embedded credentials are refused, every redirect is checked again, and the body is capped at 200 KB. See `netguard.ts` and `netguard.test.ts` (`npm test`).

## What is not
- **DNS rebinding.** A host name is checked, then fetched; a hostile DNS server could answer differently the second time. Run the server without access to internal networks as well.
- **Simulated results.** Agent "execution", the REA inspector and the cloner are produced by a Gemini model, not by real tools. Treat their output as a draft, not evidence.
- **One shared key.** There are no user accounts. Anyone with the key can use every route, including saving over the stored workspace.
- Secrets (`GEMINI_API_KEY`, `GITHUB_TOKEN`, `SYMVIBE_API_KEY`) belong in AI Studio Secrets or a local `.env` that is not committed. Rotate any token that was ever exposed on a public deployment.

## Reporting
Open an issue, or contact the repository owner directly.

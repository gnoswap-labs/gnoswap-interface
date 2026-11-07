## Contributing
Thank you for considering contributing to the Gnoswap Interface! We value and appreciate your input. Before submitting a pull request, please check the guidelines below.

### Development: i18nexus

Use i18nexus as the source of truth for translations. Locale JSON files in
`packages/web/public/locales/<language>/<namespace>.json` are generated output;
do not author translations by editing them directly.

#### Prerequisites

- macOS or Linux, Git, and Node.js from `.nvmrc` (`nvm use`).
- Node.js must provide `process.execve` (available in Node 22 from 22.15).
- Yarn from `package.json#packageManager` (via `corepack enable`).

Install the workspace dependencies before downloading translations or starting MCP:

```sh
yarn install --immutable
```

CLI/MCP versions are managed in `packages/web/package.json` and the root `yarn.lock`.
The shared launcher, `packages/web/scripts/i18nexus.mjs`, runs those installed
packages without downloading tools at startup. Use the web workspace script for downloads.

#### Credentials

| Variable | Purpose |
| --- | --- |
| `I18NEXUS_API_KEY` | Project API key; required for downloads and the configured MCP server. |
| `I18NEXUS_PERSONAL_ACCESS_TOKEN` | Personal access token (PAT); required for membership-protected MCP reads, including string lookup/search, and source-string changes. Request only the scopes needed for the task. |

The launcher selects each credential independently:

1. A nonempty environment variable inherited by the launcher wins.
2. Missing or whitespace-only values fall back to **this checkout's `packages/web/.env.local`**.

The web package directory is determined by the launcher's location, not the shell's
working directory. Each linked worktree uses its own `packages/web/.env.local`; the
launcher never searches the main checkout, another worktree, or parent directories.
It does not read the tracked application `.env` or other environment files.

To use the file fallback, create or update `packages/web/.env.local` **in the checkout
you are using**. Preserve any existing entries:

```sh
cd /path/to/your-checkout
(umask 077; touch packages/web/.env.local)
chmod 600 packages/web/.env.local
```

Add the two i18nexus variables from `packages/web/.env.example` using a secure editor. The file
must be owned by your account, be a regular file rather than a symlink, and have
mode `0600`. Keep it Git-ignored and never commit credentials or use `NEXT_PUBLIC_`
variables for these secrets. For shared runtime credentials, pass them explicitly
through the launching environment rather than relying on file discovery.

You can instead supply credentials through the launching shell or client
environment. A GUI client may not inherit your terminal's environment, and a
client may load additional environment configuration before starting the server.
The launcher's ENV-first rule applies to the environment it actually receives.
Changing credentials requires restarting the MCP server or client; it does not
update an already-running server.

Worktree tools that support `.worktreeinclude` can copy the source checkout's
ignored `packages/web/.env.local` into a new worktree. Keep the source file at mode `0600`.
This is an optional, one-time copy, not ongoing synchronization. Otherwise,
create `packages/web/.env.local` in the new checkout or supply credentials through ENV
as described above. The runtime launcher reads only its own checkout's web `.env.local`.

#### Download translations

Run from the checkout where you want to update locale files:

```sh
yarn workspace @gnoswap-labs/web i18n:download --help
yarn workspace @gnoswap-labs/web i18n:download
```

Append official CLI options, for example
`yarn workspace @gnoswap-labs/web i18n:download --ver <version>`. The CLI runs in `packages/web`, so
relative `--path` values resolve from that directory. The launcher excludes the
PAT from downloads and disables the CLI's automatic dotenv loading. Help does
not require credentials and receives neither credential.

Review the generated diff before committing: a pull can update namespaces
unrelated to your task. Keep changes scoped to the requested namespaces and
verify affected keys across all supported languages. Do not reconstruct locale
files from individual MCP responses or invent missing translations.

#### PR translation drift checks

The **i18nexus Sync Check** workflow compares PR locale JSON with the latest official
download. It ignores formatting and object-key order. Drift is advisory: one bot
comment lists affected files and explains how to sync. Later checks update that
comment, including when the drift is resolved; clean PRs do not receive a new comment.
Download or comparison errors fail the check rather than reporting a false match.

For intentional string changes, update i18nexus first, run `yarn workspace @gnoswap-labs/web i18n:download`,
review `git diff -- packages/web/public/locales`, and commit/push the relevant locale
changes. Do not fix drift by hand-editing generated JSON.

Maintainers must configure the `I18NEXUS_API_KEY` repository Actions secret; no PAT
is needed. The workflow uses `pull_request_target` to support fork PR comments,
executes only trusted base-branch code, and reads PR locale blobs without checking
out or executing PR code. It starts handling PR events after the workflow is merged
into the base repository; this initial setup PR cannot trigger the new workflow.

#### MCP clients

Start clients from this checkout's root so they discover the project configuration:

| Client | Project configuration | Activation |
| --- | --- | --- |
| OMP | `.omp/mcp.json` and `.omp/config.yml` | Project MCP loading is enabled for this repository. Use `/mcp list` to inspect discovery and `/mcp test i18nexus` to check the connection in a session. |
| Claude Code | `.mcp.json` | Review and approve the project server when prompted. `claude mcp get i18nexus` reports discovery and approval/connection status. |
| Codex | `.codex/config.toml` | Trust the project through the client's normal trust flow. Untrusted project configuration is discovered but disabled; `codex mcp get i18nexus --json` will not show an active server until it is trusted. |

For OMP launched from a nested directory, use:

```sh
omp --cwd "$(git rev-parse --show-toplevel)"
```

All three definitions start `packages/web/scripts/i18nexus.mjs mcp` and share the
same credential selection rules. Host-managed GUI/ACP sessions may need MCP
configuration supplied by the host instead of repository discovery.

A listed or connected server alone does not prove authentication. Check project
metadata, then PAT scope when protected operations are needed. Without a PAT,
the server can still expose tools and perform API-key-only reads, but protected
operations fail. Remote edits require authorization for the task: confirm the
project, namespace, full key, and required scopes before editing, then read back
saved values.

### How to Contribute	

**Steps**
1. Check existing issues or pull requests before submitting a new one to avoid duplicate submissions.
2. Fork the Gnoswap Interface repository.
3. Create a new branch from the latest `develop` branch for your changes.
4. Make changes and commit them with a concise and descriptive message using the [Conventional Commits](https://www.conventionalcommits.org/) format. Please check spelling, grammar, and remove any trailing whitespace.
5. Push your branch to your forked repository.
6. Submit a pull request with `develop` as the base branch.

**Branch Policy**
- `develop` is the default branch and deploys to the dev environment.
- `staging` deploys to the stg environment (`develop` → `staging` pull requests).
- `main` is the release candidate branch (`staging` → `main` pull requests) and does not deploy.

**Release**
- testnet and mainnet are deployed only by the `release` workflow, run from `main` by maintainers. It creates a `testnet-vX.Y.Z` or `mainnet-vX.Y.Z` tag, publishes release notes since the previous tag with the same prefix, and deploys that commit to Vercel. To redeploy an existing release, run the workflow from that tag (Use workflow from: Tags → `testnet-vX.Y.Z` or `mainnet-vX.Y.Z`) with `redeploy` enabled.
- Add the `skip-changelog` label to pull requests that should not appear in release notes.

**Pull Request Title**
Your pull request title must follow the conventional commits format and start with one of the following types:
- **feat:** A new feature.
   - Use this type when you introduce a new feature to the codebase or enhance existing functionality.
   - Example: **feat: Add user authentication**
- **chore:** Routine tasks or maintenance.
   - Use this type when you perform tasks that don't directly change the codebase, such as updating dependencies, configuration changes, or setting up build processes.
   - Example: **chore: Update dependencies**
- **fix:** A bug fix.
   - Use this type when you fix a bug or an issue in the existing codebase.
   - Example: **fix: Resolve memory leak issue**
- **test:** Adding missing tests or correcting existing tests.
   - Use this type when you add new tests to improve code coverage or fix existing tests that were incorrect or failing.
   - Example: **test: Add unit tests for user registration**
- **style:** Changes that do not affect the meaning of the code.
   - Use this type when you make changes that only affect the code's appearance, such as whitespace, indentation, or formatting adjustments.
   - Example: **style: Apply gofmt to the codebase**
- **refactor:** Refactoring code that neither fixes a bug nor adds a feature.
   - Use this type when you restructure existing code to improve its readability, performance, or maintainability without changing its functionality.
   - Example: **refactor: Optimize database query logic**

This will help maintain a clean and consistent commit history and make it easier for other developers to understand the changes made in each commit.
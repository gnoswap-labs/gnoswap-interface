# AGENT.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gnoswap Interface is a DEX (decentralized exchange) frontend powered by Gno.land. It's a Next.js 15 monorepo using Yarn Berry 4.10.3 workspaces, with the main application in `packages/web/`.

## Commands

```bash
# Development
yarn dev                    # Start dev server (all workspaces via ultra-runner)
yarn workspace @gnoswap-labs/web dev  # Start dev server (web only)

# Build
yarn build                  # Production build

# Tests
yarn test:ci                # All tests with coverage
yarn workspace @gnoswap-labs/web test  # Watch mode
npx jest --testPathPattern="path/to/file.spec.ts"  # Single test file (run from packages/web/)

# Linting & Formatting
yarn workspace @gnoswap-labs/web lint     # ESLint
yarn workspace @gnoswap-labs/web format   # Prettier

# Storybook
yarn storybook              # Start on port 6006
```

**Node.js**: v20 (see `.nvmrc`). Installed via nvm; corepack enables Yarn 4.10.3.

## Architecture

### Layer Organization

```text
packages/web/src/
├── pages/              # Next.js pages (SSG with getStaticProps for i18n)
├── layouts/            # Page composition — assembles containers into page layouts
├── containers/         # Smart components — orchestrate hooks/state, render presentational components
├── components/         # Presentational components — pure UI, receive all data via props
│   └── common/         # Shared UI components (token inputs, modals, pagination, etc.)
├── hooks/              # Custom hooks, organized by feature
│   └── <feature>/
│       ├── data/       # Data fetching and business logic hooks
│       └── ui/         # UI interaction hooks (modals, toggles)
├── react-query/        # TanStack Query hooks wrapping repository calls
├── repositories/       # Data access layer — interface + implementation classes
│   └── <feature>/
│       ├── request/    # Request DTOs
│       └── response/   # Response DTOs
├── services/           # Business logic (transaction building, gas estimation)
├── models/             # TypeScript interfaces/types with type guards
├── states/             # Jotai atoms organized by feature (exported as namespaces: TokenState, SwapState, etc.)
├── providers/          # React context providers (GnoswapServiceProvider is the DI root)
├── common/clients/     # Infrastructure clients (NetworkClient, StorageClient, WalletClient)
├── constants/          # App-wide constants (fee tiers, staking periods, chain config)
├── utils/              # Helper functions
└── styles/             # Theme and global styles (Emotion)
```

### Key Patterns

**Dependency Injection via Context**: `GnoswapServiceProvider` instantiates all repositories and services, injecting `NetworkClient`, `StorageClient`, etc. through constructors. Access them with `useGnoswapContext()`.

**Repository Pattern**: Each feature has an interface (`TokenRepository`) and implementation class (`TokenRepositoryImpl`). Repositories handle HTTP calls and storage. Mock implementations exist for testing.

**Data Flow**: Page → Layout → Container (hooks + state logic) → Presentational Component (props only).

**State Management**:
- **Jotai** for client-side global state (atoms in `states/`, accessed as `TokenState.balances`, `SwapState.swap`, etc.)
- **TanStack React Query v4** for server state — query hooks in `react-query/` with centralized `QUERY_KEY` enum

**Styling**: Emotion (`@emotion/styled`, `@emotion/react`) with `css` prop. JSX import source configured in tsconfig and babel.

### Path Aliases (tsconfig)

`@constants`, `@containers`, `@common`, `@components`, `@hooks`, `@repositories`, `@resources`, `@utils`, `@providers`, `@states`, `@styles`, `@layouts`, `@models`, `@query` (→ react-query), `@services`, `@app-types` (→ types), `@test` (→ test-utils), `@context`

## Coding Conventions

- **Commits**: Conventional Commits format — `feat:`, `fix:`, `chore:`, `test:`, `style:`, `refactor:`
- **Quotes**: Double quotes (enforced by ESLint and Prettier)
- **Semicolons**: Always
- **Print width**: 120
- **Trailing commas**: All
- **Arrow parens**: Avoid when possible (`x => x` not `(x) => x`)
- **No `any`**: `@typescript-eslint/no-explicit-any` is set to error
- **No unused vars**: Enforced via ESLint
- **Test files**: `*.spec.ts` / `*.spec.tsx` — excluded from ESLint (JS files, spec files, and stories are ignored)
- **Pre-commit hook**: Husky runs `yarn lint-staged` which applies `eslint --fix` to staged `.ts/.tsx/.js/.jsx` files

## Testing

- Jest 29 with jsdom environment
- `@testing-library/react` for component tests — wrap components in `JotaiProvider` and `GnoswapThemeProvider`
- Repository/service tests use `jest.fn().mockResolvedValue()` for async mocks
- Module aliases in `jest.config.js` mirror tsconfig paths

## i18n

- i18next with Next.js (`next-i18next`), 8 locales (en default)
- Translation files in `public/locales/<lang>/`
- Pages export `getStaticProps` with `serverSideTranslations(locale, namespaces)`
- Client uses chained backend: LocalStorage cache (1hr TTL) → HTTP fetch

## Environment

- `.env.example` in `packages/web/` documents all required vars
- Key categories: network/RPC config, contract paths (wUGNOT, GNS, router, pool, staker, etc.), feature flags (blocked pages), analytics (Umami)
- Variant env files: `.env.develop`, `.env.staging` — use `yarn dev:dev` or `yarn dev:stg` to load them

# Copilot instructions

SelfCare PNPG onboarding (PagoPA): React 18 + TypeScript SPA built with Vite, MUI v5 and `@pagopa/mui-italia`. Onboarding flow for "persone giuridiche" (PNPG). Node >= 24 (see `.node-version`), yarn 1 (classic).

## Commands

- `yarn start` – dev server
- `yarn build` – runs `generate`, then `vite build` (no `tsc`; run `yarn tsc --noEmit` separately)
- `yarn generate` – regenerates the onboarding API client into `src/api/generated/b4f-onboarding` from `openApi/onboarding-api-docs.json` (do not edit generated files; adjust `openApi/scripts/*` fix scripts instead)
- `yarn test` – Vitest (jsdom); single file: `yarn vitest run src/path/to/file.test.tsx`
- `yarn test:coverage`
- `yarn lint` / `yarn lint-autofix`, `yarn prettify`
- E2E: Playwright in `e2e/` (own `package.json`, `playwright.config.ts`)

## Architecture

- `src/routes.tsx` – route config rendered by `src/components/Main.tsx` (React Router v5); `src/views/Onboarding` – the onboarding flow.
- `src/api` – `OnboardingApiClient` wrapping the generated io-ts client (mocks in `src/api/__mocks__`); `src/services/onboardingService.ts` – service layer.
- `src/components` – shared UI (`Main`, `LoadingOverlay`, `OnboardingStepActions`, `withLogin`, `BodyLogger`); `src/hooks` (`useLogin`); `src/lib/context.ts`; `src/redux` (Redux Toolkit store); `src/utils` (constants, `env.ts`, `models`, `test-utils.tsx`).
- `src/locale` – i18next translations (`it`, `en`, `fr`, `de`, `sl`); every user-facing string must go through `t()` and be added to all locales.
- Shared auth/session/error handling comes from `@pagopa/selfcare-common-frontend`.

## Environment and mocks

- Config comes from `.env`, `.env.development.local` and `.env.test.local`, read via `import.meta.env` (typed in `src/vite-env.d.ts`) and exposed through `ENV` in `src/utils/env.ts`. Add new `VITE_*` variables to `vite-env.d.ts` and `.env`.
- `VITE_MOCK_API=true` enables mock behavior.
- `yarn generate` must be run before type-check/tests; generated clients are gitignored.

## Conventions

- Prettier: 100 cols, semicolons, single quotes, trailing commas `es5`.
- ESLint (`.eslintrc.js`) includes sonarjs, functional and react-hooks rules; keep lint clean.
- Functional components with hooks; Formik for forms; fp-ts/io-ts for decoding API responses.
- Tests live in `__tests__` folders next to the code, using Vitest + React Testing Library; globals are enabled and setup is in `src/setupTests.ts`.
- Never commit secrets.

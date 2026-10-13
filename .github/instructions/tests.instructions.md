---
applyTo: "**/*.test.ts,**/*.test.tsx,src/setupTests.ts,src/utils/test-utils.tsx,src/**/__mocks__/**"
---

# Unit test conventions

- Vitest (globals enabled) + React Testing Library; environment is jsdom.
- Tests sit in a `__tests__` folder next to the code under test, named `<Subject>.test.ts(x)`.
- `src/setupTests.ts` initializes i18n with all five locales (default `it`) and silences `console.error`/`console.warn`. Assert on visible Italian text or roles/labels; prefer `getByRole`/`getByLabelText` over test ids.
- Reuse `src/utils/test-utils.tsx` helpers for rendering with providers.
- `OnboardingApiClient` is mocked via `src/api/__mocks__`; extend it instead of re-mocking.
- Service tests (`src/services/__tests__`) mock the API client and assert on calls.
- Keep tests deterministic: no real timers/network, use `vi.useFakeTimers()` when needed and restore mocks.
- Run a single file with `yarn vitest run <path>`.

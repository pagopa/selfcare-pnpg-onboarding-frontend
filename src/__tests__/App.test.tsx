import { render, waitFor } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux';
import { createStore } from '../redux/store';
import { MemoryRouter, useLocation } from 'react-router';
import { expect, test } from 'vitest';

const LocationSpy = ({ onChange }: { onChange: (pathname: string) => void }) => {
  onChange(useLocation().pathname);
  return null;
};

const renderApp = (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = { pathname: '/' };
  render(
    <MemoryRouter>
      <Provider store={store}>
        <App />
      </Provider>
      <LocationSpy
        onChange={(pathname) => {
          // eslint-disable-next-line functional/immutable-data
          history.pathname = pathname;
        }}
      />
    </MemoryRouter>
  );
  return { store, history };
};

test('Test rendering', async () => {
  const { history } = renderApp();
  await waitFor(() => expect(history.pathname).toBe('/onboarding'));
});

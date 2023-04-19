import { render, waitFor } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux';
import { createStore } from '../redux/store';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';

const renderApp = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Router history={history}>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  );
  return { store, history };
};

test('Test rendering', async () => {
  const { history } = renderApp();
  await waitFor(() => expect(history.location.pathname).toBe('/onboarding'));
});

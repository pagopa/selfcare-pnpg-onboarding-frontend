import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { User } from '../../../types';
import { HeaderContext, UserContext } from '../../../lib/context';
import '../../../locale';
import { createStore } from '../../../redux/store';
import { Provider } from 'react-redux';
import { createMemoryHistory, MemoryHistory } from 'history';
import { Router } from 'react-router';
import Dashboard from '../Dashboard';

jest.setTimeout(30000);

jest.mock('../../../decorators/__mocks__/withParties');
jest.mock('../../../decorators/__mocks__/withSelectedParty');

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
    location: jest.fn(),
    state: { businessName: 'Ragione sociale success', businessTaxId: '00000000000' },
  }),
}));

const renderComponent = () => {
  const Component = () => {
    const history = createMemoryHistory() as MemoryHistory;
    const store = createStore();

    const [user, setUser] = useState<User | null>(null);
    const [subHeaderVisible, setSubHeaderVisible] = useState<boolean>(false);
    const [onExit, setOnExit] = useState<(exitAction: () => void) => void | undefined>();
    const [enableLogin, setEnableLogin] = useState<boolean>(true);

    return (
      <Router history={history}>
        <HeaderContext.Provider
          value={{
            subHeaderVisible,
            setSubHeaderVisible,
            onExit,
            setOnExit,
            enableLogin,
            setEnableLogin,
          }}
        >
          <UserContext.Provider
            value={{ user, setUser, requiredLogin: false, setRequiredLogin: () => {} }}
          >
            <Provider store={store}>
              <Dashboard />
            </Provider>
          </UserContext.Provider>
        </HeaderContext.Provider>
      </Router>
    );
  };

  render(<Component />);
};

test('Test: rendering', () => {
  renderComponent();
  waitFor(() => expect(screen.getAllByText('Panoramica').length).toBe(2));
  waitFor(() => screen.getByText('Area notifiche'));
});

/*
test.skip('Test: open drawer menu', () => {
  renderComponent();
  waitFor(() => expect(screen.getAllByText('Panoramica').length).toBe(2));
  const drawerMenuButton = screen.getAllByRole('heading', { level: 6 })[0];
  fireEvent.click(drawerMenuButton);
});

test.skip('Test: going to prod-pn-pg backOffice', () => {
  renderComponent();
  waitFor(() => screen.getByText('Area notifiche'));
  const backOfficeButton = screen.getAllByRole('heading', { level: 6 })[1];
  expect(backOfficeButton).toHaveTextContent('Vai alle');
  fireEvent.click(backOfficeButton);
  // await waitFor(() => expect(window.location.pathname).toBe('/onboarding-pnpg/dummyUrl'));
});

test.skip('Test: expected agency description and hover into tooltip, the expected test will be shown', () => {
  renderComponent();

  waitFor(() => screen.getByText('Modifica il logo dell’azienda'));

  const agencyTooltip = screen.getByRole('button', {
    name: 'Modifica il logo dell’azienda Inserisci solo il logo della tua azienda. Sarai responsabile dell’inserimento di immagini diverse da quella indicata.',
  });
  fireEvent.click(agencyTooltip);
}); */

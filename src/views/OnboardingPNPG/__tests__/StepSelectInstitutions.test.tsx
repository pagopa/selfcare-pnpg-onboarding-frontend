import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { InstitutionsPnPG, User } from '../../../../types';
import StepSelectInstitution from '../components/StepSelectInstitution';
import './../../../locale';
import { ROUTES } from '../../../utils/constants';
import { createMemoryHistory } from 'history';
import { Router, Switch, Route } from 'react-router';
import { useState } from 'react';
import { HeaderContext, UserContext } from '../../../lib/context';
import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import { ENV } from '../../../utils/env';

const mockOneAgencyRetrieved: InstitutionsPnPG = {
  businesses: [{ businessName: 'Mocked Agency 0', businessTaxId: '00000000000' }],
  legalTaxId: '10101010101',
  requestDateTime: 'datamocked0',
};

const mockTwoAgencyRetrieved: InstitutionsPnPG = {
  businesses: [
    { businessName: 'Mocked Agency 1', businessTaxId: '11111111111' },
    { businessName: 'Mocked Agency 2', businessTaxId: '22222222222' },
  ],
  legalTaxId: '12121212121',
  requestDateTime: 'datamocked0',
};

const history = createMemoryHistory();

const renderComponent = (
  oneRetrieved: boolean = false,
  injectedHistory?: ReturnType<typeof createMemoryHistory>,
  injectedStore?: ReturnType<typeof createStore>
) => {
  const Component = () => {
    const history = injectedHistory ? injectedHistory : createMemoryHistory();
    const store = injectedStore ? injectedStore : createStore();
    const [user, setUser] = useState<User | null>(null);
    const [subHeaderVisible, setSubHeaderVisible] = useState<boolean>(false);
    const [onExit, setOnExit] = useState<(exitAction: () => void) => void | undefined>();
    const [enableLogin, setEnableLogin] = useState<boolean>(true);

    if (!injectedHistory) {
      history.push(`/onboarding-pnpg`);
    }
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
            La registrazione è avvenuta con successo
            <button onClick={() => onExit?.(() => history.push(ENV.URL_FE.LOGOUT))}>LOGOUT</button>
            <Switch>
              <Route path="/onboarding-pnpg">
                <Provider store={store}>
                  <StepSelectInstitution
                    setActiveStep={() => {}}
                    retrievedInstitutions={
                      oneRetrieved ? mockOneAgencyRetrieved : mockTwoAgencyRetrieved
                    }
                  />
                </Provider>
              </Route>
            </Switch>
          </UserContext.Provider>
        </HeaderContext.Provider>
      </Router>
    );
  };
  render(<Component />);
};

test('One agency retrieved, the agency is auto-selected and enter button is enabled', async () => {
  renderComponent(true);

  await waitFor(() => screen.getByText('Seleziona l’azienda'));

  const enterButton = screen.getByRole('button', { name: 'Entra' });
  expect(enterButton).toBeEnabled();

  fireEvent.click(enterButton);

  await waitFor(() => expect(history.location.pathname).toBe('/'));

  await screen.getByText('La registrazione è avvenuta con successo');
  const enterDashboardButton = screen.getByText('Entra');
  fireEvent.click(enterDashboardButton);
});

test('Two or more agency retrieved, when we land in the page, the enter button is disabled', async () => {
  renderComponent();

  screen.getByText('A nome di quale azienda vuoi accedere?');

  const registerAgencyButton = screen.getByText('Registra azienda');
  expect(registerAgencyButton).toBeDisabled();

  const agencySelected = screen.getByRole('button', { name: 'Mocked Agency 1' });
  fireEvent.click(agencySelected);

  expect(registerAgencyButton).toBeEnabled();

  await waitFor(() => fireEvent.click(registerAgencyButton));
});

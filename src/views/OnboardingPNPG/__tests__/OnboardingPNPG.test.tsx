import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { InstitutionsPnPG, User } from '../../../../types';
import StepSelectInstitution from '../components/StepSelectInstitution';
import StepRetrieveInstitutions from '../components/StepRetrieveInstitutions';
import './../../../locale';
import { ROUTES } from '../../../utils/constants';
import { createMemoryHistory } from 'history';
import { Router, Switch, Route } from 'react-router';
import { useState } from 'react';
import { HeaderContext, UserContext } from '../../../lib/context';
import { ENV } from '../../../utils/env';
import OnboardingPNPG from '../OnboardingPNPG';
import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import StepAddCompany from '../components/StepAddCompany';

const oldWindowLocation = global.window.location;
const initialLocation = {
  assign: jest.fn(),
  pathname: '/onboarding-pnpg',
  origin: '',
  search: '',
  hash: '',
  state: undefined,
};
const mockedLocation = Object.assign({}, initialLocation);
const mockedHistoryPush = jest.fn();

beforeAll(() => {
  Object.defineProperty(window, 'location', { value: mockedLocation });
});
afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

beforeEach(() => Object.assign(mockedLocation, initialLocation));

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockedHistoryPush,
    location: mockedLocation,
    replace: (nextLocation) => Object.assign(mockedLocation, nextLocation),
  }),
}));

const history = createMemoryHistory();

const renderComponent = (
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
            <button onClick={() => onExit?.(() => history.push(ROUTES.PNPG_DASHBOARD.PATH))}>
              Entra
            </button>
            <button onClick={() => onExit?.(() => history.push(ENV.URL_FE.LOGOUT))}>LOGOUT</button>
            <Switch>
              <Route path="/onboarding-pnpg">
                <Provider store={store}>
                  <StepAddCompany setActiveStep={() => {}} />
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

test('Render test', async () => {
  renderComponent();
});

test('No agency retrieved, the insert fiscalCode UI will be shown ', async () => {
  renderComponent();

  await waitFor(() => screen.getByText('Aggiungi la tua impresa'));

  const continueButton = screen.getByText('Continua');
  expect(continueButton).toBeDisabled();

  const fiscalCodeInputField = document.getElementById('fiscalCode-textfield');

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: '3333333333' } });
  expect(continueButton).toBeDisabled();

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: '33333333333' } });
  expect(continueButton).toBeEnabled();

  fireEvent.click(continueButton);
  screen.getByText('La registrazione è avvenuta con successo');
  const enterDashboardButton = screen.getByText('Entra');
  fireEvent.click(enterDashboardButton);
  expect(history.location.pathname).toBe('/');
});

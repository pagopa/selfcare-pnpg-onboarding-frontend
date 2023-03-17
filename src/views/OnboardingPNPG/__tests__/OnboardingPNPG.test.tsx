import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { User } from '../../../types';
import { HeaderContext, UserContext } from '../../../lib/context';
import OnboardingPNPG from '../OnboardingPNPG';
import '../../../locale';
import { createStore } from '../../../redux/store';
import { Provider } from 'react-redux';
import { createMemoryHistory, MemoryHistory } from 'history';
import { Router } from 'react-router';
import { useHistory } from 'react-router-dom';

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

beforeAll(() => {
  Object.defineProperty(window, 'location', { value: mockedLocation });
});
afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

beforeEach(() => Object.assign(mockedLocation, initialLocation));

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
    location: mockedLocation,
    state: undefined,
    replace: (nextLocation) => Object.assign(mockedLocation, nextLocation),
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
              <OnboardingPNPG />
            </Provider>
          </UserContext.Provider>
        </HeaderContext.Provider>
      </Router>
    );
  };

  render(<Component />);
};

test('Test: Render test', async () => {
  renderComponent();
});

test('Test: Onboarding flow after retrieve institution from Infocamere, with successful registration on submit', async () => {
  renderComponent();
  const history = useHistory();
  const pushSpy = jest.spyOn(history, 'push');
  await waitFor(() => screen.getByText('A nome di quale azienda vuoi accedere?'));
  const registerAgencyButton = screen.getByText('Registra azienda');
  expect(registerAgencyButton).toBeDisabled();

  const agencySuccess = screen.getByRole('button', { name: 'BusinessName success' });
  fireEvent.click(agencySuccess);

  expect(registerAgencyButton).toBeEnabled();

  fireEvent.click(registerAgencyButton);

  await waitFor(() => screen.getByText('La registrazione è avvenuta con successo'));
  const enterDashboardButton = screen.getByText('Entra');
  fireEvent.click(enterDashboardButton);
});

test('Test: Onboarding flow after retrieve institution from Infocamere with alreadyOnboarded outcome on submit', async () => {
  renderComponent();
  await waitFor(() => screen.getByText('A nome di quale azienda vuoi accedere?'));
  const registerAgencyButton = screen.getByText('Registra azienda');
  expect(registerAgencyButton).toBeDisabled();

  const agencyAlreadyOnboarded = screen.getByRole('button', {
    name: 'BusinessName alreadyOnboarded',
  });
  fireEvent.click(agencyAlreadyOnboarded);

  expect(registerAgencyButton).toBeEnabled();

  fireEvent.click(registerAgencyButton);

  await waitFor(() =>
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      "L'Ente che hai scelto ha già aderito"
    )
  );
  screen.getByText('Entra');
});

test('Test: Onboarding flow after retrieve institution from Infocamere with genericError outcome on submit', async () => {
  renderComponent();
  await waitFor(() => screen.getByText('A nome di quale azienda vuoi accedere?'));
  const registerAgencyButton = screen.getByText('Registra azienda');
  expect(registerAgencyButton).toBeDisabled();

  const agencyGenericError = screen.getByRole('button', { name: 'BusinessName genericError' });
  fireEvent.click(agencyGenericError);

  expect(registerAgencyButton).toBeEnabled();

  fireEvent.click(registerAgencyButton);

  await waitFor(() =>
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Qualcosa è andato storto')
  );
  const enterDashboardButton = screen.getByText('Torna all’accesso');
  fireEvent.click(enterDashboardButton);
});

test('Test: In the add agency flow via taxCode, when inserting a taxCode that NOT match with legalAddress and AdE APIs, the "no companies found" UI will be show', async () => {
  renderComponent();

  await waitFor(() => screen.getByText('A nome di quale azienda vuoi accedere?'));
  const onboardingViaTaxCodeFlowButton = screen.getByText('Registra nuova azienda');
  fireEvent.click(onboardingViaTaxCodeFlowButton);

  screen.getByText('Aggiungi la tua impresa');

  const continueButton = screen.getByText('Continua');
  expect(continueButton).toBeDisabled();

  const fiscalCodeInputField = document.getElementById('fiscalCode-textfield');

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: '3333333333' } });
  expect(continueButton).toBeDisabled();

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: '33333333333' } });
  expect(continueButton).toBeEnabled();

  fireEvent.click(continueButton);
  await waitFor(() => screen.getByText('Nessuna azienda trovata'));

  const backToAccessButton = screen.getByText('Torna all’accesso');
  fireEvent.click(backToAccessButton);
});

test('Test: In the add agency flow via taxCode, when inserting a taxCode that MATCH with legalAddress API, the "matched but not LR" UI will be show', async () => {
  renderComponent();

  await waitFor(() => screen.getByText('A nome di quale azienda vuoi accedere?'));
  const onboardingViaTaxCodeFlowButton = screen.getByText('Registra nuova azienda');
  fireEvent.click(onboardingViaTaxCodeFlowButton);

  screen.getByText('Aggiungi la tua impresa');

  const continueButton = screen.getByText('Continua');
  expect(continueButton).toBeDisabled();

  const fiscalCodeInputField = document.getElementById('fiscalCode-textfield');

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: '7777777777' } });
  expect(continueButton).toBeDisabled();

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: '77777777777' } });
  expect(continueButton).toBeEnabled();

  fireEvent.click(continueButton);
  await waitFor(() =>
    expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent(
      'Abbiamo riscontrato la tua azienda nel nostro database, ma non ne risulti il legale rappresentante.'
    )
  );

  const backToAccessButton = screen.getByText('Torna all’accesso');
  fireEvent.click(backToAccessButton);
});

test('Test: In the add agency flow via taxCode, when inserting a taxCode that NOT match with legalAddress API but match with AdE API, the success page will be show', async () => {
  renderComponent();

  await waitFor(() => screen.getByText('A nome di quale azienda vuoi accedere?'));
  const onboardingViaTaxCodeFlowButton = screen.getByText('Registra nuova azienda');
  fireEvent.click(onboardingViaTaxCodeFlowButton);

  screen.getByText('Aggiungi la tua impresa');

  const continueButton = screen.getByText('Continua');
  expect(continueButton).toBeDisabled();

  const fiscalCodeInputField = document.getElementById('fiscalCode-textfield');

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: '5555555555' } });
  expect(continueButton).toBeDisabled();

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: '55555555555' } });
  expect(continueButton).toBeEnabled();

  fireEvent.click(continueButton);

  await waitFor(() =>
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      'La registrazione è avvenuta'
    )
  );
  screen.getByText('Entra');
});

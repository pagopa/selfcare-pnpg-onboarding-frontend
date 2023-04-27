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
  pathname: '/onboarding',
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
  await waitFor(() => screen.getByText('Che impresa vuoi registrare?'));
  const registerAgencyButton = screen.getByText('Registra impresa');
  expect(registerAgencyButton).toBeDisabled();

  const agencySuccess = screen.getByRole('button', { name: 'BusinessName success' });
  fireEvent.click(agencySuccess);

  expect(registerAgencyButton).toBeEnabled();

  fireEvent.click(registerAgencyButton);

  screen.getByText('Qual è l’indirizzo PEC dell’impresa?');

  const continueButton = screen.getByRole('button', { name: 'Continua' });
  expect(continueButton).toBeDisabled();

  const businessEmailInputField = document.getElementById('email-textfield');
  await waitFor(() =>
    fireEvent.change(businessEmailInputField as HTMLElement, {
      target: { value: 'mockemail@email.com' },
    })
  );

  expect(continueButton).toBeEnabled();
  fireEvent.click(continueButton);
});

test('Test: Onboarding flow after retrieve institution from Infocamere with alreadyOnboarded outcome on submit', async () => {
  renderComponent();
  await waitFor(() => screen.getByText('Che impresa vuoi registrare?'));
  const registerAgencyButton = screen.getByText('Registra impresa');
  expect(registerAgencyButton).toBeDisabled();

  const agencyAlreadyOnboarded = screen.getByRole('button', {
    name: 'BusinessName alreadyOnboarded',
  });
  fireEvent.click(agencyAlreadyOnboarded);

  expect(registerAgencyButton).toBeEnabled();

  fireEvent.click(registerAgencyButton);

  screen.getByText('Qual è l’indirizzo PEC dell’impresa?');

  const continueButton = screen.getByRole('button', { name: 'Continua' });
  expect(continueButton).toBeDisabled();

  const businessEmailInputField = document.getElementById('email-textfield');
  await waitFor(() =>
    fireEvent.change(businessEmailInputField as HTMLElement, {
      target: { value: 'mockemail@email.com' },
    })
  );

  expect(continueButton).toBeEnabled();
  fireEvent.click(continueButton);
});

test('Test: Onboarding flow after retrieve institution from Infocamere with genericError outcome on submit', async () => {
  renderComponent();
  await waitFor(() => screen.getByText('Che impresa vuoi registrare?'));
  const registerAgencyButton = screen.getByText('Registra impresa');
  expect(registerAgencyButton).toBeDisabled();

  const agencyGenericError = screen.getByRole('button', { name: 'BusinessName genericError' });
  fireEvent.click(agencyGenericError);

  expect(registerAgencyButton).toBeEnabled();

  fireEvent.click(registerAgencyButton);

  screen.getByText('Qual è l’indirizzo PEC dell’impresa?');

  const continueButton = screen.getByRole('button', { name: 'Continua' });
  expect(continueButton).toBeDisabled();

  const businessEmailInputField = document.getElementById('email-textfield');
  await waitFor(() =>
    fireEvent.change(businessEmailInputField as HTMLElement, {
      target: { value: 'mockemail@email.com' },
    })
  );

  expect(continueButton).toBeEnabled();
  await waitFor(() => fireEvent.click(continueButton));
});

test('Test: In the add agency flow via taxCode, when inserting a taxCode that NOT match with legalAddress and AdE APIs, the "no companies found" UI will be show', async () => {
  renderComponent();

  await waitFor(() => screen.getByText('Che impresa vuoi registrare?'));
  const onboardingViaTaxCodeFlowButton = screen.getByText('Cercala tramite Codice Fiscale');
  fireEvent.click(onboardingViaTaxCodeFlowButton);

  screen.getByText('Che impresa vuoi registrare?');

  const continueButton = screen.getByText('Continua');
  expect(continueButton).toBeDisabled();

  const fiscalCodeInputField = document.getElementById('fiscalCode-textfield');

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: '3333333333' } });
  expect(continueButton).toBeDisabled();

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: '33333333333' } });
  expect(continueButton).toBeEnabled();

  fireEvent.click(continueButton);
  await waitFor(() => screen.getByText('Nessuna impresa trovata'));

  const backToAccessButton = screen.getByText('Chiudi');
  fireEvent.click(backToAccessButton);
});

test('Test: In the add agency flow via taxCode, when inserting a taxCode that MATCH with legalAddress API, the "matched but not LR" UI will be show', async () => {
  renderComponent();

  await waitFor(() => screen.getByText('Che impresa vuoi registrare?'));
  const onboardingViaTaxCodeFlowButton = screen.getByText('Cercala tramite Codice Fiscale');
  fireEvent.click(onboardingViaTaxCodeFlowButton);

  screen.getByText('Che impresa vuoi registrare?');

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

  await waitFor(() => screen.getByText('Che impresa vuoi registrare?'));
  const onboardingViaTaxCodeFlowButton = screen.getByText('Cercala tramite Codice Fiscale');
  fireEvent.click(onboardingViaTaxCodeFlowButton);

  screen.getByText('Che impresa vuoi registrare?');

  const continueButton = screen.getByText('Continua');
  expect(continueButton).toBeDisabled();

  const fiscalCodeInputField = document.getElementById('fiscalCode-textfield');

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: '5555555555' } });
  expect(continueButton).toBeDisabled();

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: '55555555555' } });
  expect(continueButton).toBeEnabled();

  fireEvent.click(continueButton);

  await waitFor(() => screen.getByText('Inserisci i dati della tua impresa'));

  const forwardButton = screen.getByRole('button', { name: 'Continua' });
  expect(forwardButton).toBeDisabled();

  const businessNameInputField = document.getElementById('businessname-textfield');
  await waitFor(() =>
    fireEvent.change(businessNameInputField as HTMLElement, {
      target: { value: 'testBusinessName1' },
    })
  );

  const businessEmailInputField = document.getElementById('email-textfield');
  await waitFor(() =>
    fireEvent.change(businessEmailInputField as HTMLElement, {
      target: { value: 'mockemail@email.com' },
    })
  );

  expect(forwardButton).toBeEnabled();
  await waitFor(() => fireEvent.click(forwardButton));
});

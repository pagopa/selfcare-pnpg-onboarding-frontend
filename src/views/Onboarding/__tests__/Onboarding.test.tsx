import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useEffect, useState } from 'react';
import { User } from '../../../types';
import { HeaderContext, UserContext } from '../../../lib/context';
import Onboarding from '../Onboarding';
import '../../../locale';
import { createStore } from '../../../redux/store';
import { Provider } from 'react-redux';
import { createMemoryHistory, MemoryHistory } from 'history';
import { Router } from 'react-router';
import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import React from 'react';
import { loggedUser } from '../../../api/__mocks__/OnboardingApiClient';

jest.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', () => ({
  storageUserOps: {
    read: () => ({
      uid: 'mockUid',
      name: 'mockName',
      surname: 'mockSurname',
      role: 'MANAGER',
    }),
  },
  storageTokenOps: {
    read: () => 'testToken',
    write: () => 'testToken',
  },
}));

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
    location: mockedLocation,
    state: undefined,
    replace: (nextLocation) => Object.assign(mockedLocation, nextLocation),
  }),
}));

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
  i18n.changeLanguage('it');
});

beforeEach(() => Object.assign(mockedLocation, initialLocation));

afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

const renderComponent = () => {
  const Component = () => {
    const history = createMemoryHistory() as MemoryHistory;
    const store = createStore();

    const [user, setUser] = useState<User | null>();
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
            value={{ user: loggedUser, setUser: () => {}, requiredLogin: false, setRequiredLogin: () => {} }}
          >
            <Provider store={store}>
              <Onboarding />
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

test('Test: Success onboarding with data retrieved from IC', async () => {
  renderComponent();
  await executeStepAddCompany('12323231321');
  await executeStepBusinessData(false);

  await waitFor(() => screen.getByText('Impresa registrata!'));

  const signInButton = screen.getByText('Continua su SEND');
  fireEvent.click(signInButton);
});

test('Test: Success onboarding with data retrieved from AdE', async () => {
  renderComponent();
  await executeStepAddCompany('22334455667');
  await executeStepBusinessData(true);

  await waitFor(() => screen.getByText('Impresa registrata!'));

  const signInButton = screen.getByText('Continua su SEND');
  fireEvent.click(signInButton);
});

test('Test: NOT success onboarding with data retrieved from IC', async () => {
  renderComponent();
  await executeStepAddCompany('24242424243');
  await executeStepBusinessData(false);

  await waitFor(() => screen.getByText('Si è verificato un errore'));

  const closeButton = screen.getByText('Chiudi');
  fireEvent.click(closeButton);
});

test('Test: NOT success onboarding with data retrieved from AdE', async () => {
  renderComponent();
  await executeStepAddCompany('22222222222');
  await executeStepBusinessData(true);

  await waitFor(() => screen.getByText('Si è verificato un errore'));

  const closeButton = screen.getByText('Chiudi');
  fireEvent.click(closeButton);
});

test('Test: Success access to dashboard with the business already on send and a loggedUser that isn’t manager but it’s LR', async () => {
  renderComponent();
  await executeStepAddCompany('51515151511');
  // await executeStepBusinessData(false);

  await waitFor(() => screen.getByText('L’impresa ha già un profilo su SEND'));

  const signInButton = screen.getByText('Accedi');
  fireEvent.click(signInButton);
});

const executeStepAddCompany = async (typedFiscalCode: string) => {
  await waitFor(() => screen.getByText('Inserisci il Codice Fiscale'));

  const continueButton = screen.getByText('Continua');
  expect(continueButton).toBeDisabled();

  const fiscalCodeInputField = document.getElementById('fiscalCode-textfield');

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: '1234563' } });
  expect(continueButton).toBeDisabled();

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: '123456323A' } });
  screen.getByText('Formato non corretto, controlla il dato e riprova');
  expect(continueButton).toBeDisabled();

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: typedFiscalCode } });
  expect(continueButton).toBeEnabled();

  fireEvent.click(continueButton);
};

const executeStepBusinessData = async (notCertified?: boolean) => {
  await waitFor(() => screen.getByText(/L’impresa non ha ancora un profilo su SEND/));
  fireEvent.click(screen.getByText('Inizia'));

  await waitFor(() => screen.getByText('Completa i dati dell’impresa'));

  const continueButton = screen.getByRole('button', { name: 'Registra impresa' });
  expect(continueButton).toBeDisabled();

  const businessEmailInputField = document.getElementById('email-textfield');
  await waitFor(() =>
    fireEvent.change(businessEmailInputField as HTMLElement, {
      target: { value: 'test@' },
    })
  );
  expect(continueButton).toBeDisabled();
  await waitFor(() => screen.getByText("L'indirizzo e-mail inserito non è corretto"));

  fireEvent.change(businessEmailInputField as HTMLElement, {
    target: { value: 'mockemail@email.com' },
  });

  if (notCertified) {
    await waitFor(() =>
      screen.getByText(
        'La verifica dei dati precompilati è stata effettuata tramite il Registro Imprese di Agenzia delle Entrate'
      )
    );
    expect(continueButton).toBeDisabled();
    const businessNameInputField = document.getElementById('businessname-textfield');
    await waitFor(() =>
      fireEvent.change(businessNameInputField as HTMLElement, {
        target: { value: '   ' },
      })
    );
    screen.getByText('Inserisci una ragione sociale');
    expect(continueButton).toBeDisabled();

    await waitFor(() =>
      fireEvent.change(businessNameInputField as HTMLElement, {
        target: { value: 'testBusinessName1' },
      })
    );
    expect(continueButton).toBeEnabled();
  } else {
    screen.getByText(
      'La verifica dei dati precompilati è stata effettuata tramite il Registro Imprese di InfoCamere'
    );
    expect(continueButton).toBeEnabled();
  }
  fireEvent.click(continueButton);
};

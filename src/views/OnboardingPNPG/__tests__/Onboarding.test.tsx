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
            value={{ user, setUser, requiredLogin: false, setRequiredLogin: () => {} }}
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

test('Test: Onboarding flow after retrieve business from Infocamere, with successful registration on submit', async () => {
  renderComponent();
  await executeStepSelectBusiness('BusinessName success');
  await executeStepBusinessData();

  await waitFor(() => screen.getByText('Impresa registrata!'));

  const signInButton = screen.getByText('Accedi');
  fireEvent.click(signInButton);
});

test('Test: Onboarding flow after retrieve business from Infocamere with alreadyOnboarded outcome on submit', async () => {
  renderComponent();
  await executeStepSelectBusiness('BusinessName alreadyOnboarded');

  await waitFor(() => screen.getByText('Impresa già registrata'));

  const signInButton = screen.getByText('Accedi');
  fireEvent.click(signInButton);
});

test('Test: Onboarding flow after retrieve business from Infocamere with genericError outcome on submit', async () => {
  renderComponent();
  await executeStepSelectBusiness('BusinessName genericError');
  await executeStepBusinessData();

  await waitFor(() => screen.getByText('Impresa non registrata'));

  const backToAccessButton = screen.getByText('Chiudi');
  fireEvent.click(backToAccessButton);
});

test('Test: In the add agency flow via taxCode, when inserting a taxCode that NOT match with legalAddress and AdE APIs, the "no business found" UI will be show', async () => {
  renderComponent();
  await executeStepSelectBusiness();
  await executeStepAddCompany('33333333333');

  await waitFor(() =>
    screen.getByText(
      'Dal tuo SPID non risulti essere Legale Rappresentante dell’impresa associata a questo Codice Fiscale',
      { exact: false }
    )
  );

  const backToAccessButton = screen.getByText('Chiudi');
  fireEvent.click(backToAccessButton);
});

test('Test: In the add agency flow via taxCode, when inserting a taxCode that MATCH with legalAddress API, the "matched but not LR" UI will be show', async () => {
  renderComponent();
  await executeStepSelectBusiness();
  await executeStepAddCompany('77777777777');

  await waitFor(() => screen.getByText(`Non puoi registrare\ questa impresa`));

  const backToAccessButton = screen.getByText('Chiudi');
  fireEvent.click(backToAccessButton);
});

test('Test: In the add agency flow via taxCode, when inserting a taxCode of already onboarded business that NOT match with legalAddress API but match with AdE API, the already onboarded page will be show', async () => {
  renderComponent();
  await executeStepSelectBusiness();
  await executeStepAddCompany('51515151511');

  await waitFor(() => screen.getByText('Impresa già registrata'));

  const signInButton = screen.getByText('Accedi');
  fireEvent.click(signInButton);
});

test('Test: In the add agency flow via taxCode, when inserting a taxCode of NOT already onboarded business that NOT match with legalAddress API but match with AdE API, the success page will be show', async () => {
  renderComponent();
  await executeStepSelectBusiness();
  await executeStepAddCompany('55555555555');
  await executeStepBusinessData(true);

  await waitFor(() => screen.getByText('Impresa registrata!'));

  const signInButton = screen.getByText('Accedi');
  fireEvent.click(signInButton);
});

test('Test: In the add agency flow via taxCode, when inserting a taxCode written in an incorrect data format, the invalidInputFormat page will be show', async () => {
  renderComponent();
  await executeStepSelectBusiness();
  await executeStepAddCompany('11111111111');

  await waitFor(() => screen.getByText('Il Codice Fiscale/Partita IVA non è corretto'));

  const goBackButton = screen.getByText('Torna indietro');
  fireEvent.click(goBackButton);
});

const executeStepSelectBusiness = async (businessName?: string) => {
  await waitFor(() => screen.getByText('Che impresa vuoi registrare?'));
  const registerAgencyButton = screen.getByText('Registra impresa');
  expect(registerAgencyButton).toBeDisabled();

  if (businessName) {
    const agencySuccess = screen.getByRole('button', { name: businessName });
    fireEvent.click(agencySuccess);

    expect(registerAgencyButton).toBeEnabled();

    fireEvent.click(registerAgencyButton);
  } else {
    const onboardingViaTaxCodeFlowButton = screen.getByText('Cercala tramite Codice Fiscale');
    fireEvent.click(onboardingViaTaxCodeFlowButton);
  }
};

const executeStepAddCompany = async (typedFiscalCode: string) => {
  await waitFor(() => screen.getByText('Che impresa vuoi registrare?'));

  const continueButton = screen.getByText('Continua');
  expect(continueButton).toBeDisabled();

  const fiscalCodeInputField = document.getElementById('fiscalCode-textfield');

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: '1234563' } });
  expect(continueButton).toBeDisabled();

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: typedFiscalCode } });
  expect(continueButton).toBeEnabled();

  fireEvent.click(continueButton);
};

const executeStepBusinessData = async (notCertified?: boolean) => {
  if (notCertified) {
    await waitFor(() => screen.getByText('Inserisci i dati della tua impresa'));
  } else {
    await waitFor(() => screen.getByText('Qual è l’indirizzo PEC dell’impresa?'));
  }

  const continueButton = screen.getByRole('button', { name: 'Continua' });
  expect(continueButton).toBeDisabled();

  const businessEmailInputField = document.getElementById('email-textfield');
  fireEvent.change(businessEmailInputField as HTMLElement, {
    target: { value: 'test@' },
  });
  expect(continueButton).toBeDisabled();
  screen.getByText("L'indirizzo e-mail inserito non è corretto");

  fireEvent.change(businessEmailInputField as HTMLElement, {
    target: { value: 'mockemail@email.com' },
  });

  if (notCertified) {
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
    expect(continueButton).toBeEnabled();
  }
  fireEvent.click(continueButton);
};

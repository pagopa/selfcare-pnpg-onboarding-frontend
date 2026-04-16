import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { afterAll, afterEach, beforeAll, beforeEach, test, vi } from 'vitest';
import { loggedUser } from '../../../api/__mocks__/OnboardingApiClient';
import { HeaderContext, UserContext } from '../../../lib/context';
import '../../../locale';
import { createStore } from '../../../redux/store';
import * as onboardingService from '../../../services/onboardingService';
import { executeStepAddCompany, executeStepBusinessData, executeStepSuccess } from '../../../utils/test-utils';
import Onboarding from '../Onboarding';

vi.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', () => ({
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
  isPagoPaUser: () => false,
}));

vi.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: vi.fn(),
    location: mockedLocation,
    state: undefined,
    replace: (nextLocation: any) => Object.assign(mockedLocation, nextLocation),
  }),
}));

const oldWindowLocation = global.window.location;
const initialLocation = {
  assign: vi.fn(),
  pathname: '/onboarding',
  origin: '',
  search: '',
  hash: '',
  state: undefined,
};
const mockedLocation = Object.assign({}, initialLocation);

beforeAll(async () => {
  Object.defineProperty(window, 'location', { value: mockedLocation });
  await i18n.changeLanguage('it');
});

beforeEach(() => Object.assign(mockedLocation, initialLocation));

afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

afterEach(() => {
  vi.restoreAllMocks();
});

const renderComponent = () => {
  const Component = () => {
    const history = createMemoryHistory() as MemoryHistory;
    const store = createStore();
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
            value={{
              user: loggedUser,
              setUser: () => {},
              requiredLogin: false,
              setRequiredLogin: () => {},
            }}
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
  await executeStepSuccess();
});

test('Test: Success onboarding with data retrieved from AdE', async () => {
  renderComponent();
  await executeStepAddCompany('22334455667');
  await executeStepBusinessData(true);
  await executeStepSuccess();
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

test('Test: Success access to dashboard with the business already on send and a loggedUser that is not manager but it is LR', async () => {
  vi.spyOn(onboardingService, 'searchUser').mockResolvedValueOnce({ id: '2' });

  vi.spyOn(onboardingService, 'checkManager').mockResolvedValueOnce({ result: false });

  renderComponent();
  await executeStepAddCompany('51515151511');

  await waitFor(() => screen.getByText('Accedi'), { timeout: 5000 });

  const signInButton = screen.getByText('Accedi');
  fireEvent.click(signInButton);
});

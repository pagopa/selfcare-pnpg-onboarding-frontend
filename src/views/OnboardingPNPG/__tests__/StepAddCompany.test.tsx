import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { User } from '../../../../types';
import '../../../locale';
import { createMemoryHistory, MemoryHistory } from 'history';
import { Router, Switch, Route } from 'react-router';
import { useState } from 'react';
import { HeaderContext, UserContext } from '../../../lib/context';
import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import StepAddCompany from '../components/StepAddCompany';

jest.setTimeout(10000);

const renderComponent = (
  injectedHistory?: MemoryHistory<unknown>,
  injectedStore?: ReturnType<typeof createStore>
) => {
  const Component = () => {
    const history = injectedHistory ? injectedHistory : createMemoryHistory();
    const store = injectedStore ? injectedStore : createStore();
    const [user, setUser] = useState<User | null>(null);
    const [subHeaderVisible, setSubHeaderVisible] = useState<boolean>(false);
    const [enableLogin, setEnableLogin] = useState<boolean>(true);
    const [activeStep, setActiveStep] = useState(0);

    if (!injectedHistory) {
      history.push(`/onboarding-pnpg`);
    }
    return (
      <Router history={history}>
        <HeaderContext.Provider
          value={{
            subHeaderVisible,
            setSubHeaderVisible,
            enableLogin,
            setEnableLogin,
          }}
        >
          <UserContext.Provider
            value={{ user, setUser, requiredLogin: false, setRequiredLogin: () => {} }}
          >
            <Route path="/onboarding-pnpg">
              <Provider store={store}>
                <StepAddCompany setActiveStep={(step) => setActiveStep(step)} />
              </Provider>
            </Route>
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

test('In the add agency flow, when inserting a taxCode that NOT match with legalAddress and AdE APIs, the "no companies found" UI will be show', async () => {
  renderComponent();

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

test('In the add agency flow, when inserting a taxCode that MATCH with legalAddress API, the "matched but not LR" UI will be show', async () => {
  renderComponent();

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
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      'Abbiamo riscontrato la tua azienda nel nostro database, ma non ne risulti il legale rappresentante.'
    )
  );

  const backToAccessButton = screen.getByText('Torna all’accesso');
  fireEvent.click(backToAccessButton);
});

test('In the add agency flow, when inserting a taxCode that NOT match with legalAddress API but match with AdE API, the success page will be show', async () => {
  renderComponent();

  screen.getByText('Aggiungi la tua impresa');

  const continueButton = screen.getByText('Continua');
  expect(continueButton).toBeDisabled();

  const fiscalCodeInputField = document.getElementById('fiscalCode-textfield');

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: '5555555555' } });
  expect(continueButton).toBeDisabled();

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: '55555555555' } });
  expect(continueButton).toBeEnabled();

  fireEvent.click(continueButton);
});

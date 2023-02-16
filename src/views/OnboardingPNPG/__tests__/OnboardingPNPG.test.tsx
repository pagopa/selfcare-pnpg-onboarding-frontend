import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { useState } from 'react';
import { render } from 'react-dom';
import { User } from '../../../../types';
import { loggedUser } from '../../../api/__mocks__/DashboardPnPgApiClient';
import { HeaderContext, UserContext } from '../../../lib/context';
import { ENV } from '../../../utils/env';
import OnboardingPNPG from '../OnboardingPNPG';

const renderComponent = () => {
  const Component = () => {
    const [user, setUser] = useState<User | null>(loggedUser);
    const [subHeaderVisible, setSubHeaderVisible] = useState<boolean>(false);
    const [onExit, setOnExit] = useState<(exitAction: () => void) => void | undefined>();
    const [enableLogin, setEnableLogin] = useState<boolean>(true);

    return (
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
          <button onClick={() => onExit?.(() => window.location.assign(ENV.URL_FE.LOGOUT))}>
            LOGOUT
          </button>
          <OnboardingPNPG />
        </UserContext.Provider>
      </HeaderContext.Provider>
    );
  };

  render(<Component />);
};

test('No agency retrieved, the insert fiscalCode UI will be shown ', async () => {
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
  screen.getByText('La registrazione è avvenuta con successo');
  const enterDashboardButton = screen.getByText('Entra');
  fireEvent.click(enterDashboardButton);
  expect(window.location).toBe('/dashboardpg');
});

test('One agency retrieved, the agency is auto-selected and enter button is enabled', async () => {
  renderComponent();

  screen.getByText('Seleziona l’azienda');

  const enterButton = screen.getByText('Entra');
  expect(enterButton).toBeEnabled();

  fireEvent.click(enterButton);
  screen.getByText('La registrazione è avvenuta con successo');
  const enterDashboardButton = screen.getByText('Entra');
  fireEvent.click(enterDashboardButton);
  expect(window.location).toBe('/dashboardpg');
});

test('Two or more agency retrieved, when we land in the page, the enter button is disabled', async () => {
  renderComponent();

  screen.getByText('A nome di quale azienda vuoi accedere?');

  const registerAgencyButton = screen.getByText('Registra azienda');
  expect(registerAgencyButton).toBeDisabled();

  const agencySelected = screen.getByRole('button', { name: 'Ragione Sociale success' });
  fireEvent.click(agencySelected);

  expect(registerAgencyButton).toBeEnabled();

  fireEvent.click(registerAgencyButton);
  expect(window.location).toBe('/dashboardpg');
});

test('Click in the "Registra nuova azienda" should be redirect in "Insert CF UI', async () => {
  renderComponent();

  const registerNewAgencyLink = screen.getByText('Registra nuova azienda');
  fireEvent.click(registerNewAgencyLink);

  screen.getByText('Aggiungi la tua impresa');
  const continueButton = screen.getByText('Continua');
  expect(continueButton).toBeDisabled();
});

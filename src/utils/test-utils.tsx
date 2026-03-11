/* eslint-disable functional/no-let */
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as onboardingService from '../services/onboardingService';

export const executeStepAddCompany = async (typedFiscalCode: string) => {
  await waitFor(() => screen.getByText('Inserisci il Codice Fiscale'));

  const continueButton = screen.getByText('Continua');

  const fiscalCodeInputField = document.getElementById('fiscalCode-textfield');

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: '1234563' } });

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: '123456323A' } });
  screen.getByText('Formato non corretto, controlla il dato e riprova');
  expect(continueButton).toBeDisabled();

  fireEvent.change(fiscalCodeInputField as Element, { target: { value: typedFiscalCode } });
  expect(continueButton).toBeEnabled();

  fireEvent.click(continueButton);
};

export const executeStepBusinessData = async (notCertified?: boolean) => {
  await waitFor(() => screen.getByText(/L.impresa non ha ancora un profilo su SEND/));
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

export const executeStepSuccess = async () => {
  const mockResponse = {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => [
      {
        institutionId: 'retrievedPartyId01',
        businessName: 'mockedBusinessName',
        onboardings: [
          {
            billing: 'mockedBilling',
            createdAt: new Date('2024-10-15T03:24:00').toISOString(),
            productId: 'prod-pn-pg',
            status: 'ACTIVE',
          },
        ],
      },
    ],
  } as Response;

  const getInstitutionOnboardingInfoMock = vi.spyOn(
    onboardingService,
    'getInstitutionOnboardingInfo'
  );
  getInstitutionOnboardingInfoMock.mockResolvedValueOnce(mockResponse);

  await waitFor(() => screen.getByText('Impresa registrata!'));
  const signInButton = screen.getByText('Continua su SEND');
  fireEvent.click(signInButton);
};

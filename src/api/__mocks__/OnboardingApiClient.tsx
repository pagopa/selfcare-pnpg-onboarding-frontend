import { User } from '../../types';
import { InstitutionOnboardingResource } from '../generated/b4f-onboarding/InstitutionOnboardingResource';
import { VerifyManagerResponse } from '../generated/b4f-onboarding/VerifyManagerResponse';
import { CheckManagerResponse } from '../generated/b4f-onboarding/CheckManagerResponse';

export const loggedUser: User = {
  uid: '00123',
  name: 'mockedUserName',
  surname: 'mockedUserSurname',
  taxCode: 'MCCDLL91C25B115B',
  email: 'email@mockemail.com',
};

export const mockedOnboardingApi = {
  onboardingPGSubmit: (businessId: string): Promise<boolean> => {
    if (businessId === '22222222222' || businessId === '24242424243') {
      return new Promise(() => {
        const error = new Error(`Unexpected mocked HTTP status! Expected 201 obtained 404`);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line functional/immutable-data
        error.httpStatus = 404;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line functional/immutable-data
        error.httpBody = {
          statusCode: 404,
          description: 'Not found',
        };
        console.error(JSON.stringify(error));
        throw error;
      });
    }
    return new Promise((resolve) => resolve(true));
  },

  onboardingUsersSubmit: (): Promise<boolean> => new Promise((resolve) => resolve(true)),

  getInstitutionOnboardingInfo: (
    taxCode: string
  ): Promise<Array<InstitutionOnboardingResource> | Response> => {
    switch (taxCode) {
      case '01501320442':
      case '51515151511':
      case '11223344556':
        // Creiamo una risposta "Response" simulata con i dati mockati
        const mockResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => [
            {
              institutionId: 'retrievedPartyId01',
              onboardings: [
                {
                  billing: 'mockedBilling',
                  createdAt: new Date('2024-10-15T03:24:00'),
                  productId: 'prod-pn-pg',
                  status: 'ACTIVE',
                },
              ],
            },
          ], // Metodo json() che restituisce i dati mockati
        } as Response;

        return new Promise((resolve) => resolve(mockResponse));

      default:
        // Simuliamo un errore con status 404 per il caso di codice fiscale sconosciuto
        const errorResponse = {
          ok: false,
          status: 404,
          statusText: 'Not Found',
          json: async () => ({
            statusCode: 404,
            description: 'Not Found',
          }),
        } as Response;
        return new Promise((resolve) => resolve(errorResponse));
    }
  },

  checkManager: async (taxCode?: string): Promise<CheckManagerResponse> => {
    switch (taxCode) {
      case '12323231321':
        return new Promise((resolve) => resolve({ result: true }));
      case '55555555555':
        return new Promise((resolve) => resolve({ result: false }));
      default:
        return new Promise((resolve) => resolve({ result: false }));
    }
  },

  verifyManager: async (
    companyTaxCode: string,
    _userTaxCode: string
  ): Promise<VerifyManagerResponse> => {
    switch (companyTaxCode) {
      case '12323231321':
        // Mock con risposta corretta
        const validResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => ({
            companyName: 'Business retrieved from IC',
            origin: 'INFOCAMERE',
          }),
        } as Response;
        return new Promise((resolve) => resolve(validResponse));

      case '24242424243':
        // Mock con risposta corretta ma con dati diversi
        const genericErrorResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => ({
            companyName: 'Business genericError',
            origin: 'INFOCAMERE',
          }),
        } as Response;
        return new Promise((resolve) => resolve(genericErrorResponse));

      case '22334455667':
      case '22222222222':
        // Mock senza companyName
        const noCompanyNameResponse = {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => ({
            origin: 'ADE',
          }),
        } as Response;
        return new Promise((resolve) => resolve(noCompanyNameResponse));

      // Simula un errore 404 per un codice fiscale non trovato
      case '11223344556':
        const notFoundErrorResponse = {
          ok: false,
          status: 404,
          statusText: 'Not Found',
          json: async () => ({
            message: 'Not Found',
          }),
        } as Response;
        return new Promise((resolve) => resolve(notFoundErrorResponse));

      default:
        // Mock con errore 404 per codice fiscale sconosciuto
        const defaultErrorResponse = {
          ok: false,
          status: 404,
          statusText: 'Not Found',
          json: async () => ({
            message: 'Not Found',
          }),
        } as Response;
        return new Promise((resolve) => resolve(defaultErrorResponse));
    }
  },
};

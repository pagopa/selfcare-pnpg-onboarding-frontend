import { LegalEntity, BusinessLegalAddress, User } from '../../types';
import { BusinessResourceIC } from '../generated/b4f-onboarding-pnpg/BusinessResourceIC';
import { InstitutionLegalAddressResource } from '../generated/b4f-onboarding-pnpg/InstitutionLegalAddressResource';
import { InstitutionOnboardingInfoResource } from '../generated/b4f-onboarding-pnpg/InstitutionOnboardingInfoResource';
import { MatchInfoResultResource } from '../generated/b4f-onboarding-pnpg/MatchInfoResultResource';

export const loggedUser: User = {
  uid: '00123',
  name: 'mockedUserName',
  surname: 'mockedUserSurname',
  taxCode: 'MCCDLL91C25B115B',
  email: 'email@mockemail.com',
};

export const mockedBusinesses: Array<BusinessResourceIC> = [
  {
    businessName: 'BusinessName success',
    businessTaxId: '01113570442',
  },
  {
    businessName: 'BusinessName alreadyOnboarded',
    businessTaxId: '01501320442',
  },
  {
    businessName: 'BusinessName genericError',
    businessTaxId: '22222222222',
  },
];

export const mockedLegalEntity: LegalEntity = {
  businesses: mockedBusinesses,
  legalTaxId: '1234567',
  requestDateTime: 'x',
};

export const mockedRetrievedBusinessesLegalAddress: Array<BusinessLegalAddress> = [
  {
    taxCode: '77777777777',
    address: 'Via retrievedInstitutionLegalAddress1',
    zipCode: '98765',
  },
  {
    taxCode: '88888888888',
    address: 'Via retrievedInstitutionLegalAddress2',
    zipCode: '56789',
  },
];

export const mockedEdAOccurrences = [
  {
    externalId: '55555555555',
    address: 'via test 3',
    category: 'test3',
    fiscalCode: '55555555555',
    geographicTaxonomies: [],
    id: '55555555555',
    institutionType: 'PG',
    mailAddress: 'test@impresa1.it',
    name: 'retrieved in EdA mock 1',
    origin: 'ADE',
    originId: 'testoriginId3',
    recipientCode: 'MDSSFDF',
    status: 'TestStatus3',
    userRole: 'UserRoleTest3',
    zipCode: '32145',
  },
  {
    externalId: '51515151511',
    category: 'test3',
    fiscalCode: '51515151511',
    geographicTaxonomies: [],
    id: '51515151511',
    institutionType: 'PG',
    mailAddress: 'test@impresa1.it',
    name: 'retrieved in EdA mock 2',
    origin: 'ADE',
    originId: 'testoriginId3',
    recipientCode: 'MDSSFDF',
    status: 'TestStatus3',
    userRole: 'UserRoleTest3',
    zipCode: '32145',
  },
];

export const mockedOnboardingApi = {
  getBusinessesByUser: async (_loggedUser: User): Promise<LegalEntity> =>
    new Promise((resolve) => resolve(mockedLegalEntity)),

  onboardingPGSubmit: (businessId: string): Promise<boolean> => {
    if (businessId === '22222222222') {
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

  matchBusinessAndUser: (taxCode: string, _loggedUser: User): Promise<MatchInfoResultResource> => {
    const matchedBusinessInEdAByExternalId = mockedEdAOccurrences.find(
      (p) => p.externalId === taxCode
    );
    return new Promise((resolve) =>
      resolve({ verificationResult: !!matchedBusinessInEdAByExternalId })
    );
  },

  getBusinessLegalAddress: (taxCode: string): Promise<InstitutionLegalAddressResource | null> => {
    const matchedBusinessLegalAddressByExternalId = mockedRetrievedBusinessesLegalAddress.find(
      (i) => i.taxCode === taxCode
    );
    // Introduced this use case for invalid input format
    if (taxCode === '11111111111') {
      return new Promise(() => {
        const error = new Error(`Unexpected mocked HTTP status! Expected 200 obtained 400`);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line functional/immutable-data
        error.httpStatus = 400;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line functional/immutable-data
        error.httpBody = {
          statusCode: 400,
          description: 'Bad request',
        };
        console.error(JSON.stringify(error));
        throw error;
      });
    } else {
      return new Promise((resolve) => resolve(matchedBusinessLegalAddressByExternalId ?? null));
    }
  },

  getInstitutionOnboardingInfo: (taxCode: string): Promise<InstitutionOnboardingInfoResource> => {
    switch (taxCode) {
      case '01501320442':
      case '51515151511':
        return new Promise((resolve) =>
          resolve({
            geographicTaxonomies: [],
            institution: {
              id: 'retrievedPartyId01',
            },
          })
        );
      default:
        return new Promise((resolve) => resolve({}));
    }
  },
};

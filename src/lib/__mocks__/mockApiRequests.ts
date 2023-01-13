import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Endpoint, SelfcareParty, UserOnCreate } from '../../../types';

const mockPartyRegistry = {
  items: [
    {
      id: 'id',
      o: 'o',
      ou: 'ou',
      aoo: 'aoo',
      taxCode: '00000000000',
      zipCode: '44332',
      administrationCode: '00000000000',
      category: 'c7',
      managerName: 'Mario',
      managerSurname: 'Rossi',
      description: 'AGENCY X',
      digitalAddress: 'mail@pec.mail.org',
      origin: 'IPA',
      originId: 'originId1',
      address: 'sede legale',
    },
    {
      id: 'error',
      o: 'errorO',
      ou: 'errorUu',
      aoo: 'errorAoo',
      taxCode: '11111111111',
      zipCode: '01345',
      administrationCode: '11111111111',
      category: 'c7',
      managerName: 'Mario:ERROR',
      managerSurname: 'Rossi_ERROR',
      description: 'AGENCY ERROR',
      digitalAddress: 'mail_ERROR_@pec.mail.org',
      origin: 'IPA',
      originId: 'originId2',
      address: 'sede legale',
    },
    {
      id: 'onboarded',
      o: 'onboardedO',
      ou: 'onboardedUu',
      aoo: 'onboardedAoo',
      taxCode: '22222222222',
      zipCode: '12345',
      administrationCode: '22222222222',
      category: 'c7',
      managerName: 'Mario_ONBOARDED',
      managerSurname: 'Rossi_ONBOARDED',
      description: 'AGENCY ONBOARDED',
      digitalAddress: 'mail_ONBOARDED_@pec.mail.org',
      origin: 'IPA',
      originId: 'originId3',
      address: 'sede legale',
    },
    {
      id: 'pending',
      o: 'pendingO',
      ou: 'pendingUu',
      aoo: 'pendingAoo',
      taxCode: '33333333333',
      zipCode: '54321',
      administrationCode: '33333333333',
      category: 'c7',
      managerName: 'Mario_PENDING',
      managerSurname: 'Rossi_PENDING',
      description: 'AGENCY PENDING',
      digitalAddress: 'mail_PENDING_@pec.mail.org',
      origin: 'IPA',
      originId: 'originId4',
      address: 'sede legale',
    },
    {
      id: 'infoError',
      o: 'infoErrorO',
      ou: 'infoErrorUu',
      aoo: 'infoErrorAoo',
      taxCode: '99999999999',
      zipCode: '12122',
      administrationCode: '99999999999',
      category: 'c7',
      managerName: 'Mario_INFOERROR',
      managerSurname: 'Rossi_INFOERROR',
      description: 'AGENCY INFO ERROR',
      digitalAddress: 'mail_INFOERROR_@pec.mail.org',
      origin: 'IPA',
      originId: 'originId5',
      address: 'sede legale',
    },
    {
      id: 'notAllowed',
      o: 'notAllowedO',
      ou: 'notAllowedUu',
      aoo: 'notAllowedAoo',
      taxCode: '44444444444',
      zipCode: '070889',
      administrationCode: '44444444444',
      category: 'c7',
      managerName: 'Mario_NOTALLOWED',
      managerSurname: 'Rossi_NOTALLOWED',
      description: 'Not Allowed',
      digitalAddress: 'mail_NOTALLOWED_@pec.mail.org',
      origin: 'IPA',
      originId: 'originId6',
      address: 'sede legale',
    },
    {
      id: 'notAllowedInSubmit',
      o: 'notAllowedO',
      ou: 'notAllowedUDu',
      aoo: 'notAllowedAooe',
      taxCode: '44444444444',
      zipCode: '07089',
      administrationCode: '44444444444',
      category: 'c7',
      managerName: 'Maria_NOTALLOWED',
      managerSurname: 'Rossa_NOTALLOWED',
      description: 'Not Allowed Error on Submit',
      digitalAddress: 'mail_NOTALLOWEDINSUBMIT_@pec.mail.org',
      origin: 'IPA',
      originId: 'originId7',
      address: 'sede legale',
    },
  ],
  count: 5,
};

const mockedParties: Array<SelfcareParty> = [
  {
    externalId: 'externalId1',
    originId: 'originId1',
    id: 'partyId1',
    description: 'Comune di Milano',
    urlLogo: 'logo',
    address: 'address',
    digitalAddress: 'a@aa.com',
    taxCode: '33344455567',
    zipCode: 'zipCode',
    origin: 'IPA',
    userRole: 'ADMIN',
  },
  {
    externalId: 'externalId2',
    originId: 'originId2',
    id: 'partyId2',
    description: 'Comune di Bollate',
    urlLogo: 'logo',
    address: 'address',
    digitalAddress: 'a@aa.com',
    taxCode: '11122233345',
    zipCode: 'zipCode',
    origin: 'IPA',
    userRole: 'ADMIN',
  },
  {
    externalId: 'externalId3',
    originId: 'originId3',
    id: 'partyId3',
    description:
      'Commissario straordinario per la realizzazione di approdi temporanei e di interventi complementari per la salvaguardia di Venezia e della sua laguna e ulteriori interventi per la salvaguardia della laguna di Venezia',
    urlLogo: 'logo',
    address: 'address',
    digitalAddress: 'a@aa.com',
    taxCode: '33322268945',
    zipCode: '02102',
    origin: 'IPA',
    userRole: 'LIMITED',
  },
  {
    externalId: 'onboarded_externalId',
    originId: 'onboarded_originId',
    id: 'onboarded_partyId',
    description: 'onboarded',
    urlLogo: 'logo',
    address: 'address',
    digitalAddress: 'a@aa.com',
    taxCode: 'BBBBBB22B22B234K',
    zipCode: '12125',
    origin: 'IPA',
    userRole: 'LIMITED',
  },
];

const mockedResponseError = {
  detail: 'Request took too long to complete.',
  status: 503,
  title: 'Service Unavailable',
};

const notAllowedError: Promise<AxiosError> = new Promise((resolve) =>
  resolve({
    isAxiosError: true,
    response: { data: '', status: 403, statusText: 'Not Found' },
  } as AxiosError)
);

const genericError: Promise<AxiosError> = new Promise((resolve) =>
  resolve({
    isAxiosError: true,
    response: { data: mockedResponseError, status: 503, statusText: '503' },
  } as AxiosError)
);

const error409: Promise<AxiosError> = new Promise((resolve) =>
  resolve({
    isAxiosError: true,
    response: { data: '', status: 409, statusText: '409' },
  } as AxiosError)
);

const buildOnboardingUserValidation409 = (
  isNameConflict: boolean,
  isSurnameConflict: boolean
): Promise<AxiosError> =>
  new Promise((resolve) =>
    resolve({
      isAxiosError: true,
      response: {
        data: {
          detail: 'there are values that do not match with the certified data',
          instance: '/users/validate',
          invalidParams: [
            isNameConflict
              ? { name: 'name', reason: 'the value does not match with the certified data' }
              : undefined,
            isSurnameConflict
              ? { name: 'surname', reason: 'the value does not match with the certified data' }
              : undefined,
          ].filter((x) => x),
          status: 409,
          title: 'Conflict',
        },
        status: 409,
        statusText: '409',
      },
    } as AxiosError)
  );

// eslint-disable-next-line sonarjs/cognitive-complexity, complexity
export async function mockFetch(
  { endpoint, endpointParams }: Endpoint,
  { params, data }: AxiosRequestConfig
): Promise<AxiosResponse | AxiosError> {
  if (endpoint === 'ONBOARDING_USER_VALIDATION') {
    if (
      ['CRTCTF90B12C123K', 'CRTCTF91B12C123K', 'CRTCTF92B12C123K'].indexOf((data as any)?.taxCode) >
        -1 &&
      ((data as any)?.name !== 'CERTIFIED_NAME' || (data as any)?.surname !== 'CERTIFIED_SURNAME')
    ) {
      return buildOnboardingUserValidation409(
        (data as any)?.name !== 'CERTIFIED_NAME',
        (data as any)?.surname !== 'CERTIFIED_SURNAME'
      );
    } else if ((data as any)?.taxCode === 'CRTCTF93B12C124K') {
      return genericError;
    } else {
      return new Promise((resolve) =>
        resolve({ data: '', status: 200, statusText: '200' } as AxiosResponse)
      );
    }
  }
  if (endpoint === 'ONBOARDING_POST_LEGALS') {
    switch (endpointParams.externalInstitutionId) {
      case 'error':
        return genericError;
      case 'notAllowedInSubmit':
        return notAllowedError;
      default:
        const certifiedUser: UserOnCreate | undefined = (
          (data as any).users as Array<UserOnCreate>
        ).find((u) => u.taxCode === 'XXXXXX00A00X000X');
        if (
          certifiedUser &&
          (certifiedUser.name !== 'CERTIFIED_NAME' || certifiedUser.surname !== 'CERTIFIED_SURNAME')
        ) {
          return error409;
        } else {
          return new Promise((resolve) =>
            resolve({ data: '', status: 200, statusText: '200' } as AxiosResponse)
          );
        }
    }
  }

  if (endpoint === 'ONBOARDING_GET_PARTY') {
    const fetched = mockPartyRegistry.items.find(
      (p) => p.id === endpointParams.externalInstitutionId
    );

    if (fetched) {
      return new Promise((resolve) =>
        resolve({ data: fetched, status: 200, statusText: '200' } as AxiosResponse)
      );
    } else {
      // eslint-disable-next-line sonarjs/no-identical-functions
      return new Promise((resolve) =>
        resolve({
          isAxiosError: true,
          response: { status: 404, statusText: 'Not Found' },
        } as AxiosError)
      );
    }
  }

  if (endpoint === 'ONBOARDING_COMPLETE_REGISTRATION') {
    switch (endpointParams.token) {
      case 'error':
        return genericError;
      default:
        return new Promise((resolve) =>
          resolve({ data: undefined, status: 200, statusText: '200' } as AxiosResponse)
        );
    }
  }

  if (endpoint === 'ONBOARDING_GET_USER_PARTIES') {
    return new Promise((resolve) =>
      resolve({ data: mockedParties, status: 200, statusText: '200' } as AxiosResponse)
    );
  }

  const msg = `NOT MOCKED REQUEST! {endpoint: ${endpoint}, endpointParams: ${JSON.stringify(
    endpointParams
  )}, params: ${JSON.stringify(params)}}`;
  console.error(msg);
  throw new Error(msg);
}

import { mockedPnPGInstitutionsResource } from '../../api/__mocks__/DashboardPnPgApiClient';
import { institutionPnPGResource2PartyPnpg } from '../../types';
import {
  getPnPGInstitutions,
  retrieveProductBackoffice,
  saveInstitutionLogo,
} from '../dashboardService';

test('Test: getPnPGInstitutions', async () => {
  const fetchGetPnPgInstitutions = await getPnPGInstitutions();

  expect(fetchGetPnPgInstitutions).toMatchObject(
    mockedPnPGInstitutionsResource.map(institutionPnPGResource2PartyPnpg)
  );
});

test('Test: retrieveProductBackoffice', async () => {
  const fetchRetrieveProductBackoffice = await retrieveProductBackoffice(
    'prod-pn-pg',
    '00000000000'
  );

  expect(fetchRetrieveProductBackoffice).toBe('dummyUrl');
});

test('Test: saveInstitutionLogo', async () => {
  const fetchSaveInstitutionLogo = await saveInstitutionLogo('00000000000', '' as unknown as File);

  expect(fetchSaveInstitutionLogo).toBeTruthy();
});

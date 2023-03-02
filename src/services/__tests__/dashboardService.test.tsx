import { mockedPnPGInstitutionsResource } from '../../api/__mocks__/DashboardPnPgApiClient';
import { getInstitutionLegalAddress, getPnPGInstitutions } from '../dashboardService';

test('Test: getPnPGInstitutions', async () => {
  const fetchGetPnPgInstitutions = await getPnPGInstitutions();
  expect(fetchGetPnPgInstitutions).toMatchObject(mockedPnPGInstitutionsResource);
});

test('Test: getInstitutionLegalAddress', async () => {
  const fetchGetInstitutionLegalAddress = await getInstitutionLegalAddress('77777777777');
  expect(fetchGetInstitutionLegalAddress).toMatchObject({
    address: 'Via retrievedInstitutionLegalAddress1',
    externalInstitutionId: '77777777777',
    zipCode: '98765',
  });
});

import { Grid, Box, Typography } from '@mui/material';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import {
  BusinessPnpg,
  PnPGInstitutionLegalAddressResource,
  PnPGInstitutionResource,
} from '../../../types';
import { withLogin } from '../../components/withLogin';
import PnIcon from '../OnboardingPNPG/assets/pn.svg';
import {
  getInstitutionLegalAddress,
  retrieveProductBackoffice,
} from '../../services/dashboardService';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import withParties from '../../decorators/withParties';
import { useHistoryState } from '../../components/useHistoryState';
import WelcomeDashboard from './components/WelcomeDashboard';
import ActiveProductCard from './components/ActiveProductCard';
import PartyInfoOverview from './components/PartyInfoOverview';
import { PartyLogoUploader } from './components/PartyLogoUploader';
import DashboardSideMenu from './components/DashboardSideMenu';

const Dashboard = () => {
  const { t } = useTranslation();
  const [_loading, setLoading] = useState<boolean>(false);
  const parties = useAppSelector(partiesSelectors.selectPartiesList);

  const selectedInstitutionPnPg = history.state;

  const selectedInstitution = useHistoryState<BusinessPnpg | undefined>(
    'selected_institution',
    selectedInstitutionPnPg?.state
  )[0];

  const [party, setParty] = useState<PnPGInstitutionResource>();
  const [retrievedLegalAddressInfos, setRetrievedLegalAddressInfos] =
    useState<PnPGInstitutionLegalAddressResource>();

  useEffect(() => {
    const selectedBusinessPnPg =
      selectedInstitutionPnPg?.state?.selected_institution ?? selectedInstitution;

    getInstitutionLegalAddress(selectedBusinessPnPg.businessTaxId)
      .then((p) => setRetrievedLegalAddressInfos(p))
      .catch((reason) => reason);

    const partySelected = parties?.find(
      (p) =>
        p.fiscalCode ===
        (selectedBusinessPnPg.businessTaxId ?? selectedInstitutionPnPg?.state?.businessTaxId)
    );
    setParty(partySelected);
  }, [history.state]);

  const handleClick = async (productId: string, institutionId: string) => {
    storageTokenOps.write(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imp3dF84Njo3NDoxZTozNTphZTphNjpkODo0YjpkYzplOTpmYzo4ZTphMDozNTo2ODpiNSJ9.eyJlbWFpbCI6ImZ1cmlvdml0YWxlQG1hcnRpbm8uaXQiLCJmYW1pbHlfbmFtZSI6IlNhcnRvcmkiLCJmaXNjYWxfbnVtYmVyIjoiU1JUTkxNMDlUMDZHNjM1UyIsIm5hbWUiOiJBbnNlbG1vIiwiZnJvbV9hYSI6ZmFsc2UsInVpZCI6IjUwOTZlNGM2LTI1YTEtNDVkNS05YmRmLTJmYjk3NGE3YzFjOCIsImxldmVsIjoiTDIiLCJpYXQiOjE2NzU0MTcxMTYsImV4cCI6MTY3NTQ0OTUxNiwiYXVkIjoiYXBpLmRldi5zZWxmY2FyZS5wYWdvcGEuaXQiLCJpc3MiOiJTUElEIiwianRpIjoiMDFHUkJBOFFKMDdKN0U3RDIySFo3NFo0TTYifQ.fZJ4b7Au6oRjxd9WqivcWeVz8KO2IKx6rDTZNNyEcXQ6zKuJDz27CWBwJ635_3WlhbYynPVXlvp4FrDQEGch1eeEfmkSCyKVFd38BlUBRYeuPYL-g79jzu_fdVOj6TzVF9y1cumC_3Z3wagxcryjEtzpD-0qPVZrGyrBAyGiM6qc6PxzY49kMYefz8l17n59GDUf72xHAWQPRXqKomgJTeTd_-dV_5h_R7PfrocJgg6InywYl87dr_c7G7Neg4-zIHa74rijh7nuTVNgdUzitJlZLlLoOHZG93yFtQeGzXdPbX6CvsP2lqCCTsXs5JSgwNofZ3NilDTFwIxd1lLaBA'
    );
    setLoading(true);
    retrieveProductBackoffice(productId, institutionId)
      .then((backOfficeUrl) => window.location.assign(backOfficeUrl))
      .catch((er) => console.log(er)) // TODO
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Grid container item xs={2} sx={{ backgroundColor: 'background.paper' }} component="nav">
        <DashboardSideMenu /> {/* Todo Agency selected */}
      </Grid>
      <Box p={3} sx={{ width: '100%' }}>
        <WelcomeDashboard businessName={party?.name} />
        <Grid container direction="row" justifyContent={'center'} alignItems="center" mb={2}>
          <Grid item xs={6} display="flex" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: '700' }}>
              {party?.name}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            {party && <PartyLogoUploader partyId={party.id} />}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <PartyInfoOverview
            party={party}
            legalAddress={retrievedLegalAddressInfos?.address}
            zipCode={retrievedLegalAddressInfos?.zipCode}
          />
        </Grid>
        <Grid item container ml={1} mt={5}>
          <TitleBox
            title={t('dashboard.notificationArea')}
            mbTitle={3}
            variantTitle="h4"
            titleFontSize="28px"
          />
          <Grid container mb={44}>
            <ActiveProductCard
              cardTitle={
                <Trans i18next="productCard.title">
                  Vai alle <br /> notifiche
                </Trans>
              }
              urlLogo={PnIcon}
              btnAction={() => handleClick('prod-pn-pg', 'bf4dcdb6-f223-4996-bfbc-326b119dd101')} // TODO FixMe
              // party={party}     TODO
              // product={product} TODO
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default withLogin(withParties(Dashboard));

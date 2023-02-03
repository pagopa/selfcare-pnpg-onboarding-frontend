import { Grid, Box, Typography } from '@mui/material';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import { BusinessPnpg, PnPGInstitutionResource } from '../../../types';
import { withLogin } from '../../components/withLogin';
import { fetchWithLogs } from '../../lib/api-utils';
import { UserContext } from '../../lib/context';
import { getFetchOutcome } from '../../lib/error-utils';
import PnIcon from '../OnboardingPNPG/assets/pn.svg';
import { useHistoryState } from '../../components/useHistoryState';
import WelcomeDashboard from './components/WelcomeDashboard';
import ActiveProductCard from './components/ActiveProductCard';
import PartyInfoOverview from './components/PartyInfoOverview';
import { PartyLogoUploader } from './components/PartyLogoUploader';
import DashboardSideMenu from './components/DashboardSideMenu';

const Dashboard = () => {
  const { t } = useTranslation();
  const { setRequiredLogin } = useContext(UserContext);
  const [party, setParty] = useState<PnPGInstitutionResource>();
  const selectedInstitution = useHistoryState<BusinessPnpg | undefined>(
    'selected_institution',
    undefined
  )[0];

  useEffect(() => {
    retrieveInstitutionsInfos().catch((e) => e);
  }, []);

  const retrieveInstitutionsInfos = async () => {
    const response = await fetchWithLogs(
      {
        endpoint: 'DASHBOARD_GET_INSTITUTIONS',
      },
      {
        method: 'GET',
      },
      () => setRequiredLogin(true)
    );

    const outcome = getFetchOutcome(response);

    if (outcome === 'success') {
      trackEvent('DASHBOARD_PNPG_RETRIEVED_SUCCESS', {});
      const retrievedInstitutionsInfos = (response as AxiosResponse)
        .data as Array<PnPGInstitutionResource>;
      const selectedParty = retrievedInstitutionsInfos.find(
        (p) => p.fiscalCode === selectedInstitution?.businessTaxId
      );
      setParty(selectedParty);
    } else {
      trackEvent('DASHBOARD_PNPG_RETRIEVED_ERROR', {});
    }
  };

  /* 
  const retrieveInstitutionInfos = async () => {
    const response = await fetchWithLogs(
      {
        endpoint: 'DASHBOARD_PNPG_RETRIEVE_PARTY_INFOS',
        endpointParams: {
          externalId: '01501320442',
        },
      },
      {
        method: 'GET',
      },
      () => setRequiredLogin(true)
    );

    const outcome = getFetchOutcome(response);

    if (outcome === 'success') {
      trackEvent('DASHBOARD_PNPG_RETRIEVED_SUCCESS', {});
      const retrievedInstitutionInfos = (response as AxiosResponse).data;
      setParty(retrievedInstitutionInfos);
    } else {
      trackEvent('DASHBOARD_PNPG_RETRIEVED_ERROR', {});
    }
  };
  */

  const handleClick = async () => {
    const response = await fetchWithLogs(
      {
        endpoint: 'DASHBOARD_RETRIEVE_BACK_OFFICE_URL',
        endpointParams: { productId: 'prod-pn' },
      },
      {
        method: 'GET',
        params: { institutionId: 'bf4dcdb6-f223-4996-bfbc-326b119dd101' },
      },
      () => setRequiredLogin(true)
    );

    const outcome = getFetchOutcome(response);

    if (outcome === 'success') {
      const backOfficeUrl = (response as AxiosResponse).data;
      window.location.assign(backOfficeUrl);
    } else {
      console.log('error'); // TODO
    }
  };

  return (
    <>
      <Grid container item xs={2} sx={{ backgroundColor: 'background.paper' }} component="nav">
        <DashboardSideMenu /> {/* Todo Agency selected */}
      </Grid>
      <Box p={3} sx={{ width: '100%' }}>
        <WelcomeDashboard businessName={selectedInstitution?.businessName} />
        <Grid container direction="row" justifyContent={'center'} alignItems="center" mb={2}>
          <Grid item xs={6} display="flex" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: '700' }}>
              {selectedInstitution?.businessName}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <PartyLogoUploader partyId={party?.id} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <PartyInfoOverview party={party} />
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
              btnAction={handleClick}
              // party={party}     TODO
              // product={product} TODO
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default withLogin(Dashboard);

import { Grid, Box, Typography } from '@mui/material';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { PnPGInstitutionResource } from '../../../types';
import { withLogin } from '../../components/withLogin';
import { fetchWithLogs } from '../../lib/api-utils';
import { UserContext } from '../../lib/context';
import { getFetchOutcome } from '../../lib/error-utils';
import PnIcon from '../OnboardingPNPG/assets/pn.svg';
import WelcomeDashboard from './components/WelcomeDashboard';
import ActiveProductCard from './components/ActiveProductCard';
import PartyInfoOverview from './components/PartyInfoOverview';
import { PartyLogoUploader } from './components/PartyLogoUploader';
import DashboardSideMenu from './components/DashboardSideMenu';

const Dashboard = () => {
  const { t } = useTranslation();
  const { setRequiredLogin } = useContext(UserContext);
  const [party, setParty] = useState<PnPGInstitutionResource>();

  const selectedInstitution = history.state;

  useEffect(() => {
    storageTokenOps.write(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imp3dF9kZjplNjoxOTplYToxZTpjZTplNjo3Yjo3MDo0MjoyYzphMjpjZDo4Yjo1MjowYiJ9.eyJlbWFpbCI6ImQuZGVsbGF2YWxsZUB0ZXN0Lml0IiwiZmFtaWx5X25hbWUiOiJEZWxsYSBWYWxsZSIsImZpc2NhbF9udW1iZXIiOiJETExER0k1M1QzMEkzMjRFIiwibmFtZSI6IkRpZWdvIiwiZnJvbV9hYSI6ZmFsc2UsInVpZCI6IjM5MzQ1MDcyLWU0YmYtNDYwOS04MmVhLTg4ZDE5NDUyNTM2YiIsImxldmVsIjoiTDIiLCJpYXQiOjE2NDAyNTU2ODMsImF1ZCI6ImFwaS5kZXYuc2VsZmNhcmUucGFnb3BhLml0IiwiaXNzIjoiU1BJRCIsImp0aSI6IjAxRlFLRFBaMTVHVDRTVENRQUU1RVhCVlZNIn0.CPHZvQl0ByxdmbkBcQFZr4rg1qjdKdAASTGWY_iVr_8DVU8V4vZASqyVuXzNLVsyc-USaj_LKIdenyx5JiU4kp7g0qD7QLVBiWjpkZpw3Qgq__wAoUtMJxSM8T10o03AXikRc5v5ZqSiNIspolInsScTDpsi_Yzt-2zO2vjzCyOFHWc_3TzkIDeGVLkluim9Sfe4s3DwqOWza4MeUE_l19yiUxcsvxobih2FNHMgZwKi2g4ybarYJ-vy6_0V9e6rFgY70dnOX5VKv3R547YnX5vyirmZ-VF6DSDe7_dROk4BjBYtjVlaLOhyZ2iN26QUtGVSYxtSLhxf34LGmBKhbA'
    );
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
        (p) => p.fiscalCode === selectedInstitution?.state.businessTaxId
      );
      setParty(selectedParty);
    } else {
      trackEvent('DASHBOARD_PNPG_RETRIEVED_ERROR', {});
    }
  };

  const handleClick = async () => {
    storageTokenOps.write(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imp3dF84Njo3NDoxZTozNTphZTphNjpkODo0YjpkYzplOTpmYzo4ZTphMDozNTo2ODpiNSJ9.eyJlbWFpbCI6ImZ1cmlvdml0YWxlQG1hcnRpbm8uaXQiLCJmYW1pbHlfbmFtZSI6IlNhcnRvcmkiLCJmaXNjYWxfbnVtYmVyIjoiU1JUTkxNMDlUMDZHNjM1UyIsIm5hbWUiOiJBbnNlbG1vIiwiZnJvbV9hYSI6ZmFsc2UsInVpZCI6IjUwOTZlNGM2LTI1YTEtNDVkNS05YmRmLTJmYjk3NGE3YzFjOCIsImxldmVsIjoiTDIiLCJpYXQiOjE2NzU0MTcxMTYsImV4cCI6MTY3NTQ0OTUxNiwiYXVkIjoiYXBpLmRldi5zZWxmY2FyZS5wYWdvcGEuaXQiLCJpc3MiOiJTUElEIiwianRpIjoiMDFHUkJBOFFKMDdKN0U3RDIySFo3NFo0TTYifQ.fZJ4b7Au6oRjxd9WqivcWeVz8KO2IKx6rDTZNNyEcXQ6zKuJDz27CWBwJ635_3WlhbYynPVXlvp4FrDQEGch1eeEfmkSCyKVFd38BlUBRYeuPYL-g79jzu_fdVOj6TzVF9y1cumC_3Z3wagxcryjEtzpD-0qPVZrGyrBAyGiM6qc6PxzY49kMYefz8l17n59GDUf72xHAWQPRXqKomgJTeTd_-dV_5h_R7PfrocJgg6InywYl87dr_c7G7Neg4-zIHa74rijh7nuTVNgdUzitJlZLlLoOHZG93yFtQeGzXdPbX6CvsP2lqCCTsXs5JSgwNofZ3NilDTFwIxd1lLaBA'
    );
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
        <WelcomeDashboard businessName={selectedInstitution?.state.businessName} />
        <Grid container direction="row" justifyContent={'center'} alignItems="center" mb={2}>
          <Grid item xs={6} display="flex" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: '700' }}>
              {selectedInstitution?.state.businessName}
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

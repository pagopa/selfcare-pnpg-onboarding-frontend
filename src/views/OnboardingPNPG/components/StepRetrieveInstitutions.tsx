import { useState, useEffect } from 'react';
import { Trans } from 'react-i18next';
import { EndingPage } from '@pagopa/selfcare-common-frontend';
import { IllusError, theme } from '@pagopa/mui-italia';
import { Link, Typography } from '@mui/material';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { useTranslation } from 'react-i18next';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { InstitutionsPnPG } from '../../../../types';
import { withLogin } from '../../../components/withLogin';
import { LoadingOverlay } from '../../../components/LoadingOverlay';
import { ENV } from '../../../utils/env';
import { getInstitutionsByUser } from '../../../services/onboardingService';
import { loggedUser } from '../../../api/__mocks__/DashboardPnPgApiClient';

type Props = {
  setRetrievedInstitutions: React.Dispatch<React.SetStateAction<InstitutionsPnPG | undefined>>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
};

function StepRetrieveInstitutions({ setRetrievedInstitutions, setActiveStep }: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  // TODO When login services is available, this line will be uncommented and loggedUser object replaced with this
  // const { user } = useContext(UserContext);

  const retrieveInstitutionsByUser = async () => {
    setLoading(true);
    getInstitutionsByUser(loggedUser)
      .then((retrievedInstitutions) => {
        setRetrievedInstitutions(retrievedInstitutions);
        if (retrievedInstitutions.businesses && retrievedInstitutions.businesses.length !== 0) {
          setActiveStep(1);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        trackEvent('NOT_RETRIEVED_ENTITIES', {});
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    storageTokenOps.write(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imp3dF9kZjplNjoxOTplYToxZTpjZTplNjo3Yjo3MDo0MjoyYzphMjpjZDo4Yjo1MjowYiJ9.eyJlbWFpbCI6ImQuZGVsbGF2YWxsZUB0ZXN0Lml0IiwiZmFtaWx5X25hbWUiOiJEZWxsYSBWYWxsZSIsImZpc2NhbF9udW1iZXIiOiJETExER0k1M1QzMEkzMjRFIiwibmFtZSI6IkRpZWdvIiwiZnJvbV9hYSI6ZmFsc2UsInVpZCI6IjM5MzQ1MDcyLWU0YmYtNDYwOS04MmVhLTg4ZDE5NDUyNTM2YiIsImxldmVsIjoiTDIiLCJpYXQiOjE2NDAyNTU2ODMsImF1ZCI6ImFwaS5kZXYuc2VsZmNhcmUucGFnb3BhLml0IiwiaXNzIjoiU1BJRCIsImp0aSI6IjAxRlFLRFBaMTVHVDRTVENRQUU1RVhCVlZNIn0.CPHZvQl0ByxdmbkBcQFZr4rg1qjdKdAASTGWY_iVr_8DVU8V4vZASqyVuXzNLVsyc-USaj_LKIdenyx5JiU4kp7g0qD7QLVBiWjpkZpw3Qgq__wAoUtMJxSM8T10o03AXikRc5v5ZqSiNIspolInsScTDpsi_Yzt-2zO2vjzCyOFHWc_3TzkIDeGVLkluim9Sfe4s3DwqOWza4MeUE_l19yiUxcsvxobih2FNHMgZwKi2g4ybarYJ-vy6_0V9e6rFgY70dnOX5VKv3R547YnX5vyirmZ-VF6DSDe7_dROk4BjBYtjVlaLOhyZ2iN26QUtGVSYxtSLhxf34LGmBKhbA'
    );
    retrieveInstitutionsByUser().catch((e) => e);
  }, []);

  return loading ? (
    <LoadingOverlay loadingText={t('loadingText')} />
  ) : error ? (
    <>
      <EndingPage
        icon={<IllusError size={60} />}
        title={t('institutionsNotFound.title')}
        description={
          <Trans i18nKey="institutionsNotFound.message">
            Per accedere alle notifiche, l’azienda deve essere registrata <br /> dal Legale
            Rappresentante.
          </Trans>
        }
        variantTitle={'h4'}
        variantDescription={'body1'}
        buttonLabel={t('institutionsNotFound.backToAccess')}
        onButtonClick={() => ENV.URL_FE.LOGOUT}
      />
      <Typography
        sx={{
          textAlign: 'center',
          display: 'block',
          marginTop: 4,
        }}
        variant="caption"
        color={theme.palette.text.primary}
      >
        <Trans i18nKey="selectInstitutionReleated.changeInstitutionSelectedLink">
          {'Sei il Legale Rappresentante di un’azienda? '}
          <Link sx={{ textDecoration: 'underline', color: theme.palette.primary.main }} href="">
            {/* Todo add the correct redirect */}
            {'Registra nuova azienda'}
          </Link>
        </Trans>
      </Typography>
    </>
  ) : (
    <></>
  );
}

export default withLogin(StepRetrieveInstitutions);

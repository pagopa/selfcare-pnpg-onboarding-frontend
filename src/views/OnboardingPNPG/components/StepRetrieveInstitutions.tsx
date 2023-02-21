import { useState, useEffect } from 'react';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { useTranslation, Trans } from 'react-i18next';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { IllusError } from '@pagopa/mui-italia';
import EndingPage from '@pagopa/selfcare-common-frontend/components/EndingPage';
import { InstitutionsPnPG } from '../../../../types';
import { withLogin } from '../../../components/withLogin';
import { LoadingOverlay } from '../../../components/LoadingOverlay';
import { getInstitutionsByUser } from '../../../services/onboardingService';
import { loggedUser } from '../../../api/__mocks__/DashboardPnPgApiClient';
import { ENV } from '../../../utils/env';

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
        setActiveStep(
          retrievedInstitutions && retrievedInstitutions.businesses.length !== 0 ? 1 : 2
        );
      })
      .catch(() => {
        trackEvent('GENERIC ERROR', {});
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
    <EndingPage
      minHeight="52vh"
      icon={<IllusError size={60} />}
      title={t('outcome.error.title')}
      description={
        <Trans i18nKey="outcome.error.description">
          A causa di un errore del sistema non è possibile completare <br />
          la procedura. Ti chiediamo di riprovare più tardi.
        </Trans>
      }
      variantTitle={'h4'}
      variantDescription={'body1'}
      buttonLabel={t('outcome.error.backToHome')}
      onButtonClick={() => window.location.assign(ENV.URL_FE.LOGIN)} // TODO Actually redirect to selfcare login, set correct redirect when available
    />
  ) : (
    <></>
  );
}

export default withLogin(StepRetrieveInstitutions);

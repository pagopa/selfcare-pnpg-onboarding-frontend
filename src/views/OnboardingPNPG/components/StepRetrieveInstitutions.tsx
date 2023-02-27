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
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imp3dF9kZjplNjoxOTplYToxZTpjZTplNjo3Yjo3MDo0MjoyYzphMjpjZDo4Yjo1MjowYiJ9.eyJlbWFpbCI6ImQuZGVsbGF2YWxsZUB0ZXN0Lml0IiwiZmFtaWx5X25hbWUiOiJEZWxsYSBWYWxsZSIsImZpc2NhbF9udW1iZXIiOiJETExER0k1M1QzMEkzMjRFIiwibmFtZSI6IkRpZWdvIiwiZnJvbV9hYSI6ZmFsc2UsInVpZCI6IjM5MzQ1MDcyLWU0YmYtNDYwOS04MmVhLTg4ZDE5NDUyNTM2YiIsImxldmVsIjoiTDIiLCJpYXQiOjE2NDAyNTU2ODMsImFwaSI6InBucGciLCJhdWQiOiJhcGkuZGV2LnNlbGZjYXJlLnBhZ29wYS5pdCIsImlzcyI6IlNQSUQiLCJqdGkiOiIwMUZRS0RQWjE1R1Q0U1RDUUFFNUVYQlZWTSJ9.XeaRUpqmHzevWAt9bojuvFogOUPpVkjQWEqAdKFYJo0icY5gA3BkRqYpQHuCudqrCQDmhi0zRh8o5sx-5OcavBDFEOZnF7dvdf3EWdnAuJvbDpifoNPvO1dUZUhN3u6MvtZwwJnuRi_a85jpquDM8qQH5F-r_s75P1IMeewXnNnAQKdets-xb6TreRcyM4q7fEYdBf21DJ6WmLC7x3i6yxWuJUY1DnEIHUbX7CwuW2GFZ6Zth1OuNNN2L9Nm3YLAy90lo-xQh4lGYMESgJmP98pNmBovPm193NiFSWmnQkuigmBAip87bnzqCx4MO5_RwDnVDxTdTim8faBxCI9SEA'
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

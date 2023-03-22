import { useState, useEffect, useContext } from 'react';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { useTranslation, Trans } from 'react-i18next';
import { IllusError } from '@pagopa/mui-italia';
import EndingPage from '@pagopa/selfcare-common-frontend/components/EndingPage';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { InstitutionsPnpg, User } from '../../../types';
import { withLogin } from '../../../components/withLogin';
import { LoadingOverlay } from '../../../components/LoadingOverlay';
import { getInstitutionsByUser } from '../../../services/onboardingService';
import { UserContext } from '../../../lib/context';
import { ENV } from '../../../utils/env';

type Props = {
  setRetrievedInstitutions: React.Dispatch<React.SetStateAction<InstitutionsPnpg | undefined>>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
};

function StepRetrieveInstitutions({ setRetrievedInstitutions, setActiveStep }: Props) {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const retrieveInstitutionsByUser = async () => {
    setLoading(true);
    getInstitutionsByUser(user as User)
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
    retrieveInstitutionsByUser().catch((reason) => {
      addError({
        id: 'RETRIEVE_INSTITUTIONS_BY_USER_ERROR',
        blocking: false,
        error: reason,
        techDescription: `An error occurred while retrieving institution by user`,
        toNotify: true,
      });
    });
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
          A causa di un problema tecnico, non riusciamo a registrare <br />
          la tua impresa. Riprova più tardi.
        </Trans>
      }
      variantTitle={'h4'}
      variantDescription={'body1'}
      buttonLabel={t('outcome.error.close')}
      onButtonClick={() => window.location.assign(ENV.URL_FE.LOGOUT)}
    />
  ) : (
    <></>
  );
}

export default withLogin(StepRetrieveInstitutions);

import { useState, useEffect } from 'react';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { useTranslation, Trans } from 'react-i18next';
import { IllusError } from '@pagopa/mui-italia';
import EndingPage from '@pagopa/selfcare-common-frontend/components/EndingPage';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { storageUserOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { uniqueId } from 'lodash';
import { LegalEntity } from '../../../types';
import { withLogin } from '../../../components/withLogin';
import { LoadingOverlay } from '../../../components/LoadingOverlay';
import { getBusinessesByUser } from '../../../services/onboardingService';
import { ENV } from '../../../utils/env';

type Props = {
  setRetrievedBusinesses: React.Dispatch<React.SetStateAction<LegalEntity | undefined>>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
};

function StepRetrieveBusinesses({ setRetrievedBusinesses, setActiveStep }: Props) {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const requestId = uniqueId();
  const loggedUser = storageUserOps.read();

  const retrieveBusinessesByUser = async () => {
    setLoading(true);
    getBusinessesByUser(loggedUser)
      .then((retrievedBusinesses) => {
        trackEvent('ONBOARDING_BUSINESS_SUCCESS_RETRIEVED', { requestId, productId: 'prod-pn-pg' });
        setRetrievedBusinesses(retrievedBusinesses);
        setActiveStep(retrievedBusinesses && retrievedBusinesses.businesses.length !== 0 ? 1 : 2);
      })
      .catch(() => {
        trackEvent('ONBOARDING_BUSINESS_RETRIEVED_GENERIC_ERROR', {
          requestId,
          productId: 'prod-pn-pg',
        });
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    retrieveBusinessesByUser().catch((reason) => {
      addError({
        id: 'RETRIEVE_BUSINESSES_BY_USER_ERROR',
        blocking: false,
        error: reason,
        techDescription: `An error occurred while retrieving businesses by user`,
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
      title={t('businessNotFound.title')}
      description={
        <Trans i18nKey="businessNotFound.message">
          Dal tuo SPID non risulti essere Legale Rappresentante di <br /> alcuna impresa.
        </Trans>
      }
      variantTitle={'h4'}
      variantDescription={'body1'}
      buttonLabel={t('businessNotFound.close')}
      onButtonClick={() => window.location.assign(ENV.URL_FE.LOGOUT)}
    />
  ) : (
    <></>
  );
}

export default withLogin(StepRetrieveBusinesses);

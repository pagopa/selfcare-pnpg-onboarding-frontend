import { useEffect, useState } from 'react';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { EndingPage, useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { IllusError } from '@pagopa/mui-italia';
import { useTranslation, Trans } from 'react-i18next';
import { storageUserOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { BusinessPnpg, StepperStepComponentProps } from '../../../types';
import { ENV } from '../../../utils/env';
import { useHistoryState } from '../../../components/useHistoryState';
import { onboardingPGSubmit } from '../../../services/onboardingService';

type Props = StepperStepComponentProps & {
  setLoading: (loading: boolean) => void;
};

function StepSubmit({ forward, setLoading }: Props) {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();

  const [selectedInstitution, setSelectedInstitution, setSelectedInstitutionHistory] =
    useHistoryState<BusinessPnpg | undefined>('selected_institution', undefined);
  const [error, setError] = useState<'alreadyOnboarded' | 'genericError'>();

  const loggedUser = storageUserOps.read();

  const productId = 'prod-pn-pg';

  useEffect(() => {
    if (!error && selectedInstitution) {
      setLoading(true);
      submit(selectedInstitution.businessTaxId, productId, selectedInstitution)
        .catch((reason) => {
          addError({
            id: 'ONBOARDING_PNPG_SUBMIT_ERROR',
            blocking: false,
            error: reason,
            techDescription: `An error occurred while submit onboarding of ${selectedInstitution}`,
            toNotify: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const submit = async (
    externalInstitutionId: string,
    productId: string,
    selectedInstitution: BusinessPnpg
  ) => {
    setLoading(true);
    onboardingPGSubmit(externalInstitutionId, productId, loggedUser, selectedInstitution)
      .then(() => {
        trackEvent('ONBOARDING_PNPG_SEND_SUCCESS', {});
        setSelectedInstitution(selectedInstitution);
        setSelectedInstitutionHistory(selectedInstitution);
        forward();
      })
      .catch((reason) => {
        if (reason.httpStatus === 409) {
          setError('alreadyOnboarded');
          trackEvent('ONBOARDING_PNPG_SEND_ALREADY_ONBOARDED', {});
          setSelectedInstitution(selectedInstitution);
          setSelectedInstitutionHistory(selectedInstitution);
        } else {
          setError('genericError');
          trackEvent('ONBOARDING_PNPG_SEND_GENERIC_ERROR', {});
        }
      })
      .finally(() => setLoading(false));
  };

  return error === 'genericError' ? (
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
      onButtonClick={() => window.location.assign(ENV.URL_FE.LOGIN)}
    />
  ) : error === 'alreadyOnboarded' ? (
    <EndingPage
      icon={<IllusError size={60} />}
      title={t('alreadyOnboarded.title')}
      description={
        <Trans i18nKey="alreadyOnboarded.description">
          L&apos;impresa selezionata ha già effettuato l&apos;adesione. <br />
          Puoi entrare nel portale.
        </Trans>
      }
      variantTitle={'h4'}
      variantDescription={'body1'}
      buttonLabel={t('alreadyOnboarded.signIn')}
      onButtonClick={() =>
        window.location.assign(ENV.URL_FE.DASHBOARD + '/' + `${selectedInstitution?.businessTaxId}`)
      }
    />
  ) : (
    <></>
  );
}
export default StepSubmit;

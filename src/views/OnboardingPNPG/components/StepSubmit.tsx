import { useContext, useEffect, useState } from 'react';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { EndingPage } from '@pagopa/selfcare-common-frontend';
import { IllusError } from '@pagopa/mui-italia';
import { useTranslation, Trans } from 'react-i18next';
import { BusinessPnpg, StepperStepComponentProps } from '../../../../types';
import { HeaderContext, UserContext } from '../../../lib/context';
import { unregisterUnloadEvent } from '../../../utils/unloadEvent-utils';
import { fetchWithLogs } from '../../../lib/api-utils';
import { getFetchOutcome } from '../../../lib/error-utils';
import { ENV } from '../../../utils/env';

type Props = StepperStepComponentProps & {
  setLoading: (loading: boolean) => void;
  selectedInstitution?: BusinessPnpg;
};

function StepSubmit({ forward, setLoading, selectedInstitution }: Props) {
  const { t } = useTranslation();
  const [error, setError] = useState<boolean>(false);
  const { setOnExit } = useContext(HeaderContext);
  const { setRequiredLogin } = useContext(UserContext);

  const productId = 'prod-pn-pg';

  useEffect(() => {
    if (!error) {
      setLoading(true);
      submit()
        .catch((_reason) => {
          setError(true);
        })
        .finally(() => {
          unregisterUnloadEvent(setOnExit);
          setLoading(false);
        });
    }
  }, []);

  const submit = async () => {
    const submitResponse = await fetchWithLogs(
      {
        endpoint: 'ONBOARDING_PNPG_SUBMIT',
        endpointParams: {
          externalInstitutionId: selectedInstitution?.businessTaxId,
          productId,
        },
      },
      {
        method: 'POST',
        data: {
          billingData: {
            businessName: selectedInstitution?.businessName,
            taxCode: selectedInstitution?.businessTaxId,
          },
          users: [
            {
              taxCode: 'DLLDGI53T30I324E',
              name: 'Diego',
              surname: 'Della Valle',
              email: 'd.dellavalle@test.it',
              role: 'MANAGER',
            },
          ],
        },
      },
      () => setRequiredLogin(true)
    );

    const outcome = getFetchOutcome(submitResponse);

    if (outcome === 'success') {
      trackEvent('ONBOARDING_PNPG_SEND_SUCCESS', {});
      forward();
    } else {
      trackEvent('ONBOARDING_PNPG_SEND_ERROR', {});
      setError(true);
    }
  };

  return error ? (
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
export default StepSubmit;

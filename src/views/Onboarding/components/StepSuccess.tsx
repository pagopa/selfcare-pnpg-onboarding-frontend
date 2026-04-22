/* eslint-disable functional/no-let */
import { IllusCompleted, IllusError } from '@pagopa/mui-italia';
import EndingPage from '@pagopa/selfcare-common-frontend/lib/components/EndingPage';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/lib/hooks/useErrorDispatcher';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { InstitutionOnboardingResource } from '../../../api/generated/b4f-onboarding/InstitutionOnboardingResource';
import { getInstitutionOnboardingInfo } from '../../../services/onboardingService';
import { Company } from '../../../types';
import { ENV } from '../../../utils/env';

type Props = {
  setLoading: Dispatch<SetStateAction<boolean>>;
  companyData?: Company;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
function StepSuccess({ setLoading, companyData }: Props) {
  const { t } = useTranslation();
  const sessionToken = storageTokenOps.read();
  const [retrievedPartyId, setRetrievedPartyId] = useState<string>();
  const addError = useErrorDispatcher();
  const [error, setError] = useState<boolean>();
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const POLL_INTERVAL_MS = 3000;
    const MAX_ATTEMPTS = 3;
    let attempts = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const fetchCompanyData = async (): Promise<{ partyId?: string; hasError: boolean }> => {
      if (!companyData) {
        return { hasError: false };
      }
      try {
        const response = (await getInstitutionOnboardingInfo(
          companyData.companyTaxCode,
          'prod-pn-pg',
          sessionToken
        )) as Response;

        if (!response.ok) {
          return { hasError: true };
        }

        const businesses = (await response.json()) as Array<InstitutionOnboardingResource>;
        return { partyId: businesses[0]?.institutionId, hasError: false };
      } catch (err: any) {
        addError({
          id: 'ONBOARDING_PNPG_ACCESS_ERROR',
          blocking: false,
          error: err,
          techDescription: `Error during access process: ${err.message}`,
          toNotify: true,
        });
        return { hasError: true };
      }
    };

    const poll = async () => {
      attempts += 1;
      const { partyId, hasError } = await fetchCompanyData();
      if (partyId) {
        setRetrievedPartyId(partyId);
        setIsReady(true);
        setLoading(false);
      } else if (hasError) {
        setError(true);
        setLoading(false);
      } else if (attempts < MAX_ATTEMPTS) {
        timeoutId = setTimeout(() => void poll(), POLL_INTERVAL_MS);
      } else {
        setIsReady(true);
        setLoading(false);
      }
    };

    setLoading(true);
    void poll();

    return () => clearTimeout(timeoutId);
  }, []);

  return error ? (
    <EndingPage
      minHeight="52vh"
      icon={<IllusError size={60} />}
      title={t('outcome.error.title')}
      description={
        <Trans i18nKey="outcome.error.description">
          A causa di un problema tecnico, non riusciamo a registrare <br />
          l&apos;impresa. Riprova più tardi.
        </Trans>
      }
      variantTitle={'h4'}
      variantDescription={'body1'}
      buttonLabel={t('outcome.error.close')}
      onButtonClick={() => window.location.assign(ENV.URL_FE.LOGIN)}
    />
  ) : (
    isReady && (
      <EndingPage
        minHeight="52vh"
        icon={<IllusCompleted size={60} />}
        title={t('outcome.success.title')}
        description={
          <Trans i18next="outcome.success.description" components={{ 1: <br /> }}>
            {
              'Ora puoi leggere le notifiche e aggiungere altri utenti <1 />nell’area riservata di SEND.'
            }
          </Trans>
        }
        variantTitle={'h4'}
        variantDescription={'body1'}
        buttonLabel={t('outcome.success.signIn')}
        onButtonClick={
          retrievedPartyId
            ? () => window.location.assign(`${ENV.URL_FE.DASHBOARD}/${retrievedPartyId}`)
            : undefined
        }
      />
    )
  );
}
export default StepSuccess;

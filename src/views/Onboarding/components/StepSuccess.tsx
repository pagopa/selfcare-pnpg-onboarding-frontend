/* eslint-disable functional/no-let */
import { IllusCompleted } from '@pagopa/mui-italia';
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

function StepSuccess({ setLoading, companyData }: Props) {
  const { t } = useTranslation();
  const sessionToken = storageTokenOps.read();
  const [retrievedPartyId, setRetrievedPartyId] = useState<string>();
  const addError = useErrorDispatcher();

  const retrievedCompanyData = async (): Promise<string | undefined> => {
    if (!companyData) {
      return undefined;
    }
    try {
      const response = (await getInstitutionOnboardingInfo(
        companyData.companyTaxCode,
        'prod-pn-pg',
        sessionToken
      )) as Response;

      if (!response.ok) {
        return undefined;
      }

      const businesses = (await response.json()) as Array<InstitutionOnboardingResource>;
      return businesses[0]?.institutionId;
    } catch (error: any) {
      addError({
        id: 'ONBOARDING_PNPG_ACCESS_ERROR',
        blocking: false,
        error,
        techDescription: `Error during access process: ${error.message}`,
        toNotify: true,
      });
      return undefined;
    }
  };

  useEffect(() => {
    const POLL_INTERVAL_MS = 3000;
    const MAX_ATTEMPTS = 3;
    let attempts = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const poll = async () => {
      attempts += 1;
      const partyId = await retrievedCompanyData();
      if (partyId) {
        setRetrievedPartyId(partyId);
        setLoading(false);
      } else if (attempts < MAX_ATTEMPTS) {
        timeoutId = setTimeout(() => void poll(), POLL_INTERVAL_MS);
      } else {
        setLoading(false);
      }
    };

    setLoading(true);
    void poll();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
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
  );
}
export default StepSuccess;

  import { IllusCompleted } from '@pagopa/mui-italia';
  import EndingPage from '@pagopa/selfcare-common-frontend/lib/components/EndingPage';
  import { useTranslation, Trans } from 'react-i18next';
  import { Dispatch, SetStateAction, useEffect, useState } from 'react';
  import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
  import { ENV } from '../../../utils/env';
  import { InstitutionOnboardingResource } from '../../../api/generated/b4f-onboarding/InstitutionOnboardingResource';
  import { getInstitutionOnboardingInfo } from '../../../services/onboardingService';
  import { Company } from '../../../types';

  type Props = {
    setLoading: Dispatch<SetStateAction<boolean>>;
    companyData?: Company;
  };

  function StepSuccess({ setLoading, companyData }: Props) {
    const { t } = useTranslation();
    const sessionToken = storageTokenOps.read();
    const [retrievedPartyId, setRetrievedPartyId] = useState<string>();

    const retrievedCompanyData = async () => {
      if (companyData) {
        setLoading(true);
        const response = (await getInstitutionOnboardingInfo(
          companyData.companyTaxCode,
          'prod-pn-pg',
          sessionToken
        )) as Response;

        if (!response.ok) {
          console.error('API call failed:', response.status, response.statusText);
          throw new Error('API call failed');
        }

        const businesses = (await response.json()) as Array<InstitutionOnboardingResource>;

        if (businesses[0]) {
          setRetrievedPartyId(businesses[0].institutionId);
        }

        setLoading(false);
      }
    };

    useEffect(() => {
      void retrievedCompanyData();
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
        onButtonClick={() =>
          window.location.assign(ENV.URL_FE.DASHBOARD + '/' + `${retrievedPartyId}`)
        }
      />
    );
  }
  export default StepSuccess;

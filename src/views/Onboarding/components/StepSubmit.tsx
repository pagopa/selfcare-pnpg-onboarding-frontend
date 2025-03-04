import { useContext, useEffect, useState } from 'react';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { EndingPage, useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import { useTranslation, Trans } from 'react-i18next';
import { storageUserOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { IllusError } from '@pagopa/mui-italia/dist/illustrations/Error';
import { uniqueId } from 'lodash';
import { Company, StepperStepComponentProps, User } from '../../../types';
import { ENV } from '../../../utils/env';
import { onboardingPGSubmit } from '../../../services/onboardingService';
import { RoleEnum } from '../../../api/generated/b4f-onboarding/CompanyUserDto';
import { UserContext } from '../../../lib/context';
import { MOCK_USER } from '../../../utils/constants';

type Props = StepperStepComponentProps & {
  setLoading: (loading: boolean) => void;
  forward: any;
  companyData?: Company;
};

function StepSubmit({ setLoading, forward, companyData }: Props) {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const { user } = useContext(UserContext);
  const [error, setError] = useState<boolean>();
  const loggedUser = MOCK_USER ? (user as User) : storageUserOps.read();
  const requestId = uniqueId();

  useEffect(() => {
    if (companyData && loggedUser) {
      setLoading(true);
      void submit(companyData.companyTaxCode, 'prod-pn-pg', companyData, loggedUser);
    }
  }, []);

  const submit = async (
    businessTaxCode: string,
    productId: string,
    selectedBusiness: Company,
    loggedUser: User
  ) => {
    setLoading(true);
    await onboardingPGSubmit(
      businessTaxCode,
      productId,
      {
        taxCode: loggedUser.taxCode,
        name: loggedUser.name,
        surname: loggedUser.surname,
        email: loggedUser.email,
        role: 'MANAGER' as RoleEnum,
      },
      selectedBusiness,
      selectedBusiness.companyEmail as string
    )
      .then(async () => {
        trackEvent('ONBOARDING_PG_SUBMIT_SUCCESS', {
          requestId,
          productId,
        });
        setLoading(true);
        forward();
      })
      .catch((reason) => {
        setError(true);
        trackEvent('ONBOARDING_PG_SUBMIT_GENERIC_ERROR', {
          requestId,
          productId,
        });
        addError({
          id: 'ONBOARDING_PNPG_SUBMIT_ERROR',
          blocking: false,
          error: reason,
          techDescription: `An error occurred while submit onboarding of ${companyData}`,
          toNotify: true,
        });
      })
      .finally(() => setLoading(false));
  };

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
    <></>
  );
}
export default StepSubmit;

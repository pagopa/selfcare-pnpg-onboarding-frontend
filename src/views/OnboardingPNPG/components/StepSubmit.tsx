import { useEffect, useState } from 'react';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { EndingPage, useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { useTranslation, Trans } from 'react-i18next';
import { storageUserOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { IllusError } from '@pagopa/mui-italia/dist/illustrations/Error';
import { uniqueId } from 'lodash';
import { ReactComponent as AlreadyOnboardedIcon } from '../../../assets/alreadyOnboarded.svg';
import { Business, StepperStepComponentProps, User } from '../../../types';
import { ENV } from '../../../utils/env';
import { useHistoryState } from '../../../components/useHistoryState';
import {
  getInstitutionOnboardingInfo,
  onboardingPGSubmit,
} from '../../../services/onboardingService';
import { RoleEnum } from '../../../api/generated/b4f-onboarding-pnpg/CompanyUserDto';

type Props = StepperStepComponentProps & {
  setLoading: (loading: boolean) => void;
  setRetrievedPartyId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

function StepSubmit({ forward, setLoading, setRetrievedPartyId }: Props) {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();

  const [selectedBusiness, setSelectedBusiness, setSelectedBusinessHistory] = useHistoryState<
    Business | undefined
  >('selected_business', undefined);
  const [insertedBusinessEmail, _setInsertedBusinessEmail, setInsertedBusinessEmailHistory] =
    useHistoryState<string>('inserted_business_email', undefined);

  const [error, setError] = useState<'alreadyOnboarded' | 'genericError'>();
  const [partyId, setPartyId] = useState<string>();

  const requestId = uniqueId();

  const productId = 'prod-pn-pg';

  const retrievePartyIdFromTaxCode = async (taxCode: string) => {
    setLoading(true);
    await getInstitutionOnboardingInfo(taxCode, 'prod-pn-pg')
      .then((res) => {
        setRetrievedPartyId(res?.institution?.id);
        setPartyId(res?.institution?.id);
      })
      .catch((reason) => {
        addError({
          id: 'RETRIEVING_PARTY_ID_ERROR',
          blocking: false,
          error: reason,
          techDescription: `An error occurred while retrieving party id of ${selectedBusiness}`,
          toNotify: true,
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const loggedUser = storageUserOps.read();
    if (!error && selectedBusiness && loggedUser) {
      setLoading(true);
      submit(selectedBusiness.businessTaxId, productId, selectedBusiness, loggedUser)
        .catch((reason) => {
          addError({
            id: 'ONBOARDING_PNPG_SUBMIT_ERROR',
            blocking: false,
            error: reason,
            techDescription: `An error occurred while submit onboarding of ${selectedBusiness}`,
            toNotify: true,
          });
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const submit = async (
    businessId: string,
    productId: string,
    selectedBusiness: Business,
    loggedUser: User
  ) => {
    await onboardingPGSubmit(
      businessId,
      productId,
      {
        taxCode: loggedUser.taxCode,
        name: loggedUser.name,
        surname: loggedUser.surname,
        email: loggedUser.email,
        role: 'MANAGER' as RoleEnum,
      },
      selectedBusiness,
      insertedBusinessEmail
    )
      .then(async () => {
        await retrievePartyIdFromTaxCode(selectedBusiness.businessTaxId);
        trackEvent('ONBOARDING_PG_SUBMIT_SUCCESS', {
          requestId,
          productId,
        });
        setSelectedBusiness(selectedBusiness);
        setSelectedBusinessHistory(selectedBusiness);
        forward();
      })
      .catch(async (reason) => {
        if (reason.httpStatus === 409) {
          setError('alreadyOnboarded');
          trackEvent('ONBOARDING_PG_SUBMIT_ALREADY_ONBOARDED', {
            requestId,
            productId,
          });
          await retrievePartyIdFromTaxCode(selectedBusiness.businessTaxId);
          setSelectedBusiness(selectedBusiness);
          setSelectedBusinessHistory(selectedBusiness);
        } else {
          setError('genericError');
          trackEvent('ONBOARDING_PG_SUBMIT_GENERIC_ERROR', {
            requestId,
            productId,
          });
        }
      })
      .finally(() => {
        setInsertedBusinessEmailHistory('');
      });
  };

  return error === 'genericError' ? (
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
  ) : error === 'alreadyOnboarded' ? (
    <EndingPage
      icon={<AlreadyOnboardedIcon />}
      title={t('alreadyOnboarded.title')}
      description={
        <Trans i18nKey="alreadyOnboarded.description">
          Questa impresa è già stata registrata. Accedi per leggere le <br />
          notifiche e aggiungere altri utenti.
        </Trans>
      }
      variantTitle={'h4'}
      variantDescription={'body1'}
      buttonLabel={t('alreadyOnboarded.signIn')}
      onButtonClick={() => window.location.assign(ENV.URL_FE.DASHBOARD + '/' + `${partyId}`)}
    />
  ) : (
    <></>
  );
}
export default StepSubmit;

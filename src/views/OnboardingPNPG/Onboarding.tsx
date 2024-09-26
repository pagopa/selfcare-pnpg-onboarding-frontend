import { Container } from '@mui/material';
import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { EndingPage } from '@pagopa/selfcare-common-frontend/lib';
import { LegalEntity, StepperStep } from '../../types';
import { withLogin } from '../../components/withLogin';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { ReactComponent as AlreadyOnboardedIcon } from '../../assets/alreadyOnboarded.svg';
import { ENV } from '../../utils/env';
import StepAddCompany from './components/StepAddCompany';
import StepRetrieveBusinesses from './components/StepRetrieveBusinesses';
import StepSelectBusiness from './components/StepSelectBusiness';
import StepSubmit from './components/StepSubmit';
import StepSuccess from './components/StepSuccess';
import StepBusinessData from './components/StepBusinessData';

function OnboardingComponent() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState(0);
  const [retrievedBusinesses, setRetrievedBusinesses] = useState<LegalEntity>();
  const [retrievedPartyId, setRetrievedPartyId] = useState<string>();

  const forward = () => {
    setActiveStep(activeStep + 1);
  };

  const steps: Array<StepperStep> = [
    {
      label: 'Retrieve businesses',
      Component: () =>
        StepRetrieveBusinesses({
          setRetrievedBusinesses,
          setActiveStep,
          setLoading,
        }),
    },
    {
      label: 'Select business',
      Component: () =>
        StepSelectBusiness({
          retrievedBusinesses,
          setActiveStep,
          setRetrievedPartyId,
          setLoading,
          forward,
        }),
    },
    {
      label: 'Add company',
      Component: () =>
        StepAddCompany({
          setActiveStep,
          setRetrievedPartyId,
          setLoading,
        }),
    },
    {
      label: 'Insert business data',
      Component: () =>
        StepBusinessData({
          setActiveStep,
        }),
    },
    {
      label: 'Submit',
      Component: () =>
        StepSubmit({
          setLoading,
          forward,
        }),
    },
    {
      label: 'Success',
      Component: () => StepSuccess({ retrievedPartyId }),
    },
  ];

  const Step = useMemo(() => steps[activeStep].Component, [activeStep]);

  return (
    <Container>
      {loading && <LoadingOverlay loadingText={t('loadingText')} />}
      {retrievedPartyId ? (
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
          onButtonClick={() =>
            window.location.assign(ENV.URL_FE.DASHBOARD + '/' + `${retrievedPartyId}`)
          }
        />
      ) : (
        <Step />
      )}
    </Container>
  );
}

export default withLogin(OnboardingComponent);

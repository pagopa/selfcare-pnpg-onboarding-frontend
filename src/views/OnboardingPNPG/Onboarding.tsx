import { Container } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LegalEntity, StepperStep } from '../../types';
import { withLogin } from '../../components/withLogin';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { InstitutionOnboardingResource } from '../../api/generated/b4f-onboarding/InstitutionOnboardingResource';
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
  const [onboardingData, setOnboardingData] = useState<InstitutionOnboardingResource>();

  const forward = () => {
    setActiveStep(activeStep + 1);
  };

  const back = () => {
    setActiveStep(activeStep - 1);
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
          setOnboardingData,
          setLoading,
          forward,
          back,
        }),
    },
    {
      label: 'Add company',
      Component: () =>
        StepAddCompany({
          setActiveStep,
          setOnboardingData,
          setLoading,
          back: () => location.reload(),
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
          setOnboardingData,
          forward,
        }),
    },
    {
      label: 'Success',
      Component: () => StepSuccess({ retrievedPartyId: onboardingData?.institutionId }),
    },
  ];

  const Step = useMemo(() => steps[activeStep].Component, [activeStep]);

  return (
    <Container>
      {loading && <LoadingOverlay loadingText={t('loadingText')} />}
      <Step />
    </Container>
  );
}

export default withLogin(OnboardingComponent);

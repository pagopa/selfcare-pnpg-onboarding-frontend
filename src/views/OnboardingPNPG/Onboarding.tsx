import { Container } from '@mui/material';
import { useMemo, useState } from 'react';
import { LegalEntity, StepperStep } from '../../types';
import { withLogin } from '../../components/withLogin';
import StepAddCompany from './components/StepAddCompany';
import StepRetrieveBusinesses from './components/StepRetrieveBusinesses';
import StepSelectBusiness from './components/StepSelectBusiness';
import StepSubmit from './components/StepSubmit';
import StepSuccess from './components/StepSuccess';
import StepBusinessData from './components/StepBusinessData';

function OnboardingComponent() {
  const [_loading, setLoading] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState(0);
  const [retrievedBusinesses, setRetrievedBusinesses] = useState<LegalEntity>();
  const [retrievedPartyId, setRetrievedPartyId] = useState<string>();

  const forward = () => {
    setActiveStep(activeStep + 1);
  };

  const forwardWithPartyId = (retrievedId: string) => {
    setRetrievedPartyId(retrievedId);
    forward();
  };

  const steps: Array<StepperStep> = [
    {
      label: 'Retrieve businesses',
      Component: () =>
        StepRetrieveBusinesses({
          setRetrievedBusinesses,
          setActiveStep,
        }),
    },
    {
      label: 'Select business',
      Component: () =>
        StepSelectBusiness({
          retrievedBusinesses,
          setActiveStep,
          forward,
        }),
    },
    {
      label: 'Add company',
      Component: () =>
        StepAddCompany({
          setActiveStep,
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
          forward: forwardWithPartyId,
        }),
    },
    {
      label: 'Success',
      Component: () => StepSuccess({ partyId: retrievedPartyId }),
    },
  ];

  const Step = useMemo(() => steps[activeStep].Component, [activeStep]);

  return (
    <Container>
      <Step />
    </Container>
  );
}

export default withLogin(OnboardingComponent);

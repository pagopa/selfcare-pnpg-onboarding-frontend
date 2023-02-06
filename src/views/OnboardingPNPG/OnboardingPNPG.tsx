import { Container } from '@mui/material';
import { useMemo, useState } from 'react';
import { InstitutionsPnPG, StepperStep } from '../../../types';
import { withLogin } from '../../components/withLogin';
import StepRetrieveInstitutions from './components/StepRetrieveInstitutions';
import StepSelectInstitution from './components/StepSelectInstitution';
import StepSubmit from './components/StepSubmit';
import StepSuccess from './components/StepSuccess';

function OnboardingPNPGComponent() {
  const [activeStep, setActiveStep] = useState(0);
  const [retrievedInstitutions, setRetrievedInstitutions] = useState<InstitutionsPnPG>();
  const [_loading, setLoading] = useState<boolean>(false);

  const forward = () => {
    setActiveStep(activeStep + 1);
  };

  const steps: Array<StepperStep> = [
    {
      label: 'Retrieve institutions',
      Component: () =>
        StepRetrieveInstitutions({
          retrievedInstitutions,
          setRetrievedInstitutions,
          setActiveStep,
        }),
    },
    {
      label: 'Select Institution',
      Component: () =>
        StepSelectInstitution({
          retrievedInstitutions,
          forward,
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
      Component: () => StepSuccess(),
    },
  ];

  const Step = useMemo(() => steps[activeStep].Component, [activeStep]);

  return (
    <Container>
      <Step />
    </Container>
  );
}

export default withLogin(OnboardingPNPGComponent);

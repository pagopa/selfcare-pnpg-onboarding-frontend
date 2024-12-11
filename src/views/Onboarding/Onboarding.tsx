import { Container } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Company, StepperStep } from '../../types';
import { withLogin } from '../../components/withLogin';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import StepAddCompany from './components/StepAddCompany';
import StepSubmit from './components/StepSubmit';
import StepSuccess from './components/StepSuccess';
import StepBusinessData from './components/StepBusinessData';

function OnboardingComponent() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState(0);
  const [companyData, setCompanyData] = useState<Company>();

  const forwardWithData = (companyInfo: Company) => {
    setCompanyData(companyInfo);
  };

  const forwardWithCompleteData = (completeCompanyInfo: Company) => {
    setCompanyData(completeCompanyInfo);
    forward();
  };

  const forwardWithInstitutionId = (institutionId: string) => {
    if (companyData) {
      setCompanyData({ ...companyData, institutionId });
    }
    forward();
  };

  const forward = () => {
    setActiveStep(activeStep + 1);
  };

  const back = () => {
    setActiveStep(activeStep - 1);
  };

  const steps: Array<StepperStep> = [
    {
      label: 'Add company',
      Component: () =>
        StepAddCompany({
          setLoading,
          setActiveStep,
          forward: (companyInfo: Company) => {
            forwardWithData(companyInfo);
          },
          back,
        }),
    },
    {
      label: 'Insert business data',
      Component: () =>
        StepBusinessData({
          companyData,
          forward: (completeCompanyInfo: Company) => {
            forwardWithCompleteData(completeCompanyInfo);
          },
          back: () => {
            setCompanyData(undefined);
            setActiveStep(activeStep - 1);
          },
        }),
    },
    {
      label: 'Submit',
      Component: () =>
        StepSubmit({
          setLoading,
          companyData,
          forward: (institutionId: string) => {
            forwardWithInstitutionId(institutionId);
          },
        }),
    },
    {
      label: 'Success',
      Component: () => StepSuccess({ retrievedPartyId: companyData?.institutionId }),
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

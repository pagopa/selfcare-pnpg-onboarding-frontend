import { Container } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { EndingPage } from '@pagopa/selfcare-common-frontend';
import { IllusError, theme } from '@pagopa/mui-italia';
import { useTranslation, Trans } from 'react-i18next';
import { Typography, Link } from '@mui/material';
import { InstitutionsPnPG, RequestOutcomeMessage, StepperStep } from '../../../types';
import { withLogin } from '../../components/withLogin';
import StepRetrieveInstitutions, {
  institutionsNotFound,
} from './components/StepRetrieveInstitutions';
import StepSelectInstitution from './components/StepSelectInstitution';

function OnboardingPNPGComponent() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [outcome, setOutcome] = useState<RequestOutcomeMessage>();
  const [retrievedInstitutions, setRetrievedInstitutions] = useState<InstitutionsPnPG>();

  useEffect(() => {
    if (retrievedInstitutions) {
      setActiveStep(1);
    } else {
      setOutcome(institutionsNotFound);
    }
  }, [retrievedInstitutions]);

  useEffect(() => {});
  const forward = () => {
    setActiveStep(activeStep + 1);
  };

  const steps: Array<StepperStep> = [
    {
      label: 'Retrieve institutions',
      Component: () => StepRetrieveInstitutions({ setRetrievedInstitutions }),
    },
    {
      label: 'Select Institution',
      Component: () =>
        StepSelectInstitution({
          retrievedInstitutions,
          forward,
        }),
    },
  ];

  const Step = useMemo(() => steps[activeStep].Component, [activeStep]);

  return outcome && !retrievedInstitutions ? (
    <>
      <EndingPage
        icon={<IllusError />}
        title={t('institutionsNotFound.title')}
        description={
          <Trans i18nKey="institutionsNotFound.message">
            Per accedere alle notifiche, l’azienda deve essere registrata <br /> dal Legale
            Rappresentante.
          </Trans>
        }
        variantTitle={'h4'}
        variantDescription={'body1'}
        buttonLabel={t('institutionsNotFound.backToAccess')}
        onButtonClick={() => {}} // TODO Redirect to access
      />
      <Typography
        sx={{
          textAlign: 'center',
          display: 'block',
          marginTop: 4,
        }}
        variant="caption"
        color={theme.palette.text.primary}
      >
        <Trans i18nKey="selectInstitutionReleated.changeInstitutionSelectedLink">
          {'Sei il Legale Rappresentante di un’azienda? '}
          <Link sx={{ textDecoration: 'underline', color: theme.palette.primary.main }} href="">
            {/* Todo add the correct redirect */}
            {'Registra nuova azienda'}
          </Link>
        </Trans>
      </Typography>
    </>
  ) : (
    <Container>
      <Step />
    </Container>
  );
}

export default withLogin(OnboardingPNPGComponent);

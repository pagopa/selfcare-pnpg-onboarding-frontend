import { Grid, Typography, Card, TextField, Link } from '@mui/material';
import { IllusError, theme } from '@pagopa/mui-italia';
import EndingPage from '@pagopa/selfcare-common-frontend/components/EndingPage';
import LoadingOverlay from '@pagopa/selfcare-common-frontend/components/Loading/LoadingOverlay';
import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { BusinessPnpg } from '../../../../types';
import { loggedUser } from '../../../api/__mocks__/DashboardPnPgApiClient';
import { OnboardingStepActions } from '../../../components/OnboardingStepActions';
import { useHistoryState } from '../../../components/useHistoryState';
import { withLogin } from '../../../components/withLogin';
import {
  getInstitutionLegalAddress,
  matchInstitutionAndUser,
} from '../../../services/onboardingService';
import { ENV } from '../../../utils/env';

type Props = {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
};

function StepAddCompany({ setActiveStep }: Props) {
  const { t } = useTranslation();

  const [_selectedInstitution, setSelectedInstitution, setSelectedInstitutionHistory] =
    useHistoryState<BusinessPnpg | undefined>('selected_institution', undefined);

  const [typedInput, setTypedInput] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDisabled, _setIsDisabled] = useState<boolean>(false);

  // TODO When service login is available, the loggedUser mockedObject, will be replace with the real loggedUser contained into userContext
  const handleSubmit = (typedInput: string) => {
    setLoading(true);
    getInstitutionLegalAddress(typedInput)
      .then((e) => {
        if (e.address !== '') {
          console.log('TODO PUT HERE THE NEW UI TO MAKE IN THE NEXT SPRINT');
        } else {
          matchInstitutionAndUser(typedInput, loggedUser)
            .then((e) => {
              if (e === true) {
                setSelectedInstitution({
                  businessName: '',
                  businessTaxId: typedInput,
                });
                setSelectedInstitutionHistory({
                  businessName: '',
                  businessTaxId: typedInput,
                });
                setActiveStep(4);
              } else {
                setError(true);
              }
            })
            .catch(() => {
              console.log(
                'TODO: PROBABLY THIS CASE WILL BE COVERED BY THE NEW UI PAGE INTRODUCED AT THE NEXT SPRINT'
              );
              setError(true);
            })
            .finally(() => setLoading(false));
        }
      })
      .catch(() => setError(true));
  };

  return error ? (
    <>
      <EndingPage
        icon={<IllusError size={60} />}
        title={t('institutionNotFound.title')}
        description={
          <Trans i18nKey="institutionNotFound.message">
            Per accedere alle notifiche, l’azienda deve essere registrata <br /> dal Legale
            Rappresentante.
          </Trans>
        }
        variantTitle={'h4'}
        variantDescription={'body1'}
        buttonLabel={t('institutionNotFound.backToAccess')}
        onButtonClick={() => ENV.URL_FE.LOGOUT}
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
        <Trans i18nKey="institutionNotFound.registerNewAgency">
          {'Sei il Legale Rappresentante di un’azienda? '}
          <Link
            sx={{
              textDecoration: 'underline',
              cursor: 'pointer',
              color: theme.palette.primary.main,
            }}
            onClick={() => {
              setError(false);
              setTypedInput('');
            }}
          >
            {'Registra nuova azienda'}
          </Link>
        </Trans>
      </Typography>
    </>
  ) : loading ? (
    <LoadingOverlay />
  ) : (
    <Grid container direction="column" my={16}>
      <Grid container item justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h3" component="h2" align="center" color={theme.palette.text.primary}>
            {t('addCompany.title')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography align="center" color={theme.palette.text.primary} m={1} mb={3}>
            <Trans i18next="addCompany.description">
              Inserisci il Codice Fiscale/Partita IVA dell’impresa con cui vuoi <br />
              accedere a Piattaforma Notifiche
            </Trans>
          </Typography>
        </Grid>
        <Grid item xs={12} display={'contents'}>
          <Card
            variant="outlined"
            sx={{
              display: 'grid',
              alignItems: 'center',
              justifyItems: 'center',
              width: '480px',
              height: '120px',
              borderRadius: theme.spacing(2),
              boxShadow:
                '0px 8px 10px -5px rgba(0, 43, 85, 0.1), 0px 16px 24px 2px rgba(0, 43, 85, 0.05), 0px 6px 30px 5px rgba(0, 43, 85, 0.1)',
            }}
          >
            <TextField
              id="fiscalCode-textfield"
              label={t('addCompany.textfieldLabel')}
              variant="outlined"
              type="tel"
              onChange={(e) => setTypedInput(e.target.value)}
              sx={{ width: '416px', marginX: 4 }}
            />
          </Card>
        </Grid>
        <Grid container my={4}>
          <OnboardingStepActions
            forward={{
              action: () => handleSubmit(typedInput),
              label: t('addCompany.forwardAction'),
              disabled: typedInput.length !== 11 || isDisabled,
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default withLogin(StepAddCompany);

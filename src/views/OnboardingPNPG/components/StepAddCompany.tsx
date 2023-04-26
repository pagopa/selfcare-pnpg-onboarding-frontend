import { Grid, Typography, Card, TextField } from '@mui/material';
import { IllusError, theme } from '@pagopa/mui-italia';
import EndingPage from '@pagopa/selfcare-common-frontend/components/EndingPage';
import LoadingOverlay from '@pagopa/selfcare-common-frontend/components/Loading/LoadingOverlay';
import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { storageUserOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { BusinessPnpg } from '../../../types';
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
  const addError = useErrorDispatcher();

  const [_selectedInstitution, setSelectedInstitution, setSelectedInstitutionHistory] =
    useHistoryState<BusinessPnpg | undefined>('selected_institution', undefined);

  const [typedInput, setTypedInput] = useState<string>('');
  const [error, setError] = useState<'matchedButNotLR' | 'typedNotFound'>();
  const [loading, setLoading] = useState<boolean>(false);

  const loggedUser = storageUserOps.read();

  const handleSubmit = (typedInput: string) => {
    setLoading(true);
    getInstitutionLegalAddress(typedInput)
      .then(() => {
        setLoading(false);
        setError('matchedButNotLR');
      })
      .catch(() => {
        setLoading(true);
        matchInstitutionAndUser(typedInput, loggedUser)
          .then(() => {
            setSelectedInstitution({
              certified: false,
              businessName: '',
              businessTaxId: typedInput,
            });
            setSelectedInstitutionHistory({
              certified: false,
              businessName: '',
              businessTaxId: typedInput,
            });
            setActiveStep(3);
          })
          .catch((reason) => {
            addError({
              id: 'MATCH_INSTITUTION_AND_USER_ERROR',
              blocking: false,
              error: reason,
              techDescription: `An error occurred while matching institution and user`,
              toNotify: true,
            });
          })
          .finally(() => setLoading(false));
        setError('typedNotFound');
      })
      .finally(() => setLoading(false));
  };

  return error === 'typedNotFound' ? (
    <>
      <EndingPage
        icon={<IllusError size={60} />}
        title={t('typedNotFound.title')}
        description={
          <Trans i18nKey="typedNotFound.message">
            Dal tuo SPID non risulti essere Legale Rappresentante <br /> dell’impresa che stavi
            cercando.
          </Trans>
        }
        variantTitle={'h4'}
        variantDescription={'body1'}
        buttonLabel={t('typedNotFound.close')}
        onButtonClick={() => ENV.URL_FE.LOGOUT}
      />
    </>
  ) : error === 'matchedButNotLR' ? (
    <>
      <EndingPage
        icon={<IllusError size={60} />}
        title={
          <Trans i18nKey="matchedButNotLR.title">
            Abbiamo riscontrato la tua azienda nel nostro database, ma non ne risulti il legale
            rappresentante. <br />
            Contatta il Registro delle imprese per farti aggiungere.
          </Trans>
        }
        description={''}
        variantTitle={'h5'}
        buttonLabel={t('matchedButNotLR.backToAccess')}
        onButtonClick={() => {
          setError(undefined);
          setTypedInput('');
        }}
      />
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
            <Trans i18next="addCompany.subTitle">
              Inserisci il Codice Fiscale dell’impresa che vuoi <br />
              registrare.
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
              disabled: typedInput.length !== 11,
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default withLogin(StepAddCompany);

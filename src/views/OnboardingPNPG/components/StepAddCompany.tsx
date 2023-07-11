import { Grid, Typography, Card, TextField } from '@mui/material';
import { IllusError, theme } from '@pagopa/mui-italia';
import EndingPage from '@pagopa/selfcare-common-frontend/components/EndingPage';
import LoadingOverlay from '@pagopa/selfcare-common-frontend/components/Loading/LoadingOverlay';
import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { storageUserOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { uniqueId } from 'lodash';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { Business } from '../../../types';
import { OnboardingStepActions } from '../../../components/OnboardingStepActions';
import { useHistoryState } from '../../../components/useHistoryState';
import { withLogin } from '../../../components/withLogin';
import { getBusinessLegalAddress, matchBusinessAndUser } from '../../../services/onboardingService';
import { ENV } from '../../../utils/env';

type Props = {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
function StepAddCompany({ setActiveStep }: Props) {
  const { t } = useTranslation();

  const [_selectedBusiness, setSelectedBusiness, setSelectedBusinessHistory] = useHistoryState<
    Business | undefined
  >('selected_business', undefined);

  const [typedInput, setTypedInput] = useState<string>('');
  const [error, setError] = useState<'matchedButNotLR' | 'typedNotFound' | 'genericError'>();
  const [loading, setLoading] = useState<boolean>(false);

  const requestId = uniqueId();
  const loggedUser = storageUserOps.read();

  const productId = 'prod-pn-pg';

  const handleSubmit = (typedInput: string) => {
    trackEvent('ONBOARDING_PG_BY_ENTERING_TAXCODE_INPUT', { requestId, productId });
    setLoading(true);
    getBusinessLegalAddress(typedInput)
      .then((res) => {
        if (res) {
          trackEvent('ONBOARDING_PG_MATCHED_LEGAL_ADDRESS', { requestId, productId });
          setError('matchedButNotLR');
        } else {
          trackEvent('ONBOARDING_PG_NOT_MATCHED_LEGAL_ADDRESS', { requestId, productId });
          setLoading(true);
          matchBusinessAndUser(typedInput, loggedUser)
            .then((matched) => {
              if (matched) {
                trackEvent('ONBOARDING_PG_MATCHED_ADE', { requestId, productId });
                setSelectedBusiness({
                  certified: false,
                  businessName: '',
                  businessTaxId: typedInput,
                });
                setSelectedBusinessHistory({
                  certified: false,
                  businessName: '',
                  businessTaxId: typedInput,
                });
                setActiveStep(3);
              } else {
                trackEvent('ONBOARDING_PG_NOT_MATCHED_ADE', { requestId, productId });
                setError('typedNotFound');
              }
            })
            .catch(() => {
              setError('genericError');
            })
            .finally(() => setLoading(false));
        }
      })
      .catch(() => {
        setError('genericError');
      })
      .finally(() => setLoading(false));
  };

  return error === 'typedNotFound' || error === 'matchedButNotLR' ? (
    <>
      <EndingPage
        icon={<IllusError size={60} />}
        title={
          <Trans i18nKey="cannotRegisterBusiness.title">
            Non puoi registrare <br />
            questa impresa
          </Trans>
        }
        description={
          <Trans i18nKey="cannotRegisterBusiness.message">
            Dal tuo SPID non risulti essere Legale Rappresentante <br />
            dell’impresa associata a questo Codice Fiscale. Puoi <br />
            registrare solo le imprese di cui sei Legale Rappresentante.
          </Trans>
        }
        variantTitle={'h4'}
        variantDescription={'body1'}
        buttonLabel={t('cannotRegisterBusiness.close')}
        onButtonClick={() => setActiveStep(0)}
      />
    </>
  ) : error === 'genericError' ? (
    <EndingPage
      minHeight="52vh"
      icon={<IllusError size={60} />}
      title={t('genericError.title')}
      description={
        <Trans i18nKey="genericError.message">
          A causa di un problema tecnico, non riusciamo a registrare <br /> l’impresa. Riprova più
          tardi.
        </Trans>
      }
      variantTitle={'h4'}
      variantDescription={'body1'}
      buttonLabel={t('genericError.close')}
      onButtonClick={() => window.location.assign(ENV.URL_FE.LOGOUT)}
    />
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
              disabled: typedInput.length !== 11 && typedInput.length !== 16,
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default withLogin(StepAddCompany);

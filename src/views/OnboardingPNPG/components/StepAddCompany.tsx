import { Grid, Typography, Card, TextField } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { storageUserOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { uniqueId } from 'lodash';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import { Business, ErrorType } from '../../../types';
import { OnboardingStepActions } from '../../../components/OnboardingStepActions';
import { useHistoryState } from '../../../components/useHistoryState';
import { withLogin } from '../../../components/withLogin';
import {
  getBusinessLegalAddress,
  getInstitutionOnboardingInfo,
  matchBusinessAndUser,
} from '../../../services/onboardingService';
import ErrorHandler from './ErrorHandler';

type Props = {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  setRetrievedPartyId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
function StepAddCompany({ setActiveStep, setRetrievedPartyId, setLoading }: Props) {
  const { t } = useTranslation();

  const [_selectedBusiness, setSelectedBusiness, setSelectedBusinessHistory] = useHistoryState<
    Business | undefined
  >('selected_business', undefined);

  const [typedInput, setTypedInput] = useState<string>('');
  const [error, setError] = useState<ErrorType>();
  const requestId = uniqueId();
  const addError = useErrorDispatcher();
  const loggedUser = storageUserOps.read();

  const productId = 'prod-pn-pg';

  useEffect(() => {
    trackEvent('ONBOARDING_PG_BY_ENTERING_TAXCODE_INPUT', { requestId, productId });
  }, []);

  const handleSubmit = async (typedInput: string) => {
    trackEvent('ONBOARDING_PG_BY_ENTERING_TAXCODE_CONFIRMED', { requestId, productId });
    setLoading(true);
    await getBusinessLegalAddress(typedInput)
      .then(async (resp) => {
        if (resp) {
          trackEvent('ONBOARDING_PG_MATCHED_LEGAL_ADDRESS', {
            requestId,
            productId,
          });
          setError('matchedButNotLR');
        } else {
          trackEvent('ONBOARDING_PG_NOT_MATCHED_LEGAL_ADDRESS', { requestId, productId });
          await matchBusinessAndUser(typedInput, loggedUser)
            .then((res) => {
              if (res.verificationResult) {
                trackEvent('ONBOARDING_PG_MATCHED_ADE', { requestId, productId });
                getInstitutionOnboardingInfo(typedInput, productId)
                  .then((res) => {
                    if (res.institution?.id) {
                      trackEvent('ONBOARDING_PG_SUBMIT_ALREADY_ONBOARDED', {
                        requestId,
                        productId,
                      });
                      setRetrievedPartyId(res.institution?.id);
                    }
                  })
                  .catch((reason) => {
                    addError({
                      id: 'RETRIEVING_ONBOARDED_PARTY_ERROR',
                      blocking: false,
                      error: reason,
                      techDescription: `An error occurred while retrieving onboarded party of ${typedInput}`,
                      toNotify: true,
                    });
                  })
                  .finally(() => setLoading(false));
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
            });
        }
      })
      .catch((reason) => {
        if (reason.httpStatus === 400) {
          setError('invalidInputFormat');
        } else {
          setError('genericError');
        }
      })
      .finally(() => setLoading(false));
  };

  return error ? (
    <ErrorHandler error={error} setActiveStep={setActiveStep} setError={setError} />
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
            <Trans i18nKey="addCompany.subTitle" components={{ 1: <br /> }}>
              {`Inserisci il Codice Fiscale dell’impresa che vuoi <1 />
              registrare.`}
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
              width: { xs: 'calc(100% - 96px)', sm: '480px' },
              minWidth: '200px',
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
              sx={{
                width: { xs: 'calc(100% - 48px)', sm: '416px' },
              }}
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

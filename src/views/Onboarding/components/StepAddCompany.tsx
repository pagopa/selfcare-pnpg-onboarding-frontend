import { Grid, Typography, Card, TextField } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { storageTokenOps, storageUserOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { uniqueId } from 'lodash';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { Company, Outcome, User } from '../../../types';
import { OnboardingStepActions } from '../../../components/OnboardingStepActions';
import { withLogin } from '../../../components/withLogin';
import {
  checkManager,
  verifyManager,
} from '../../../services/onboardingService';
import { UserContext } from '../../../lib/context';
import { MOCK_USER } from '../../../utils/constants';
import { InstitutionOnboardingResource } from '../../../api/generated/b4f-onboarding/InstitutionOnboardingResource';
import { InstitutionOnboarding } from '../../../api/generated/b4f-onboarding/InstitutionOnboarding';
import { ENV } from '../../../utils/env';
import OutcomeHandler from './OutcomeHandler';

type Props = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  forward: any;
  back: () => void;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
function StepAddCompany({ setLoading, setActiveStep, forward, back }: Props) {
  const { t } = useTranslation();

  const [typedInput, setTypedInput] = useState<string>('');
  const [outcome, setOutcome] = useState<Outcome>();
  const [retrievedCompanyData, setRetrievedCompanyData] = useState<Company>();
  const { user } = useContext(UserContext);
  const requestId = uniqueId();
  const loggedUser = MOCK_USER ? (user as User) : storageUserOps.read();

  const productId = 'prod-pn-pg';
  const fieldError = !!typedInput.match(/[A-Za-z]/);

  useEffect(() => {
    trackEvent('ONBOARDING_PG_BY_ENTERING_TAXCODE_INPUT', { requestId, productId });
  }, []);

  const getActiveOnboarding = async (taxCode: string, productId: string) => {
    const sessionToken = storageTokenOps.read();
    setLoading(true);
    try {
      const response = await fetch(
        `${ENV.URL_API.ONBOARDING}/institutions/onboarding/active?taxCode=${taxCode}&productId=${productId}`,
        {
          headers: {
            accept: '*/*',
            'accept-language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
            authorization: `Bearer ${sessionToken}`,
          },
          method: 'GET',
          mode: 'cors',
        }
      );
  
      // Controlla se la risposta è OK
      if (!response.ok) {
        console.error('API call failed:', response.status, response.statusText);
        throw new Error('API call failed');
      }
  
      // Parsing della risposta
      const businesses = (await response.json()) as Array<InstitutionOnboardingResource>;
  
      if (Array.isArray(businesses) && businesses.length > 0) {
        trackEvent('ONBOARDING_PG_SUBMIT_ALREADY_ONBOARDED', { requestId, productId });
        if (retrievedCompanyData) {
          setRetrievedCompanyData({
            ...retrievedCompanyData,
            institutionId: businesses[0].institutionId,
            onboardings: businesses[0].onboardings as Array<InstitutionOnboarding>,
          });
        }
        await checkManager(loggedUser, typedInput).then(async (res) => {
          if (res.result) {
            setOutcome('alreadyOnboarded');
          } else {
            await verifyCompanyManager(typedInput, loggedUser.taxCode);
          }
        });
      } else {
        console.warn('No businesses found in response');
        await verifyCompanyManager(typedInput, loggedUser.taxCode);
      }
    } catch (error) {
      console.error('Error during getActiveOnboarding:', error);
      await verifyCompanyManager(typedInput, loggedUser.taxCode);
    } finally {
      setLoading(false);
    }
  };

  const verifyCompanyManager = async (
    typedInput: string,
    managerTaxCode: string,
  ) => {
    await verifyManager(typedInput, managerTaxCode)
      .then((res) => {
        if (res) {
          setRetrievedCompanyData({
            companyTaxCode: typedInput,
            companyName: res?.companyName,
            origin: res?.origin,
          });
          setOutcome('firstRegistration');
        } else {
          setOutcome('matchedButNotLR');
          setTypedInput('');
        }
      })
      .catch((reason) => {
        if (reason.httpStatus >= 400 && reason.httpStatus <= 499) {
          if (retrievedCompanyData?.institutionId) {
            setOutcome('requestAdminAccess');
          } else {
            setOutcome('matchedButNotLR');
          }
        } else {
          setOutcome('genericError');
        }
      });
  };

  const getManagerBusinessData = async (taxCode: string, productId: string) => {
    void getActiveOnboarding(taxCode, productId);
  };

  const handleSubmit = async (typedInput: string) => {
    trackEvent('ONBOARDING_PG_BY_ENTERING_TAXCODE_CONFIRMED', { requestId, productId });
    void getManagerBusinessData(typedInput, 'prod-pn-pg');
  };

  return outcome ? (
    <OutcomeHandler
      outcome={outcome}
      setOutcome={setOutcome}
      companyData={retrievedCompanyData}
      setActiveStep={setActiveStep}
      setLoading={setLoading}
      forward={forward}
    />
  ) : (
    <Grid container direction="column" my={16}>
      <Grid container item justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h3" component="h2" align="center" color={theme.palette.text.primary}>
            {t('onboarding.insertFiscalCode.title')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography align="center" color={theme.palette.text.primary} m={1} mb={3}>
            <Trans i18nKey="onboarding.insertFiscalCode.subTitle" components={{ 1: <br /> }}>
              {`Il Codice Fiscale dell’impresa ci serve per verificare se è già <1 />presente un profilo su SEND - Servizio Notifiche Digitali`}
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
              label={t('onboarding.insertFiscalCode.label')}
              variant="outlined"
              error={fieldError}
              helperText={
                fieldError ? t('onboarding.insertFiscalCode.inputError.invalidFormat') : ''
              }
              onChange={(e) => setTypedInput(e.target.value)}
              sx={{
                width: { xs: 'calc(100% - 48px)', sm: '416px' },
              }}
              inputProps={{ maxLength: 11 }}
            />
          </Card>
        </Grid>
        <Grid container my={4}>
          <OnboardingStepActions
            back={{
              action: () => back,
              label: t('onboarding.insertFiscalCode.action.back'),
              disabled: false,
            }}
            forward={{
              action: () => handleSubmit(typedInput),
              label: t('onboarding.insertFiscalCode.action.forward'),
              disabled: typedInput.length !== 11 || fieldError,
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default withLogin(StepAddCompany);

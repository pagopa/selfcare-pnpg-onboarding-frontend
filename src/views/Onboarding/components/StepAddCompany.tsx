import { Grid, Typography, Card, TextField } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  storageTokenOps,
  storageUserOps,
} from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { uniqueId } from 'lodash';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/lib/hooks/useErrorDispatcher';
import { Company, Outcome, User } from '../../../types';
import { OnboardingStepActions } from '../../../components/OnboardingStepActions';
import { withLogin } from '../../../components/withLogin';
import {
  checkManager,
  getInstitutionOnboardingInfo,
  onboardingUsersSubmit,
  searchUser,
  verifyManager,
} from '../../../services/onboardingService';
import { UserContext } from '../../../lib/context';
import { MOCK_USER } from '../../../utils/constants';
import { InstitutionOnboardingResource } from '../../../api/generated/b4f-onboarding/InstitutionOnboardingResource';
import { InstitutionOnboarding } from '../../../api/generated/b4f-onboarding/InstitutionOnboarding';
import { VerifyManagerResponse } from '../../../api/generated/b4f-onboarding/VerifyManagerResponse';
import { ENV } from '../../../utils/env';
import { UserId } from '../../../api/generated/b4f-onboarding/UserId';
import OutcomeHandler from './OutcomeHandler';
// import { UserId } from '../../../api/generated/b4f-onboarding/UserId';

type Props = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  forward: any;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
function StepAddCompany({ setLoading, setActiveStep, forward }: Props) {
  const { t } = useTranslation();

  const [typedInput, setTypedInput] = useState<string>('');
  const [outcome, setOutcome] = useState<Outcome>();
  const [retrievedCompanyData, setRetrievedCompanyData] = useState<Company>({
    companyTaxCode: '',
    institutionId: undefined,
    onboardings: [],
    companyName: '',
    businessName: '',
    companyEmail: '',
    origin: '',
  });
  // const [userId, setUserId] = useState<string>();
  const { user } = useContext(UserContext);
  const requestId = uniqueId();
  const loggedUser = MOCK_USER ? (user as User) : storageUserOps.read();
  const productId = 'prod-pn-pg';
  const fieldError = !!typedInput.match(/[A-Za-z]/);
  const sessionToken = storageTokenOps.read();
  const addError = useErrorDispatcher();

  useEffect(() => {
    trackEvent('ONBOARDING_PG_BY_ENTERING_TAXCODE_INPUT', { requestId, productId });
  }, []);

  const getActiveOnboarding = async (taxCode: string, productId: string) => {
    setLoading(true);
    try {
      const response = (await getInstitutionOnboardingInfo(
        taxCode,
        productId,
        sessionToken
      )) as Response;

      if (!response.ok) {
        console.error('API call failed:', response.status, response.statusText);
        throw new Error('API call failed');
      }
      const businesses = (await response.json()) as Array<InstitutionOnboardingResource | any>;

      if (Array.isArray(businesses) && businesses.length > 0) {
        trackEvent('ONBOARDING_PG_SUBMIT_ALREADY_ONBOARDED', { requestId, productId });
        setRetrievedCompanyData((prevData) => ({
          ...prevData,
          institutionId: businesses[0].institutionId,
          businessName: businesses[0].businessName as string,
          onboardings: businesses[0].onboardings as Array<InstitutionOnboarding>,
        }));

        void searchUser({ taxCode: loggedUser.taxCode })
          .then((res: UserId) => {
            console.log('res', res);
            void checkManager(res, typedInput).then(async (res) => {
              if (res.result) {
                setOutcome('alreadyOnboarded');
              } else {
                await verifyCompanyManager(typedInput, loggedUser.taxCode, businesses);
              }
            });
          })
          .catch((err: Error) => console.error(err));
      } else {
        console.warn('No businesses found in response');
        await verifyCompanyManager(typedInput, loggedUser.taxCode);
      }
    } catch (error: any) {
      addError({
        id: 'ONBOARDING_PNPG_GET_ACTIVE_ONBOARDING_ERROR',
        blocking: false,
        error,
        techDescription: `An error occurred while getting active onboarding: ${error.message}`,
        toNotify: true,
      });
      await verifyCompanyManager(typedInput, loggedUser.taxCode);
    } finally {
      setLoading(false);
    }
  };

  const verifyCompanyManager = async (
    typedInput: string,
    managerTaxCode: string,
    businesses?: Array<InstitutionOnboardingResource>
  ) => {
    try {
      const response = (await verifyManager(typedInput, managerTaxCode, sessionToken)) as Response;

      if (!response.ok) {
        // eslint-disable-next-line no-throw-literal
        throw {
          message: 'API call failed',
          status: response.status,
          statusText: response.statusText,
        };
      }

      const verifyManagerResponse = (await response.json()) as VerifyManagerResponse;

      if (response) {
        setRetrievedCompanyData((prevData) => ({
          ...prevData,
          companyTaxCode: typedInput,
          companyName: verifyManagerResponse?.companyName,
          origin: verifyManagerResponse?.origin,
        }));

        if (businesses && businesses[0].institutionId) {
          // business already registered but the loggedUser isn't manager
          setOutcome('notManagerButLR');
        } else {
          // business not registered
          setOutcome('firstRegistration');
        }
      } else {
        setOutcome('matchedButNotLR');
        setTypedInput('');
      }
    } catch (reason: any) {
      if (reason.status >= 400 && reason.status <= 499) {
        if (businesses && businesses[0].institutionId) {
          setOutcome('requestAdminAccess');
        } else {
          setOutcome('matchedButNotLR');
          setTypedInput('');
        }
      }

      addError({
        id: 'ONBOARDING_PNPG_VERIFING_MANAGER_ERROR',
        blocking: false,
        error: reason,
        techDescription: `An error occurred while verifying manager: ${reason.message}`,
        toNotify: true,
      });
    }
  };

  const getManagerBusinessData = async (taxCode: string, productId: string) => {
    void getActiveOnboarding(taxCode, productId);
  };

  const handleOnboardingUsersSubmit = async () => {
    if (!retrievedCompanyData) {
      return;
    }

    setLoading(true);

    try {
      switch (outcome) {
        case 'alreadyOnboarded':
          window.location.assign(
            ENV.URL_FE.DASHBOARD + '/' + `${retrievedCompanyData.institutionId}`
          );
          break;

        case 'notManagerButLR':
          if (retrievedCompanyData.companyTaxCode) {
            setLoading(true);
            const certified = retrievedCompanyData.origin === 'INFOCAMERE';
            await onboardingUsersSubmit(retrievedCompanyData.companyTaxCode, certified, loggedUser)
              .then(() =>
                window.location.assign(
                  ENV.URL_FE.DASHBOARD + '/' + `${retrievedCompanyData.institutionId}`
                )
              )
              .catch((reason) => {
                addError({
                  id: 'ONBOARDING_USER_ERROR',
                  blocking: true,
                  error: reason as Error,
                  techDescription: `An error occurred while onboarding user for business ${retrievedCompanyData.companyTaxCode}`,
                  toNotify: true,
                });
              })
              .finally(() => setLoading(false));
          }
          break;

        default:
          addError({
            id: 'ONBOARDING_PNPG_UNKNOWN_OUTCOME',
            blocking: false,
            error: new Error(`Unexpected outcome: ${outcome}`),
            techDescription: 'Unexpected outcome encountered during onboarding process',
            toNotify: true,
          });
          break;
      }
    } catch (error: any) {
      addError({
        id: 'ONBOARDING_PNPG_ACCESS_ERROR',
        blocking: false,
        error,
        techDescription: `Error during access process: ${error.message}`,
        toNotify: true,
      });
    } finally {
      setLoading(false);
    }
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
      handleOnboardingUsersSubmit={handleOnboardingUsersSubmit}
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
              action: () => window.location.assign(ENV.URL_FE.DASHBOARD),
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

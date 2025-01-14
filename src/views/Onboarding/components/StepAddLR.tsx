import { Grid, Card, TextField } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend/lib';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { emailRegexp } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { uniqueId } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OnboardingStepActions } from '../../../components/OnboardingStepActions';
import { Outcome, StepperStepComponentProps } from '../../../types';
import { RoleEnum, UserDto } from '../../../api/generated/b4f-onboarding/UserDto';
import { onboardingUsersSubmit } from '../../../services/onboardingService';
import { CompanyUserDto } from '../../../api/generated/b4f-onboarding/CompanyUserDto';
import OutcomeHandler from './OutcomeHandler';

type Props = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  forward: () => void;
  back: () => void;
} & StepperStepComponentProps;

// eslint-disable-next-line sonarjs/cognitive-complexity
const StepAddLR = ({ setLoading, setActiveStep, forward, back }: Props) => {
  const { t } = useTranslation();
  const requestId = uniqueId();
  const userInitialData: CompanyUserDto = {
    name: '',
    role: 'MANAGER' as RoleEnum,
    surname: '',
    taxCode: '',
    email: undefined,
  };
  const [userData, setUserData] = useState<CompanyUserDto>(userInitialData);
  const [outcome, setOutcome] = useState<Outcome>();
  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    taxCode: '',
    email: '',
  });
  const fiscalAndVatCodeRegexp = new RegExp(
    /^(?:[A-Za-z]{6}[0-9lmnpqrstuvLMNPQRSTUV]{2}[abcdehlmprstABCDEHLMPRST][0-9lmnpqrstuvLMNPQRSTUV]{2}[A-Za-z][0-9lmnpqrstuvLMNPQRSTUV]{3}[A-Za-z]|[0-9]{11})$/
  );

  const validateField = (field: keyof UserDto, value: string | undefined): string => {
    console.log(`Validating field: ${field}, value: ${value}`);
    if (!value || value === '') {
      return t('onboarding.insertLegalRepresentativeData.errors.requiredField');
    }
    if (field === 'taxCode' && !fiscalAndVatCodeRegexp.test(value)) {
      return t('onboarding.insertLegalRepresentativeData.errors.invalidFiscalCode');
    }
    if (field === 'email' && !emailRegexp.test(value ?? '')) {
      return t('onboarding.insertLegalRepresentativeData.errors.invalidEmail');
    }
    return '';
  };

  const handleInputChange = (field: keyof UserDto) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserData({ ...userData, [field]: value });
    setErrors({ ...errors, [field]: validateField(field, value) });
  };

  const isButtonEnabled =
    Object.values(errors).every((error) => error === '') &&
    Object.values(userData).every((value) => value && value !== '');

  const onForwardAction = async () => {
    if (!isButtonEnabled) {
      return;
    }
    // Validazione prima di inoltrare i dati
    const newErrors = {
      name: validateField('name', userData.name),
      surname: validateField('surname', userData.surname),
      taxCode: validateField('taxCode', userData.taxCode),
      email: validateField('email', userData.email),
    };

    setErrors(newErrors);

    // Se non ci sono errori allora inoltra i dati
    if (newErrors.name || newErrors.surname || newErrors.taxCode || newErrors.email) {
      return;
    }

    // Tracciamento evento e inoltro
    trackEvent('ONBOARDING_LR_DATA_REQUEST', {
      requestId,
      productId: 'prod-pn-pg',
    });

    await onboardingUsersSubmit(userData.taxCode, true, userData)
      .then(() => {
        setOutcome('successfulRuequestRegistration');
      })
      .catch((error: Error) => {
        console.error('Error:', error);
        setOutcome('genericError');
      });
  };

  return outcome ? (
    <OutcomeHandler
      outcome={outcome}
      setOutcome={setOutcome}
      companyData={undefined}
      setActiveStep={setActiveStep}
      setLoading={setLoading}
      forward={forward}
    />
  ) : (
    <Grid container>
      <Grid item textAlign="center" display="contents">
        <TitleBox
          title={t('onboarding.insertLegalRepresentativeData.title')}
          subTitle={t('onboarding.insertLegalRepresentativeData.subTitle')}
          variantTitle="h4"
          variantSubTitle="body2"
          mtTitle={4}
          mbSubTitle={4}
        />
      </Grid>
      <Grid container display="flex" flexDirection="column" alignContent="center">
        <Card
          variant="outlined"
          sx={{
            display: 'grid',
            alignItems: 'center',
            justifyItems: 'center',
            width: { xs: 'calc(100% - 96px)', sm: '480px' },
            minWidth: '200px',
            borderRadius: theme.spacing(2),
            boxShadow:
              '0px 8px 10px -5px rgba(0, 43, 85, 0.1), 0px 16px 24px 2px rgba(0, 43, 85, 0.05), 0px 6px 30px 5px rgba(0, 43, 85, 0.1)',
            padding: 4,
          }}
        >
          <Grid container item flexDirection="row" alignItems="center">
            <Grid display={'flex'} flexDirection="row" alignItems="center" sx={{ width: '100%' }}>
              <TextField
                id="name-textfield"
                name="name"
                label={t('onboarding.insertLegalRepresentativeData.name')}
                variant="outlined"
                onChange={handleInputChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                sx={{
                  marginBottom: 2,
                  paddingRight: 1,
                }}
              />
              <TextField
                id="surname-textfield"
                name="surname"
                label={t('onboarding.insertLegalRepresentativeData.surname')}
                variant="outlined"
                onChange={handleInputChange('surname')}
                error={!!errors.surname}
                helperText={errors.surname}
                sx={{
                  marginBottom: 2,
                  paddingLeft: 1,
                }}
              />
            </Grid>
          </Grid>

          <TextField
            id="taxCode-textfield"
            name="taxCode"
            label={t('onboarding.insertLegalRepresentativeData.fiscalCode')}
            variant="outlined"
            onChange={handleInputChange('taxCode')}
            error={!!errors.taxCode}
            helperText={errors.taxCode}
            sx={{
              width: { xs: 'calc(100% - 8px)', sm: '416px' },
              marginBottom: 2,
            }}
          />

          <TextField
            id="email-textfield"
            name="email"
            label={t('onboarding.insertLegalRepresentativeData.emailAddress')}
            variant="outlined"
            onChange={handleInputChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              '.MuiInputBase-adornedEnd': {
                paddingRight: '1px',
              },
              width: { xs: 'calc(100% - 8px)', sm: '416px' },
            }}
          />
        </Card>
      </Grid>
      <Grid container my={4}>
        <OnboardingStepActions
          back={{
            label: t('onboarding.insertLegalRepresentativeData.action.backAction'),
            action: back,
          }}
          forward={{
            disabled: !isButtonEnabled,
            label: t('onboarding.insertLegalRepresentativeData.action.forwardAction'),
            action: onForwardAction,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default StepAddLR;

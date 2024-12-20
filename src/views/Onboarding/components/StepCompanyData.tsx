import { Card, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend/lib';
import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { uniqueId } from 'lodash';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { emailRegexp } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { OnboardingStepActions } from '../../../components/OnboardingStepActions';
import { withLogin } from '../../../components/withLogin';
import { Company, StepperStepComponentProps } from '../../../types';

type Props = {
  forward: any;
  back: () => void;
  companyData?: Company;
} & StepperStepComponentProps;

function StepBusinessData({ companyData, forward, back }: Props) {
  const { t } = useTranslation();
  const requestId = uniqueId();

  const [completeCompanyData, setCompleteCompanyData] = useState<Company>();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    trackEvent('ONBOARDING_PG_DATA_INPUT', {
      requestId,
      productId: 'prod-pn-pg',
    });
    setCompleteCompanyData(companyData);
  }, []);

  useEffect(() => {
    setIsDisabled(!completeCompanyData?.companyEmail || !completeCompanyData?.companyName);
  }, [completeCompanyData?.companyEmail, completeCompanyData?.companyName]);

  const onForwardAction = () => {
    trackEvent('ONBOARDING_PG_DATA_CONFIRMED', {
      requestId,
      productId: 'prod-pn-pg',
    });
    forward(completeCompanyData);
  };

  const notValidBusinessEmail =
    !!completeCompanyData?.companyEmail && !emailRegexp.test(completeCompanyData?.companyEmail);
  const notValidBusinessName =
    !!completeCompanyData?.companyName && completeCompanyData?.companyName.trim().length === 0;

  return (
    <Grid container>
      <Grid item textAlign="center" display="contents">
        <TitleBox
          title={t('onboarding.insertBusinessData.title')}
          subTitle={
            <Trans i18nKey="onboarding.insertBusinessData.subTitle" components={{ 1: <br /> }}>
              {
                'Inserisci i dati richiesti per completare la registrazione dell’impresa su <1 />SEND - Servizio Notifiche Digitali'
              }
            </Trans>
          }
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
          <Grid container display="inline" mb={3}>
            <Grid item>
              <Typography sx={{ fontSize: '14px' }}>Codice Fiscale</Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ fontSize: '18px', fontWeight: 'fontWeightMedium' }}>
                {completeCompanyData?.companyTaxCode}
              </Typography>
            </Grid>
          </Grid>
          {completeCompanyData?.origin === 'ADE' ? (
            <TextField
              id="businessname-textfield"
              label={t('onboarding.insertBusinessData.businessNameLabel')}
              variant="outlined"
              onChange={(e) => {
                setCompleteCompanyData({
                  ...completeCompanyData,
                  companyName: e.target.value,
                });
              }}
              error={notValidBusinessName}
              helperText={
                notValidBusinessName
                  ? t('onboarding.insertBusinessData.invalidBusinessName')
                  : undefined
              }
              sx={{
                width: { xs: 'calc(100% - 8px)', sm: '416px' },
                marginBottom: 4,
              }}
            />
          ) : (
            <Grid container display="inline" mb={4}>
              <Grid item>
                <Typography sx={{ fontSize: '14px' }}>Ragione sociale</Typography>
              </Grid>
              <Grid item>
                <Typography sx={{ fontSize: '18px', fontWeight: 'fontWeightMedium' }}>
                  {completeCompanyData?.companyName}
                </Typography>
              </Grid>
            </Grid>
          )}
          <TextField
            id="email-textfield"
            label={t('onboarding.insertBusinessData.pecEmailLabel')}
            variant="outlined"
            onChange={(e) => {
              setCompleteCompanyData({
                ...completeCompanyData,
                companyTaxCode: completeCompanyData?.companyTaxCode as string,
                companyEmail: e.target.value,
              });
            }}
            error={notValidBusinessEmail}
            helperText={
              notValidBusinessEmail ? t('onboarding.insertBusinessData.invalidEmail') : undefined
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <InfoOutlinedIcon sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '.MuiInputBase-adornedEnd': {
                paddingRight: '1px',
              },
              width: { xs: 'calc(100% - 8px)', sm: '416px' },
            }}
          />
          <Grid item mt={3}>
            <Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary }}>
              La verifica dei dati precompilati è stata effettuata tramite il Registro Imprese di
              {completeCompanyData?.origin === 'INFOCAMERE'
                ? ' InfoCamere'
                : ' Agenzia delle Entrate'}
            </Typography>
          </Grid>
        </Card>
      </Grid>
      <Grid container my={4}>
        <OnboardingStepActions
          back={{
            label: t('onboarding.insertBusinessData.backAction'),
            action: back,
          }}
          forward={{
            disabled: isDisabled || notValidBusinessEmail || notValidBusinessName,
            label: t('onboarding.insertBusinessData.forwardAction'),
            action: onForwardAction,
          }}
        />
      </Grid>
    </Grid>
  );
}

export default withLogin(StepBusinessData);

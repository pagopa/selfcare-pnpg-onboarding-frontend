import { Card, Grid, TextField } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { uniqueId } from 'lodash';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { OnboardingStepActions } from '../../../components/OnboardingStepActions';
import { useHistoryState } from '../../../components/useHistoryState';
import { withLogin } from '../../../components/withLogin';
import { Business, StepperStepComponentProps } from '../../../types';

const emailRegexp = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');

type Props = {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
} & StepperStepComponentProps;

function StepBusinessData({ setActiveStep }: Props) {
  const { t } = useTranslation();

  const [selectedBusiness, setSelectedBusiness, setSelectedBusinessHistory] = useHistoryState<
    Business | undefined
  >('selected_business', undefined);
  const [insertedBusinessEmail, setInsertedBusinessEmail, setInsertedBusinessEmailHistory] =
    useHistoryState<string>('inserted_business_email', undefined);

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    const isUncertifiedEmptyFields =
      !selectedBusiness?.certified &&
      insertedBusinessEmail?.length > 0 &&
      selectedBusiness &&
      selectedBusiness.businessName.length > 0;
    const isCertifiedEmptyField = selectedBusiness?.certified && insertedBusinessEmail?.length > 0;
    setIsDisabled(!(isCertifiedEmptyField || isUncertifiedEmptyFields));
  }, [insertedBusinessEmail, selectedBusiness]);

  const onForwardAction = () => {
    const requestId = uniqueId();
    trackEvent('ONBOARDING_BUSINESS_DATA', { requestId, productId: 'prod-pn-pg' });
    setSelectedBusinessHistory(selectedBusiness);
    setInsertedBusinessEmailHistory(insertedBusinessEmail);
    setActiveStep(4);
  };

  const isCertifiedBusinessName = selectedBusiness?.certified;

  const notValidBusinessEmail = !!insertedBusinessEmail && !emailRegexp.test(insertedBusinessEmail);
  const notValidBusinessName =
    !!selectedBusiness?.businessName && selectedBusiness?.businessName.trim().length === 0;

  return (
    <Grid container>
      <Grid item textAlign="center" display="contents">
        <TitleBox
          title={
            isCertifiedBusinessName ? t('insertBusinessEmail.title') : t('insertBusinessData.title')
          }
          subTitle={
            isCertifiedBusinessName
              ? t('insertBusinessEmail.subTitle')
              : ((
                  <Trans i18nKey="insertBusinessData.subTitle">
                    Inserisci la ragione sociale e l’indirizzo PEC dell’impresa che vuoi <br />
                    registrare.
                  </Trans>
                ) as unknown as string)
          }
          variantTitle="h4"
          variantSubTitle="body2"
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
            width: '480px',
            borderRadius: theme.spacing(2),
            boxShadow:
              '0px 8px 10px -5px rgba(0, 43, 85, 0.1), 0px 16px 24px 2px rgba(0, 43, 85, 0.05), 0px 6px 30px 5px rgba(0, 43, 85, 0.1)',
            padding: 4,
          }}
        >
          {!selectedBusiness?.certified && (
            <TextField
              id="businessname-textfield"
              label={t('insertBusinessData.businessNameLabel')}
              variant="outlined"
              onChange={(e) => {
                setSelectedBusiness({
                  certified: selectedBusiness?.certified ?? true,
                  businessTaxId: selectedBusiness?.businessTaxId ?? '',
                  businessName: e.target.value,
                });
              }}
              error={notValidBusinessName}
              helperText={
                notValidBusinessName ? t('insertBusinessData.invalidBusinessName') : undefined
              }
              sx={{ width: '416px', marginBottom: 4 }}
            />
          )}
          <TextField
            id="email-textfield"
            label={t('insertBusinessData.pecEmailLabel')}
            variant="outlined"
            onChange={(e) => {
              setInsertedBusinessEmail(e.target.value);
            }}
            error={notValidBusinessEmail}
            helperText={notValidBusinessEmail ? t('insertBusinessData.invalidEmail') : undefined}
            sx={{ width: '416px' }}
          />
        </Card>
      </Grid>
      <Grid container my={4}>
        <OnboardingStepActions
          back={{
            label: t('insertBusinessData.backAction'),
            action: () => {
              setActiveStep(selectedBusiness?.certified ? 1 : 2);
            },
          }}
          forward={{
            disabled: isDisabled || notValidBusinessName || notValidBusinessEmail,
            label: t('insertBusinessData.forwardAction'),
            action: onForwardAction,
          }}
        />
      </Grid>
    </Grid>
  );
}

export default withLogin(StepBusinessData);

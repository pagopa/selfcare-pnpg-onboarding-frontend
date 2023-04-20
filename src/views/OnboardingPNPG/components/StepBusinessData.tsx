import { Card, Grid, TextField } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { OnboardingStepActions } from '../../../components/OnboardingStepActions';
import { useHistoryState } from '../../../components/useHistoryState';
import { withLogin } from '../../../components/withLogin';
import { BusinessPnpg, StepperStepComponentProps } from '../../../types';

type Props = {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
} & StepperStepComponentProps;

function StepBusinessData({ setActiveStep }: Props) {
  const { t } = useTranslation();

  const [selectedInstitution, setSelectedInstitution, setSelectedInstitutionHistory] =
    useHistoryState<BusinessPnpg | undefined>('selected_institution', undefined);
  const [insertedBusinessEmail, setInsertedBusinessEmail, setInsertedBusinessEmailHistory] =
    useHistoryState<string>('inserted_business_email', undefined);

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    const isUncertifiedEmptyFields =
      !selectedInstitution?.certified &&
      insertedBusinessEmail?.length > 0 &&
      selectedInstitution &&
      selectedInstitution.businessName.length > 0;
    const isCertifiedEmptyField =
      selectedInstitution?.certified && insertedBusinessEmail?.length > 0;
    setIsDisabled(!(isCertifiedEmptyField || isUncertifiedEmptyFields));
  }, [insertedBusinessEmail, selectedInstitution]);

  const onForwardAction = () => {
    setSelectedInstitutionHistory(selectedInstitution);
    setInsertedBusinessEmailHistory(insertedBusinessEmail);
    setActiveStep(4);
  };

  return (
    <Grid container>
      <Grid item textAlign="center" display="contents">
        <TitleBox
          title={t('insertBusinessData.title')}
          subTitle={
            (
              <Trans i18nKey="insertBusinessData. description">
                Inserisci l’indirizzo e-mail a cui vuoi ricevere la conferma della <br />
                registrazione dell’impresa su SEND.
              </Trans>
            ) as unknown as string
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
          {!selectedInstitution?.certified && (
            <TextField
              id="businessname-textfield"
              label={t('insertBusinessData.businessNameLabel')}
              variant="outlined"
              type="tel"
              onChange={(e) => {
                setSelectedInstitution({
                  certified: selectedInstitution?.certified ?? true,
                  businessTaxId: selectedInstitution?.businessTaxId ?? '',
                  businessName: e.target.value,
                });
              }}
              sx={{ width: '416px', marginBottom: 4 }}
            />
          )}
          <TextField
            id="email-textfield"
            label={t('insertBusinessData.emailLabel')}
            variant="outlined"
            type="tel"
            onChange={(e) => {
              setInsertedBusinessEmail(e.target.value);
            }}
            sx={{ width: '416px' }}
          />
        </Card>
      </Grid>
      <Grid container my={4}>
        <OnboardingStepActions
          back={{
            label: t('insertBusinessData.backAction'),
            action: () => {
              setActiveStep(selectedInstitution?.certified ? 1 : 2);
            },
          }}
          forward={{
            disabled: isDisabled,
            label: t('insertBusinessData.forwardAction'),
            action: onForwardAction,
          }}
        />
      </Grid>
    </Grid>
  );
}

export default withLogin(StepBusinessData);

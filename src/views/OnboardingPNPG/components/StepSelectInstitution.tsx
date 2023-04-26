import { Button, Grid, Typography, Box, Link } from '@mui/material';
import { PartyAccountItem, theme } from '@pagopa/mui-italia';
import { useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { BusinessPnpg, InstitutionsPnpg, StepperStepComponentProps } from '../../../types';
import { withLogin } from '../../../components/withLogin';
import { OnboardingStepActions } from '../../../components/OnboardingStepActions';
import { useHistoryState } from '../../../components/useHistoryState';

type Props = {
  retrievedInstitutions?: InstitutionsPnpg;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
} & StepperStepComponentProps;

function StepSelectInstitution({ forward, retrievedInstitutions, setActiveStep }: Props) {
  const { t } = useTranslation();

  const [selectedInstitution, setSelectedInstitution, setSelectedInstitutionHistory] =
    useHistoryState<BusinessPnpg | undefined>('selected_institution', undefined);

  useEffect(() => {
    if (retrievedInstitutions?.businesses.length === 1) {
      setSelectedInstitution({
        certified: true,
        businessName: retrievedInstitutions.businesses[0].businessName,
        businessTaxId: retrievedInstitutions.businesses[0].businessTaxId,
      });
      setSelectedInstitutionHistory({
        ...selectedInstitution,
        certified: true,
        businessName: retrievedInstitutions.businesses[0].businessName,
        businessTaxId: retrievedInstitutions.businesses[0].businessTaxId,
      });
    } else {
      setSelectedInstitutionHistory(undefined);
      setSelectedInstitution(undefined);
    }
  }, [retrievedInstitutions]);

  const onForwardAction = () => {
    setSelectedInstitutionHistory({
      certified: true,
      businessName: selectedInstitution?.businessName ?? '',
      businessTaxId: selectedInstitution?.businessTaxId ?? '',
    });
    setActiveStep(3);
  };

  const moreThanTwoInstitutions =
    retrievedInstitutions && retrievedInstitutions.businesses.length >= 2;

  return (
    <Grid container direction="column" my={16}>
      <Grid container item justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h3" component="h2" align="center" color={theme.palette.text.primary}>
            {moreThanTwoInstitutions
              ? t('chooseBusiness.selectFromBusinessList.title')
              : t('chooseBusiness.selectReleatedBusiness.title')}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item justifyContent="center" mt={1}>
        <Grid item xs={12}>
          <Typography
            align="center"
            color={theme.palette.text.primary}
            sx={{ fontSize: 'fontSize' }}
          >
            {moreThanTwoInstitutions ? (
              <Trans i18nKey={'chooseBusiness.selectFromBusinessList.subTitle'}>
                Queste sono le imprese di cui risulti essere Legale Rappresentante. <br />
                Seleziona quella che vuoi registrare.
              </Trans>
            ) : (
              t('chooseBusiness.selectReleatedBusiness.subTitle')
            )}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        direction={'column'}
        alignContent={'center'}
        alignItems={'center'}
        marginY={4}
        marginTop={4}
      >
        {retrievedInstitutions &&
          retrievedInstitutions.businesses.map((b, index) => (
            <Box key={index}>
              <Button
                aria-label={b.businessName}
                sx={{
                  marginBottom: 2,
                  width: '480px',
                  height: '120px',
                  justifyItems: '-moz-initial',
                  flexDirection: 'row',
                  backgroundColor: 'background.paper',
                  borderRadius: theme.spacing(2),
                  border:
                    b.businessTaxId === selectedInstitution?.businessTaxId
                      ? 'solid 3px #0073E6'
                      : undefined,
                  boxShadow:
                    '0px 8px 10px -5px rgba(0, 43, 85, 0.1), 0px 16px 24px 2px rgba(0, 43, 85, 0.05), 0px 6px 30px 5px rgba(0, 43, 85, 0.1)',
                }}
                onClick={() => {
                  setSelectedInstitution({
                    certified: true,
                    businessName: b.businessName,
                    businessTaxId: b.businessTaxId,
                  });
                }}
              >
                <PartyAccountItem
                  aria-label={b.businessName}
                  partyName={b.businessName}
                  partyRole={b.businessTaxId}
                  maxCharactersNumberMultiLine={20}
                  containerSx={{ marginInlineEnd: 'auto', marginLeft: 1 }}
                  infoContainerSx={{ textAlign: 'initial' }}
                />
              </Button>
            </Box>
          ))}

        <Grid container mt={6}>
          <OnboardingStepActions
            forward={{
              action: () => {
                onForwardAction();
              },
              label: t('chooseBusiness.registerBusiness'),
              disabled: !selectedInstitution,
            }}
          />
        </Grid>
        <Grid item xs={6} mt={6}>
          <Box
            sx={{
              fontSize: '18px',
              lineHeight: '24px',
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                textAlign: 'center',
              }}
              variant="caption"
              color={theme.palette.text.primary}
            >
              <Trans i18nKey="chooseBusiness.registerBusinessByTaxCodeLink">
                {'Sei un Legale Rappresentante e non trovi la tua impresa? '}
                <Link
                  onClick={forward}
                  sx={{
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    color: theme.palette.primary.main,
                  }}
                >
                  {'Cercala tramite Codice Fiscale'}
                </Link>
              </Trans>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default withLogin(StepSelectInstitution);

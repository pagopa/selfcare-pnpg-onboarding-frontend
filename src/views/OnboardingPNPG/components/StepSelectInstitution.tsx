import { Button, Grid, Typography, Box, Link } from '@mui/material';
import { PartyAccountItem, theme } from '@pagopa/mui-italia';
import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { BusinessPnpg, InstitutionsPnPG, StepperStepComponentProps } from '../../../../types';
import { withLogin } from '../../../components/withLogin';
import { OnboardingStepActions } from '../../../components/OnboardingStepActions';

type Props = {
  retrievedInstitutions?: InstitutionsPnPG;
  setSelectedInstitution: React.Dispatch<React.SetStateAction<BusinessPnpg | undefined>>;
} & StepperStepComponentProps;

function StepSelectInstitution({ forward, retrievedInstitutions, setSelectedInstitution }: Props) {
  const { t } = useTranslation();

  const [selected, setSelected] = useState<BusinessPnpg>(); // TODO FixMe

  useEffect(() => {
    if (retrievedInstitutions?.businesses.length === 1) {
      setSelectedInstitution(retrievedInstitutions.businesses[0]);
    }
  }, [retrievedInstitutions]);

  const onForwardAction = () => {
    forward();
  };

  const moreThanTwoInstitutions =
    retrievedInstitutions && retrievedInstitutions.businesses.length >= 2;

  return (
    <Grid container direction="column" my={16}>
      <Grid container item justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h3" component="h2" align="center" color={theme.palette.text.primary}>
            {moreThanTwoInstitutions
              ? t('selectFromAgencyList.title')
              : t('selectInstitutionReleated.title')}
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
              <Trans i18nKey={'selectFromAgencyList.description'}>
                Queste sono le aziende di cui risulti essere Legale Rappresentante. <br />
                Seleziona la società di cui vuoi visualizzare le notifiche su Piattaforma Notifiche.
              </Trans>
            ) : (
              t('selectInstitutionReleated.description')
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
          retrievedInstitutions.businesses.map((a, index) => (
            <Box key={index}>
              <Button
                aria-label={a.businessName}
                sx={{
                  marginBottom: 2,
                  width: '480px',
                  height: '120px',
                  justifyItems: '-moz-initial',
                  flexDirection: 'row',
                  backgroundColor: 'background.paper',
                  borderRadius: theme.spacing(2),
                  border:
                    a.businessTaxId === selected?.businessTaxId ? 'solid 3px #0073E6' : undefined,
                  boxShadow:
                    '0px 8px 10px -5px rgba(0, 43, 85, 0.1), 0px 16px 24px 2px rgba(0, 43, 85, 0.05), 0px 6px 30px 5px rgba(0, 43, 85, 0.1)',
                }}
                onClick={() => {
                  setSelectedInstitution(a);
                  setSelected(a);
                }}
              >
                <PartyAccountItem
                  aria-label={a.businessName}
                  partyName={a.businessName}
                  partyRole={a.businessTaxId}
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
              action: onForwardAction,
              label: moreThanTwoInstitutions
                ? t('selectFromAgencyList.registerAgency')
                : t('selectInstitutionReleated.enter'),
              disabled: !selected, // Todo FixMe
            }}
          />
        </Grid>
        {!moreThanTwoInstitutions && (
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
                <Trans i18nKey="selectInstitutionReleated.changeInstitutionSelectedLink">
                  {'Sei il Legale Rappresentante di un’azienda? '}
                  <Link
                    sx={{ textDecoration: 'underline', color: theme.palette.primary.main }}
                    // onClick={() => } // TODO add the correct redirect
                  >
                    {'Registra nuova azienda'}
                  </Link>
                </Trans>
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
export default withLogin(StepSelectInstitution);

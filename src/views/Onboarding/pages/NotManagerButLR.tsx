import { Trans } from 'react-i18next';
import { storageUserOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { Grid, Typography, Box, Button, Card } from '@mui/material';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { theme } from '@pagopa/mui-italia';
import { Company } from '../../../types';

type Props = {
  handleOnboardingUsersSubmit: () => Promise<void>;
  companyData?: Company;
};

function NotManagerButLR({ handleOnboardingUsersSubmit, companyData }: Props) {
  const loggedUser = storageUserOps.read();

  const createdAt = companyData?.onboardings
    ? (companyData?.onboardings[0].createdAt as unknown as string)
    : undefined;

  const date = createdAt?.split('T')[0] ?? '';
  const formattedDate = new Date(date).toLocaleDateString('it-IT');

  return (
    <Box sx={{ minHeight: '52vh', position: 'static' }} display="flex" flexGrow={1}>
      <Grid container direction="column" key="0" style={{ textAlign: 'center' }} margin={'auto'}>
        <Grid container item justifyContent="center" mb={3}>
          <Grid item xs={6}>
            <LocationCityIcon sx={{ color: '#00C5CA', fontSize: '96px' }} />
          </Grid>
        </Grid>
        <Grid container item justifyContent="center">
          <Grid item xs={6}>
            <Typography variant="h4">
              <Trans i18nKey="onboarding.notManagerButLR.title">
                {`L’impresa ha già un profilo su SEND`}
              </Trans>
            </Typography>
          </Grid>
        </Grid>
        <Grid container item justifyContent="center" mb={1} mt={4}>
          <Grid item xs={6}>
            <Typography variant="body1">
              {
                <Trans
                  i18nKey="onboarding.notManagerButLR.description1"
                  values={{
                    name: loggedUser.name,
                    surname: loggedUser.surname,
                    date: formattedDate,
                  }}
                >
                  {`{{ name }} {{ surname }}, in qualità di Legale Rappresentante, ha registrato questa impresa su SEND in data {{ date }}.`}
                </Trans>
              }
            </Typography>
          </Grid>
        </Grid>
        <Grid container item justifyContent="center" mb={4} mt={1}>
          <Grid item xs={6}>
            <Typography variant="body1">
              {
                <Trans
                  i18nKey="onboarding.notManagerButLR.description2"
                  values={{
                    name: loggedUser.name,
                    surname: loggedUser.surname,
                  }}
                >
                  {`Se necessario, puoi revocare l’accesso di {{ name }} {{ surname }} dalla sezione Utenti all’interno dell’area riservata.`}
                </Trans>
              }
            </Typography>
          </Grid>
        </Grid>
        <Grid container item justifyContent={'center'} mb={4}>
          <Card
            variant="outlined"
            sx={{
              display: 'grid',
              alignItems: 'center',
              justifyItems: 'left',
              width: { xs: 'calc(100% - 96px)', sm: '480px' },
              minWidth: '200px',
              borderRadius: theme.spacing(2),
              border: '2px solid',
              borderColor: theme.palette.primary.main,
              backgroundColor: '#0073E614',
            }}
          >
            <Grid item xs={6} ml={2} my={1}>
              <Typography variant='body1' fontWeight={'bold'}>
                {companyData?.companyName}
              </Typography>
            </Grid>
            <Grid item xs={6} ml={2} mb={1}>
            <Typography variant='body1'>
                {companyData?.companyTaxCode}
              </Typography>
            </Grid>
          </Card>
        </Grid>
        <Grid container item justifyContent="center">
          <Grid item xs={4}>
            <Button
              variant={'contained'}
              sx={{ alignSelf: 'center' }}
              onClick={() => handleOnboardingUsersSubmit()}
            >
              {<Trans i18nKey="onboarding.notManagerButLR.signIn">{`Accedi`}</Trans>}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default NotManagerButLR;

import { Trans } from 'react-i18next';
import {
  storageTokenOps,
  storageUserOps,
} from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { Grid, Typography, Box, Button, Card } from '@mui/material';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { theme } from '@pagopa/mui-italia';
import { useContext, useEffect, useState } from 'react';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/lib/hooks/useErrorDispatcher';
import { Company, User } from '../../../types';
import { MOCK_USER } from '../../../utils/constants';
import { UserContext } from '../../../lib/context';
import { getManagerOfOnboarding } from '../../../services/onboardingService';
import { FirstManagerInfo } from '../../../utils/models/VerificationResult';

type Props = {
  handleOnboardingUsersSubmit: () => Promise<void>;
  companyData?: Company;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

function NotManagerButLR({ handleOnboardingUsersSubmit, companyData, setLoading }: Props) {
  const { user } = useContext(UserContext);
  const loggedUser = MOCK_USER ? (user as User) : storageUserOps.read();
  const sessionToken = storageTokenOps.read();
  const createdAt = companyData?.onboardings
    ? (companyData?.onboardings[0].createdAt as unknown as string)
    : undefined;
  const date = createdAt?.split('T')[0] ?? '';
  const formattedDate = new Date(date).toLocaleDateString('it-IT');
  const [firstManagerInfo, setFirstManagerInfo] = useState<FirstManagerInfo>({
    name: '',
    surname: '',
  });
  const addError = useErrorDispatcher();

  const getFirstManagerInfo = async (tokenId: string, sessionToken: string) => {
    setLoading(true);
    try {
      if (tokenId) {
        const response = await getManagerOfOnboarding(
          '94c39ab1-e8ff-4608-8343-6c18eff720a1',
          sessionToken
        );

        if (!response.ok) {
          console.error('API call failed:', response.status, response.statusText);
        }

        const firstManagerResponse = await response.json();
        console.log('firstManagerResponse', firstManagerResponse);
        if (firstManagerResponse) {
          setFirstManagerInfo(firstManagerResponse);
        }
      }
    } catch (reason: any) {
      addError({
        id: 'ONBOARDING_PNPG_GETTING_FIRST_MANAGER_INFO_ERROR',
        blocking: false,
        error: reason,
        techDescription: `An error occurred while getting first manager info: ${reason.message}`,
        toNotify: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Array.isArray(companyData?.onboardings) && companyData?.onboardings[0].tokenId) {
      void getFirstManagerInfo(companyData?.onboardings[0].tokenId, sessionToken);
    }
  }, [companyData?.institutionId]);

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
                    name: firstManagerInfo.name ?? '',
                    surname: firstManagerInfo.surname ?? '',
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
              <Typography variant="body1" fontWeight={'bold'}>
                {companyData?.companyName}
              </Typography>
            </Grid>
            <Grid item xs={6} ml={2} mb={1}>
              <Typography variant="body1">{companyData?.companyTaxCode}</Typography>
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

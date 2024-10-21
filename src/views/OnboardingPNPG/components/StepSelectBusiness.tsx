import { Button, Grid, Typography, Box, Link } from '@mui/material';
import { PartyAccountItem, theme } from '@pagopa/mui-italia';
import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { uniqueId } from 'lodash';
import { EndingPage, useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { Business, LegalEntity, StepperStepComponentProps } from '../../../types';
import { withLogin } from '../../../components/withLogin';
import { OnboardingStepActions } from '../../../components/OnboardingStepActions';
import { useHistoryState } from '../../../components/useHistoryState';
import { ENV } from '../../../utils/env';
import { ReactComponent as AlreadyOnboardedIcon } from '../../../assets/alreadyOnboarded.svg';

type Props = {
  retrievedBusinesses?: LegalEntity;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  setRetrievedPartyId: React.Dispatch<React.SetStateAction<string | undefined>>;
} & StepperStepComponentProps;

// eslint-disable-next-line sonarjs/cognitive-complexity
function StepSelectBusiness({
  forward,
  retrievedBusinesses,
  setLoading,
  setRetrievedPartyId,
  setActiveStep,
}: Props) {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const requestId = uniqueId();

  const [selectedBusiness, setSelectedBusiness, setSelectedBusinessHistory] = useHistoryState<
    Business | undefined
  >('selected_business', undefined);
  const [retrievedId, setRetrievedId] = useState<string>();

  useEffect(() => {
    if (retrievedBusinesses?.businesses.length === 1) {
      setSelectedBusiness({
        certified: true,
        businessName: retrievedBusinesses.businesses[0].businessName ?? '',
        businessTaxId: retrievedBusinesses.businesses[0].businessTaxId ?? '',
      });
      setSelectedBusinessHistory({
        ...selectedBusiness,
        certified: true,
        businessName: retrievedBusinesses.businesses[0].businessName ?? '',
        businessTaxId: retrievedBusinesses.businesses[0].businessTaxId ?? '',
      });
    } else {
      setSelectedBusinessHistory(undefined);
      setSelectedBusiness(undefined);
    }
  }, [retrievedBusinesses]);

  const getActiveOnboarding = async (taxCode: string) => {
    const sessionToken = storageTokenOps.read();
    // TODO Temporary used fetch method instead of codegen, this will be replaced with PNPG-253
    setLoading(true);
    try {
      const response = await fetch(
        `${ENV.URL_API.ONBOARDING}/v2/institutions/onboarding/active?taxCode=${taxCode}&productId=prod-pn-pg`,
        {
          headers: {
            accept: '*/*',
            'accept-language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
            authorization: `Bearer ${sessionToken}`,
          },
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
        }
      );
      const businesses = await response.json();
      if (businesses[0].institutionId) {
        trackEvent('ONBOARDING_PG_SUBMIT_ALREADY_ONBOARDED', {
          requestId,
          productId: 'prod-pn-pg',
        });
        setRetrievedPartyId(businesses[0].institutionId);
        setRetrievedId(businesses[0].institutionId);
      } else {
        setSelectedBusinessHistory({
          certified: true,
          businessName: selectedBusiness?.businessName ?? '',
          businessTaxId: selectedBusiness?.businessTaxId ?? '',
        });
        setActiveStep(3);
      }
    } catch (reason) {
      addError({
        id: 'RETRIEVING_ONBOARDED_PARTY_ERROR',
        blocking: false,
        error: reason as Error,
        techDescription: `An error occurred while retrieving onboarded party of ${selectedBusiness}`,
        toNotify: true,
      });
      setSelectedBusinessHistory({
        certified: true,
        businessName: selectedBusiness?.businessName ?? '',
        businessTaxId: selectedBusiness?.businessTaxId ?? '',
      });
      setActiveStep(3);
    }
    setLoading(false);
  };

  const onForwardAction = () => {
    const requestId = uniqueId();
    trackEvent('ONBOARDING_PG_SELECTION', {
      requestId,
      productId: 'prod-pn-pg',
    });
    if (selectedBusiness?.businessTaxId) {
      void getActiveOnboarding(selectedBusiness.businessTaxId);
    }
  };

  const moreThanTwoInstitutions = retrievedBusinesses && retrievedBusinesses.businesses.length >= 2;

  return retrievedId ? (
    <EndingPage
      icon={<AlreadyOnboardedIcon />}
      title={t('alreadyOnboarded.title')}
      description={
        <Trans i18nKey="alreadyOnboarded.description">
          Questa impresa è già stata registrata. Accedi per leggere le <br />
          notifiche e aggiungere altri utenti.
        </Trans>
      }
      variantTitle={'h4'}
      variantDescription={'body1'}
      buttonLabel={t('alreadyOnboarded.signIn')}
      onButtonClick={() => window.location.assign(ENV.URL_FE.DASHBOARD + '/' + `${retrievedId}`)}
    />
  ) : (
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
        {retrievedBusinesses &&
          retrievedBusinesses.businesses.map((b, index) => (
            <Box key={index} width={{ xs: 'calc(100% - 120px)', sm: '480px' }} minWidth="250px">
              <Button
                aria-label={b.businessName}
                sx={{
                  marginBottom: 2,
                  width: '100%',
                  height: '120px',
                  justifyItems: '-moz-initial',
                  flexDirection: 'row',
                  backgroundColor: 'background.paper',
                  borderRadius: theme.spacing(2),
                  border:
                    b.businessTaxId === selectedBusiness?.businessTaxId
                      ? 'solid 3px #0073E6'
                      : undefined,
                  boxShadow:
                    '0px 8px 10px -5px rgba(0, 43, 85, 0.1), 0px 16px 24px 2px rgba(0, 43, 85, 0.05), 0px 6px 30px 5px rgba(0, 43, 85, 0.1)',
                }}
                onClick={() => {
                  setSelectedBusiness({
                    certified: true,
                    businessName: b.businessName ?? '',
                    businessTaxId: b.businessTaxId ?? '',
                  });
                }}
              >
                <PartyAccountItem
                  aria-label={b.businessName}
                  partyName={b.businessName ?? ''}
                  partyRole={b.businessTaxId}
                  maxCharactersNumberMultiLine={20}
                  containerSx={{
                    marginInlineEnd: 'auto',
                    marginLeft: 1,
                  }}
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
              disabled: !selectedBusiness,
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
export default withLogin(StepSelectBusiness);

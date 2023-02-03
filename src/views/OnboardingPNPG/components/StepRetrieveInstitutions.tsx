import { useState, useContext, useEffect } from 'react';
import { Trans } from 'react-i18next';
import { EndingPage } from '@pagopa/selfcare-common-frontend';
import { IllusError, theme } from '@pagopa/mui-italia';
import { AxiosResponse } from 'axios';
import { Link, Typography } from '@mui/material';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { useTranslation } from 'react-i18next';
import { InstitutionsPnPG } from '../../../../types';
import { withLogin } from '../../../components/withLogin';
import { UserContext } from '../../../lib/context';
import { fetchWithLogs } from '../../../lib/api-utils';
import { getFetchOutcome } from '../../../lib/error-utils';

type Props = {
  retrievedInstitutions?: InstitutionsPnPG;
  setRetrievedInstitutions: React.Dispatch<React.SetStateAction<InstitutionsPnPG | undefined>>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
};

function StepRetrieveInstitutions({
  retrievedInstitutions,
  setRetrievedInstitutions,
  setActiveStep,
}: Props) {
  const { t } = useTranslation();
  const [_loading, setLoading] = useState<boolean>(false);
  const { setRequiredLogin } = useContext(UserContext);

  const retrieveInstitutionsUsingId = async () => {
    setLoading(true);

    const searchResponse = await fetchWithLogs(
      {
        endpoint: 'GET_INSTITUTIONS_BY_USER_ID',
      },
      {
        method: 'POST',
        data: {
          taxCode: 'DLLDGI53T30I324E',
          name: 'Diego',
          surname: 'Della Valle',
          email: 'd.dellavalle@test.it',
          role: 'MANAGER',
        },
      },
      () => setRequiredLogin(true)
    );

    const outcome = getFetchOutcome(searchResponse);

    if (outcome === 'success') {
      const retrievedInstitutions = (searchResponse as AxiosResponse).data;
      setRetrievedInstitutions(retrievedInstitutions);
      setActiveStep(1);
    } else {
      trackEvent('NOT_RETRIEVED_ENTITIES', {});
    }
    setLoading(false);
  };

  useEffect(() => {
    retrieveInstitutionsUsingId().catch((e) => e);
  }, []);

  return retrievedInstitutions && retrievedInstitutions.businesses.length === 0 ? (
    <>
      <EndingPage
        icon={<IllusError size={60} />}
        title={t('institutionsNotFound.title')}
        description={
          <Trans i18nKey="institutionsNotFound.message">
            Per accedere alle notifiche, l’azienda deve essere registrata <br /> dal Legale
            Rappresentante.
          </Trans>
        }
        variantTitle={'h4'}
        variantDescription={'body1'}
        buttonLabel={t('institutionsNotFound.backToAccess')}
        onButtonClick={() => {}} // TODO Redirect
      />
      <Typography
        sx={{
          textAlign: 'center',
          display: 'block',
          marginTop: 4,
        }}
        variant="caption"
        color={theme.palette.text.primary}
      >
        <Trans i18nKey="selectInstitutionReleated.changeInstitutionSelectedLink">
          {'Sei il Legale Rappresentante di un’azienda? '}
          <Link sx={{ textDecoration: 'underline', color: theme.palette.primary.main }} href="">
            {/* Todo add the correct redirect */}
            {'Registra nuova azienda'}
          </Link>
        </Trans>
      </Typography>
    </>
  ) : (
    <></>
  );
}

export default withLogin(StepRetrieveInstitutions);

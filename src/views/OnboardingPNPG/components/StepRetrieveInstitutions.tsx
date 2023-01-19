import { useState, useContext, useEffect } from 'react';
import { Trans } from 'react-i18next';
import { EndingPage } from '@pagopa/selfcare-common-frontend';
import { IllusError, theme } from '@pagopa/mui-italia';
import { AxiosResponse } from 'axios';
import { Link, Typography } from '@mui/material';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { InstitutionsPnPG, RequestOutcomeMessage } from '../../../../types';
import { withLogin } from '../../../components/withLogin';
import { UserContext } from '../../../lib/context';
import { fetchWithLogs } from '../../../lib/api-utils';
import { getFetchOutcome } from '../../../lib/error-utils';

export const institutionsNotFound: RequestOutcomeMessage = {
  title: '',
  description: [
    <>
      <EndingPage
        icon={<IllusError />}
        title={i18n.t('institutionsNotFound.title')}
        description={i18n.t('institutionsNotFound.message')}
        variantTitle={'h4'}
        variantDescription={'body1'}
        buttonLabel={i18n.t('institutionsNotFound.backToAccess')}
        onButtonClick={() => {}} // TODO Redirect to access
      />
      <Typography
        sx={{
          textAlign: 'center',
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
    </>,
  ],
};

type Props = {
  setRetrievedInstitutions: React.Dispatch<React.SetStateAction<InstitutionsPnPG | undefined>>;
};

function StepRetrieveInstitutions({ setRetrievedInstitutions }: Props) {
  const [outcome, setOutcome] = useState<RequestOutcomeMessage>();
  const [_loading, setLoading] = useState<boolean>(false);
  const { setRequiredLogin } = useContext(UserContext);

  const retrieveInstitutionsUsingId = async () => {
    setLoading(true);

    {
      /* userId: '123456' --> 2 parties 
             userId: '654321' --> 1 party
             userId: 'randomId' ---> no parties   */
    }

    const searchResponse = await fetchWithLogs(
      {
        endpoint: 'GET_INSTITUTIONS_BY_USER_ID',
        endpointParams: {
          userId: '654321',
        },
      },
      {
        method: 'GET',
      },
      () => setRequiredLogin(true)
    );

    setLoading(true);

    const outcome = getFetchOutcome(searchResponse);

    if (outcome === 'success') {
      const retrievedInstitutions = (searchResponse as AxiosResponse).data;
      setRetrievedInstitutions(retrievedInstitutions);
    } else {
      setOutcome(institutionsNotFound);
    }
    setLoading(false);
  };

  useEffect(() => {
    retrieveInstitutionsUsingId().catch((e) => console.log(e));
  }, []);

  return outcome ? <EndingPage {...outcome} /> : <></>;
}

export default withLogin(StepRetrieveInstitutions);

import { useEffect, useState } from 'react';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { EndingPage } from '@pagopa/selfcare-common-frontend';
import { IllusError } from '@pagopa/mui-italia';
import { useTranslation, Trans } from 'react-i18next';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { useHistory } from 'react-router-dom';
import { BusinessPnpg, StepperStepComponentProps } from '../../../../types';
import { ENV } from '../../../utils/env';
import { useHistoryState } from '../../../components/useHistoryState';
import { ROUTES } from '../../../utils/constants';
import { onboardingPGSubmit } from '../../../services/onboardingService';
import { loggedUser } from '../../../api/__mocks__/DashboardPnPgApiClient';

type Props = StepperStepComponentProps & {
  setLoading: (loading: boolean) => void;
};

function StepSubmit({ forward, setLoading }: Props) {
  const { t } = useTranslation();
  const history = useHistory();
  const [selectedInstitution, setSelectedInstitution, setSelectedInstitutionHistory] =
    useHistoryState<BusinessPnpg | undefined>('selected_institution', undefined);
  const [error, setError] = useState<'alreadyOnboarded' | 'genericError'>();
  const productId = 'prod-pn-pg';

  useEffect(() => {
    if (!error && selectedInstitution) {
      setLoading(true);
      submit(selectedInstitution.businessTaxId, productId, selectedInstitution)
        .catch((e) => e)
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const submit = async (
    externalInstitutionId: string,
    productId: string,
    selectedInstitution: BusinessPnpg
  ) => {
    setLoading(true);

    onboardingPGSubmit(externalInstitutionId, productId, loggedUser, selectedInstitution)
      .then(() => {
        trackEvent('ONBOARDING_PNPG_SEND_SUCCESS', {});
        setSelectedInstitution(selectedInstitution);
        setSelectedInstitutionHistory(selectedInstitution);
        forward();
      })
      .catch((reason) => {
        if (reason === 400) {
          setError('alreadyOnboarded');
          trackEvent('ONBOARDING_PNPG_SEND_ALREADY_ONBOARDED', {});
          setSelectedInstitution(selectedInstitution);
          setSelectedInstitutionHistory(selectedInstitution);
        } else {
          setError('genericError');
          trackEvent('ONBOARDING_PNPG_SEND_GENERIC_ERROR', {});
        }
      })
      .finally(() => setLoading(false));
  };

  return error === 'genericError' ? (
    <EndingPage
      minHeight="52vh"
      icon={<IllusError size={60} />}
      title={t('outcome.error.title')}
      description={
        <Trans i18nKey="outcome.error.description">
          A causa di un errore del sistema non è possibile completare <br />
          la procedura. Ti chiediamo di riprovare più tardi.
        </Trans>
      }
      variantTitle={'h4'}
      variantDescription={'body1'}
      buttonLabel={t('outcome.error.backToHome')}
      onButtonClick={() => window.location.assign(ENV.URL_FE.LOGIN)} // TODO Actually redirect to selfcare login, set correct redirect when available
    />
  ) : error === 'alreadyOnboarded' ? (
    <EndingPage
      icon={<IllusError size={60} />}
      title={i18n.t('alreadyOnboarded.title')}
      description={
        <Trans i18nKey="alreadyOnboarded.message">
          L&apos;ente selezionato ha già effettuato l&apos;adesione. <br />
          Puoi entrare nel portale.
        </Trans>
      }
      variantTitle={'h4'}
      variantDescription={'body1'}
      buttonLabel={i18n.t('alreadyOnboarded.enter')}
      onButtonClick={() => history.push(ROUTES.PNPG_DASHBOARD.PATH, selectedInstitution)}
    />
  ) : (
    <></>
  );
}
export default StepSubmit;

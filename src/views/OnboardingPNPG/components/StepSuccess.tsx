import { IllusCompleted } from '@pagopa/mui-italia';
import EndingPage from '@pagopa/selfcare-common-frontend/components/EndingPage';
import { useTranslation } from 'react-i18next';
import { useHistoryState } from '../../../components/useHistoryState';
import { Business } from '../../../types';
import { ENV } from '../../../utils/env';

function StepSuccess() {
  const { t } = useTranslation();

  const selectedBusiness = useHistoryState<Business | undefined>('selected_business', undefined)[0];

  return (
    <EndingPage
      minHeight="52vh"
      icon={<IllusCompleted size={60} />}
      title={t('outcome.success.title')}
      description={t('outcome.success.description')}
      variantTitle={'h4'}
      variantDescription={'body1'}
      buttonLabel={t('outcome.success.signIn')}
      onButtonClick={() =>
        window.location.assign(ENV.URL_FE.DASHBOARD + '/' + `${selectedBusiness?.businessTaxId}`)
      }
    />
  );
}
export default StepSuccess;

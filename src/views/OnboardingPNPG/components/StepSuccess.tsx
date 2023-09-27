import { IllusCompleted } from '@pagopa/mui-italia';
import EndingPage from '@pagopa/selfcare-common-frontend/components/EndingPage';
import { useTranslation } from 'react-i18next';
import { ENV } from '../../../utils/env';

type Props = {
  retrievedPartyId?: string;
};

function StepSuccess({ retrievedPartyId }: Props) {
  const { t } = useTranslation();

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
        window.location.assign(ENV.URL_FE.DASHBOARD + '/' + `${retrievedPartyId}`)
      }
    />
  );
}
export default StepSuccess;

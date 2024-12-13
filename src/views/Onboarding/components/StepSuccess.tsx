import { IllusCompleted } from '@pagopa/mui-italia';
import EndingPage from '@pagopa/selfcare-common-frontend/lib/components/EndingPage';
import { useTranslation, Trans } from 'react-i18next';
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
      description={
        <Trans i18next="outcome.success.description" components={{ 1: <br /> }}>
          {
            'Ora puoi leggere le notifiche e aggiungere altri utenti <1 />nell’area riservata di SEND.'
          }
        </Trans>
      }
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

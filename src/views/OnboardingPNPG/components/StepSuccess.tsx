import { IllusCompleted } from '@pagopa/mui-italia';
import EndingPage from '@pagopa/selfcare-common-frontend/components/EndingPage';
import { useTranslation, Trans } from 'react-i18next';
import { ROUTES } from '../../../utils/constants';

function StepSuccess() {
  const { t } = useTranslation();
  return (
    <EndingPage
      minHeight="52vh"
      icon={<IllusCompleted size={60} />}
      title={
        <Trans i18nKey="outcome.success.title">
          La registrazione è avvenuta con <br />
          successo
        </Trans>
      }
      description={
        <Trans i18nKey="outcome.success.description">
          La tua azienda è su Piattaforma Notifiche. Puoi entrare per <br />
          vedere le notifiche e per gestire i permessi di altri utenti.
        </Trans>
      }
      variantTitle={'h4'}
      variantDescription={'body1'}
      buttonLabel={t('outcome.success.enterButton')}
      onButtonClick={() => window.location.assign(ROUTES.DASHBOARD.PATH)}
    />
  );
}

export default StepSuccess;

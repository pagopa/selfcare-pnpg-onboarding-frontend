import { IllusCompleted } from '@pagopa/mui-italia';
import EndingPage from '@pagopa/selfcare-common-frontend/components/EndingPage';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { BusinessPnpg } from '../../../../types';
import { useHistoryState } from '../../../components/useHistoryState';
import { ROUTES } from '../../../utils/constants';

function StepSuccess() {
  const { t } = useTranslation();
  const history = useHistory();

  const selectedInstitution = useHistoryState<BusinessPnpg | undefined>(
    'selected_institution',
    undefined
  )[0];
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
      onButtonClick={() => history.push(ROUTES.PNPG_DASHBOARD.PATH, selectedInstitution)}
    />
  );
}

export default StepSuccess;

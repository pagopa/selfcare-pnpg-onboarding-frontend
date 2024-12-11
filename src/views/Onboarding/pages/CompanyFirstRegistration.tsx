import { EndingPage } from '@pagopa/selfcare-common-frontend/lib';
import { useTranslation, Trans } from 'react-i18next';
import { ReactComponent as CompanyIcon } from '../assets/company-icon.svg';

type Props = {
  forward: () => void;
};

export default function CompanyFirstRegistration({ forward }: Props) {
  const { t } = useTranslation();
  return (
    <EndingPage
      icon={<CompanyIcon />}
      variantTitle="h4"
      variantDescription="body1"
      title={
        <Trans
          i18next="onboarding.insertFiscalCode.outcome.found.companyFirstRegistration.title"
          components={{ 1: <br /> }}
        >
          {'L’impresa non ha ancora un profilo <1 />su SEND'}
        </Trans>
      }
      description={
        <Trans
          i18next="onboarding.insertFiscalCode.outcome.found.companyFirstRegistration.description"
          components={{ 1: <br />, 3: <br /> }}
        >
          {
            'Per leggere le notifiche devi prima di tutto creare un profilo <1 />SEND per l’impresa. L’operazione può essere completata solo <3 />da un Legale Rappresentante.'
          }
        </Trans>
      }
      buttonLabel={t('onboarding.insertFiscalCode.outcome.found.companyFirstRegistration.start')}
      onButtonClick={forward}
    />
  );
}

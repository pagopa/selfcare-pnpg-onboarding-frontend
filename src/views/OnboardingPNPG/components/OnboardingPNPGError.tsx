import { EndingPage } from '@pagopa/selfcare-common-frontend';
import { IllusError } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';

export function OnboardingPNPGSuccess() {
  const { t } = useTranslation();
  return (
    <EndingPage
      icon={<IllusError />}
      title={t('outcome.error.title')}
      description={t('outcome.error.description')}
      variantTitle={'h4'}
      variantDescription={'body1'}
      buttonLabel={t('outcome.error.backToHome')}
      onButtonClick={() => {}} // TODO Redirect to access
    />
  );
}

import { EndingPage } from '@pagopa/selfcare-common-frontend';
import { IllusCompleted } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';

export function OnboardingPNPGSuccess() {
  const { t } = useTranslation();
  return (
    <EndingPage
      icon={<IllusCompleted />}
      title={t('outcome.success.title')}
      description={t('outcome.success.description')}
      variantTitle={'h4'}
      variantDescription={'body1'}
      buttonLabel={t('outcome.success.enterButton')}
      onButtonClick={() => {}} // TODO Redirect to dashboard for companies
    />
  );
}

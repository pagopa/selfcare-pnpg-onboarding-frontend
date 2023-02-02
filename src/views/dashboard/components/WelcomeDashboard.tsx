import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { useTranslation, Trans } from 'react-i18next';

type Props = {
  businessName?: string;
};

export default function WelcomeDashboard({ businessName }: Props) {
  const { t } = useTranslation();
  const title = t('dashboard.title');
  const subTitle = (
    <Trans i18nKey="dashboard.subTitle">
      Qui puoi vedere un riepilogo dei dati di {{ businessName }} lorem ipsum dolor sit amet.
    </Trans>
  );
  return (
    <TitleBox
      title={title}
      subTitle={subTitle as unknown as string} // Todo
      mbTitle={2}
      mbSubTitle={5}
      variantTitle="h4"
      variantSubTitle="body1"
      titleFontSize="32px"
      subTitleFontSize="18px"
    />
  );
}

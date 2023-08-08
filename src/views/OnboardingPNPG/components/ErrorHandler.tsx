import { IllusError } from '@pagopa/mui-italia';
import { EndingPage } from '@pagopa/selfcare-common-frontend';
import { Trans, useTranslation } from 'react-i18next';
import { ErrorType } from '../../../types';
import { ENV } from '../../../utils/env';

type Props = {
  error: ErrorType;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType | undefined>>;
};

export default function ErrorHandler({ error, setActiveStep, setError }: Props) {
  const { t } = useTranslation();

  return error === 'typedNotFound' || error === 'matchedButNotLR' ? (
    <EndingPage
      icon={<IllusError size={60} />}
      title={
        <Trans i18nKey="cannotRegisterBusiness.title">
          Non puoi registrare <br />
          questa impresa
        </Trans>
      }
      description={
        <Trans i18nKey="cannotRegisterBusiness.message">
          Dal tuo SPID non risulti essere Legale Rappresentante <br />
          dell’impresa associata a questo Codice Fiscale. Puoi <br />
          registrare solo le imprese di cui sei Legale Rappresentante.
        </Trans>
      }
      variantTitle={'h4'}
      variantDescription={'body1'}
      buttonLabel={t('cannotRegisterBusiness.close')}
      onButtonClick={() => setActiveStep(0)}
    />
  ) : error === 'genericError' ? (
    <EndingPage
      minHeight="52vh"
      icon={<IllusError size={60} />}
      title={t('genericError.title')}
      description={
        <Trans i18nKey="genericError.message">
          A causa di un problema tecnico, non riusciamo a registrare <br /> l’impresa. Riprova più
          tardi.
        </Trans>
      }
      variantTitle={'h4'}
      variantDescription={'body1'}
      buttonLabel={t('genericError.close')}
      onButtonClick={() => window.location.assign(ENV.URL_FE.LOGOUT)}
    />
  ) : error === 'invalidInputFormat' ? (
    <EndingPage
      minHeight="52vh"
      icon={<IllusError size={60} />}
      title={t('invalidInputFormat.title')}
      description={
        <Trans i18nKey="invalidInputFormat.message">
          Torna indietro, assicurati che sia corretto e inseriscilo di <br /> nuovo.
        </Trans>
      }
      variantTitle={'h4'}
      variantDescription={'body1'}
      buttonLabel={t('invalidInputFormat.goBack')}
      onButtonClick={() => setError(undefined)}
    />
  ) : (
    <></>
  );
}

import { EndingPage, SessionModal, useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import { storageUserOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { useState } from 'react';
import { ENV } from '../../../utils/env';
import { ReactComponent as AlreadyOnboardedIcon } from '../../../assets/alreadyOnboarded.svg';
import { InstitutionOnboardingResource } from '../../../api/generated/b4f-onboarding/InstitutionOnboardingResource';
import { checkManager, onboardingUsersSubmit } from '../../../services/onboardingService';
import { Business } from '../../../types';

type Props = {
  onboardingData: InstitutionOnboardingResource;
  back: () => void;
  business?: Business;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AlreadyOnboarded({ onboardingData, business, setLoading, back }: Props) {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();

  const loggedUser = storageUserOps.read();

  const [addManagerModal, setAddManagerModal] = useState<boolean>();

  const createdAt = onboardingData.onboardings
    ? (onboardingData.onboardings[0].createdAt as unknown as string)
    : undefined;

  const date = createdAt?.split('T')[0];
  const time = createdAt?.split('T')[1].split('.')[0];

  const verifyManager = async () => {
    await checkManager(loggedUser, business?.businessTaxId)
      .then((res) => {
        if (res) {
          window.location.assign(ENV.URL_FE.DASHBOARD + '/' + `${onboardingData.institutionId}`);
        } else {
          setAddManagerModal(true);
        }
      })
      .catch((reason) => reason);
  };

  const addManager = async () => {
    if (business?.businessTaxId) {
      setLoading(true);
      await onboardingUsersSubmit(business.businessTaxId, business?.certified, loggedUser)
        .then(() =>
          window.location.assign(ENV.URL_FE.DASHBOARD + '/' + `${onboardingData.institutionId}`)
        )
        .catch((reason) => {
          addError({
            id: 'ONBOARDING_USER_ERROR',
            blocking: true,
            error: reason as Error,
            techDescription: `An error occurred while onboarding user for business ${business.businessTaxId}`,
            toNotify: true,
          });
        });
      setLoading(false);
    }
  };

  return addManagerModal ? (
    <SessionModal
      open={addManagerModal}
      title="Aggiunta Legale Rappresentante"
      message="L'impresa è stata registrata in precedenza da un altro legale rappresentante, cliccando su Continua verrai aggiunto e potrai operare sull'impresa"
      onConfirmLabel="Conferma"
      onConfirm={() => addManager()}
      handleClose={() => setAddManagerModal(false)}
    />
  ) : (
    <EndingPage
      icon={<AlreadyOnboardedIcon />}
      title={t('alreadyOnboarded.title')}
      description={
        <Trans
          i18nKey="alreadyOnboarded.description"
          components={{ 1: <strong />, 2: <br /> }}
          values={{ date, time }}
        >
          {`Questa impresa è già stata registrata in data <1>{{ date }}</1> alle ore <1>{{ time }}</1>. <2 /> Vuoi accedere?`}
        </Trans>
      }
      variantTitle={'h4'}
      variantDescription={'body1'}
      haveTwoButtons={true}
      buttonLabel={t('alreadyOnboarded.back')}
      secondButtonLabel={t('alreadyOnboarded.signIn')}
      onButtonClick={back}
      onSecondButtonClick={() => verifyManager()}
    />
  );
}

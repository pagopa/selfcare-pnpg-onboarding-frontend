import { EndingPage, SessionModal, useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import { storageUserOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { useState } from 'react';
import { ENV } from '../../../utils/env';
import { ReactComponent as AlreadyOnboardedIcon } from '../../../assets/alreadyOnboarded.svg';
import {
  checkManager,
  onboardingUsersSubmit,
  searchUser,
} from '../../../services/onboardingService';
import { Company } from '../../../types';

type Props = {
  companyData?: Company;
  back: () => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AlreadyOnboarded({ companyData, setLoading, back }: Props) {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  // const [userId, setUserId] = useState<string>();
  const loggedUser = storageUserOps.read();

  const [addManagerModal, setAddManagerModal] = useState<boolean>();

  const createdAt = companyData?.onboardings
    ? (companyData?.onboardings[0].createdAt as unknown as string)
    : undefined;

  const date = createdAt?.split('T')[0];
  const time = createdAt?.split('T')[1].split('.')[0];

  const verifyManager = async () => {
    await searchUser({ taxCode: loggedUser.taxCode })
      .then((res: any) => {
        if (res.id) {
          checkManager(res, companyData?.companyTaxCode)
            .then((res) => {
              if (res.result) {
                window.location.assign(
                  ENV.URL_FE.DASHBOARD + '/' + `${companyData?.institutionId}`
                );
              } else {
                setAddManagerModal(true);
              }
            })
            .catch((reason) => {
              addError({
                id: 'CHECK_MANAGER_ERROR',
                blocking: false,
                error: reason as Error,
                techDescription: 'Failed to check manager status',
                toNotify: true,
              });
            });
        }
      })
      .catch((reason) => {
        addError({
          id: 'SEARCH_USER_ERROR',
          blocking: false,
          error: reason as Error,
          techDescription: `An error occurred while searching the user with the taxCode ${loggedUser.taxCode}`,
          toNotify: true,
        });
      });
  };

  const addManager = async () => {
    if (companyData?.companyTaxCode) {
      setLoading(true);
      const certified = companyData?.origin === 'INFOCAMERE';
      await onboardingUsersSubmit(companyData?.companyTaxCode, certified, loggedUser)
        .then(() =>
          window.location.assign(ENV.URL_FE.DASHBOARD + '/' + `${companyData?.institutionId}`)
        )
        .catch((reason) => {
          addError({
            id: 'ONBOARDING_USER_ERROR',
            blocking: true,
            error: reason as Error,
            techDescription: `An error occurred while onboarding user for business ${companyData?.companyTaxCode}`,
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

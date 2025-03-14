import { IllusError, theme } from '@pagopa/mui-italia';
import { EndingPage } from '@pagopa/selfcare-common-frontend/lib';
import { Trans, useTranslation } from 'react-i18next';
import React from 'react';
import { Company, Outcome } from '../../../types';
import { ENV } from '../../../utils/env';
import { ReactComponent as NotFound } from '../assets/notfound.svg';
import AlreadyOnboarded from '../pages/AlreadyOnboarded';
import CompanyFirstRegistration from '../pages/CompanyFirstRegistration';
import NotManagerButLR from '../pages/NotManagerButLR';

type Props = {
  outcome: Outcome;
  setOutcome: React.Dispatch<React.SetStateAction<Outcome | undefined>>;
  companyData?: Company;
  handleOnboardingUsersSubmit: () => Promise<void>;
  forward: any;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function OutcomeHandler({
  outcome,
  setOutcome,
  companyData,
  handleOnboardingUsersSubmit,
  forward,
  setActiveStep,
  setLoading,
}: Props) {
  const { t } = useTranslation();

  const forwardCompanyDatIntoNextStep = () => {
    forward(companyData);
    setActiveStep(1);
  };

  return outcome === 'matchedButNotLR' ? (
    <EndingPage
      icon={<NotFound />}
      title={
        <Trans i18nKey="cannotRegisterBusiness.title" components={{ 1: <br /> }}>
          {'Ci dispiace, non puoi registrare <1 />l’impresa su SEND'}
        </Trans>
      }
      description={
        <Trans
          i18nKey="cannotRegisterBusiness.description"
          components={{
            1: <br />,
            3: <br />,
            5: (
              <a
                href="https://www.registroimprese.it/"
                style={{ color: theme.palette.primary.main }}
              />
            ),
          }}
        >
          {
            'L’impresa non ha ancora un profilo su SEND, ma non puoi <1 />registrarla perché non risulti essere Legale Rappresentante <3 />oppure perché l’impresa non è presente nei <5>registri pubblici</5>.'
          }
        </Trans>
      }
      variantTitle={'h4'}
      variantDescription={'body1'}
      buttonLabel={t('cannotRegisterBusiness.close')}
      onButtonClick={() => setOutcome(undefined)}
    />
  ) : outcome === 'notManagerButLR' ? (
    <NotManagerButLR
      handleOnboardingUsersSubmit={handleOnboardingUsersSubmit}
      companyData={companyData}
      setLoading={setLoading}
    />
  ) : outcome === 'genericError' ? (
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
  ) : outcome === 'alreadyOnboarded' ? (
    <AlreadyOnboarded
      companyData={companyData}
      setLoading={setLoading}
      back={() => setOutcome(undefined)}
    />
  ) : outcome === 'firstRegistration' ? (
    <CompanyFirstRegistration forward={forwardCompanyDatIntoNextStep} />
  ) : outcome === 'requestAdminAccess' ? (
    <EndingPage
      icon={<NotFound />}
      title={
        <Trans i18nKey="requestAdminAccess.title" components={{ 1: <br /> }}>
          {'Richiedi l’accesso a un amministratore'}
        </Trans>
      }
      description={
        <Trans i18nKey="requestAdminAccess.message" components={{ 1: <br /> }}>
          {
            'L’impresa ha già un profilo su SEND, ma non disponi dei permessi <1 />necessari per accedervi. Per richiedere l’accesso, contatta <1 />uno degli Amministratori.'
          }
        </Trans>
      }
      variantTitle={'h4'}
      variantDescription={'body1'}
    />
  ) : (
    <></>
  );
}

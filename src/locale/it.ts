export default {
  loadingText: 'Stiamo verificando i tuoi dati',
  onboarding: {
    insertFiscalCode: {
      title: 'Inserisci il Codice Fiscale',
      subTitle: `Il Codice Fiscale dell’impresa ci serve per verificare se è già <1 />presente un profilo su SEND - Servizio Notifiche Digitali`,
      label: 'Codice Fiscale dell’impresa',
      inputError: {
        invalidFormat: 'Formato non corretto, controlla il dato e riprova',
      },
      action: {
        forward: 'Continua',
        back: 'Indietro',
      },
      outcome: {
        found: {
          companyFirstRegistration: {
            title: 'L’impresa non ha ancora un profilo <1 />su SEND',
            description:
              'Per leggere le notifiche devi prima di tutto creare un profilo <1 />SEND per l’impresa. L’operazione può essere completata solo <3 />da un Legale Rappresentante.',
            start: 'Inizia',
          },
        },
      },
    },
    insertBusinessData: {
      title: 'Completa i dati dell’impresa',
      subTitle:
        'Inserisci i dati richiesti per completare la registrazione dell’impresa su <1 />SEND - Servizio Notifiche Digitali',
      businessNameLabel: 'Ragione sociale',
      pecEmailLabel: 'PEC istituzionale',
      invalidEmail: "L'indirizzo e-mail inserito non è corretto",
      invalidBusinessName: 'Inserisci una ragione sociale',
      backAction: 'Indietro',
      forwardAction: 'Registra impresa',
    },
  },
  requestAdminAccess: {
    title: 'Ci dispiace, non puoi registrare <1 />l’impresa su SEND',
    description:
      'L’impresa ha già un profilo su SEND, ma non disponi dei permessi necessari per accedervi. Per richiedere l’accesso, contatta uno degli Amministratori.',
  },
  cannotRegisterBusiness: {
    title: 'Ci dispiace, non puoi registrare <1 />l’impresa su SEND',
    description:
      'L’impresa non ha ancora un profilo su SEND, ma non puoi <1 />registrarla perché non risulti essere Legale Rappresentante <3 />oppure perché l’impresa non è presente nei <5>registri pubblici</5>.',
    close: 'Chiudi',
  },
  alreadyOnboarded: {
    title: 'Impresa già registrata',
    description:
      'Questa impresa è già stata registrata in data <1>{{ date }}</1> alle ore <1>{{ time }}</1>. <2 /> Vuoi accedere?',
    signIn: 'Accedi',
    back: 'Indietro',
  },
  genericError: {
    title: 'Si è verificato un errore',
    message:
      'A causa di un problema tecnico, non riusciamo a registrare <1 /> l’impresa. Riprova più tardi.',
    close: 'Chiudi',
  },
  outcome: {
    success: {
      title: 'Impresa registrata!',
      description:
        'Ora puoi leggere le notifiche e aggiungere altri utenti <1 />nell’area riservata di SEND.',
      signIn: 'Continua su SEND',
    },
    error: {
      title: 'Si è verificato un errore',
      description:
        "A causa di un problema tecnico, non riusciamo a registrare <1 />l'impresa. Riprova più tardi.",
      close: 'Chiudi',
    },
  },
  app: {
    sessionModal: {
      title: 'Sessione scaduta',
      message: 'Stai per essere rediretto alla pagina di login...',
    },
  },
};

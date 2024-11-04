export default {
  loadingText: 'Stiamo verificando i tuoi dati',
  chooseBusiness: {
    selectFromBusinessList: {
      title: 'Che impresa vuoi registrare?',
      subTitle:
        'Queste sono le imprese di cui risulti essere Legale Rappresentante. <1 /> Seleziona quella che vuoi registrare.',
    },
    selectReleatedBusiness: {
      title: 'Registra la tua impresa',
      subTitle: 'Questa è l’impresa cui risulti essere Legale Rappresentante. ',
    },
    registerBusiness: 'Registra impresa',
    registerBusinessByTaxCodeLink:
      'Non trovi la tua impresa? <1>Cercala tramite Codice Fiscale</1>',
  },
  addCompany: {
    title: 'Che impresa vuoi registrare?',
    subTitle: 'Inserisci il Codice Fiscale dell’impresa che vuoi <1 />registrare.',
    textfieldLabel: 'Codice Fiscale',
    forwardAction: 'Continua',
  },
  insertBusinessEmail: {
    title: 'Qual è l’indirizzo PEC dell’impresa?',
    subTitle: 'Inserisci l’indirizzo PEC dell’impresa che vuoi registrare.',
    pecLabel: 'Indirizzo PEC',
  },
  insertBusinessData: {
    title: 'Inserisci i dati della tua impresa',
    subTitle:
      'Inserisci la ragione sociale e l’indirizzo PEC dell’impresa che vuoi <1 />registrare.',
    businessNameLabel: 'Ragione sociale',
    pecEmailLabel: 'Indirizzo PEC',
    invalidEmail: "L'indirizzo e-mail inserito non è corretto",
    invalidBusinessName: 'Inserisci una ragione sociale',
    backAction: 'Indietro',
    forwardAction: 'Continua',
  },
  cannotRegisterBusiness: {
    title: 'Non puoi registrare <1/>questa impresa',
    description:
      'Dal tuo SPID non risulti essere Legale Rappresentante <1 />dell’impresa associata a questo Codice Fiscale. Puoi <3 />registrare solo le imprese di cui sei Legale Rappresentante.',
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
  invalidInputFormat: {
    title: 'Il Codice Fiscale/Partita IVA non è corretto',
    message: 'Torna indietro, assicurati che sia corretto e inseriscilo di <1 /> nuovo.',
    goBack: 'Torna indietro',
  },
  outcome: {
    success: {
      title: 'Impresa registrata!',
      description: 'Accedi per leggere le notifiche e aggiungere altri utenti.',
      signIn: 'Accedi',
    },
    error: {
      title: 'Impresa non registrata',
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

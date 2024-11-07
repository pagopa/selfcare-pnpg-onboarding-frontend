export default {
  loadingText: 'We are verifying your data',
  chooseBusiness: {
    selectFromBusinessList: {
      title: 'Which company do you want to register?',
      subTitle:
        'Queste sono le imprese di cui risulti essere Legale Rappresentante. <1 /> Seleziona quella che vuoi registrare.',
    },
    selectReleatedBusiness: {
      title: 'Register your company',
      subTitle: 'This is the company for which you are a Legal representative. ',
    },
    registerBusiness: 'Register company',
    registerBusinessByTaxCodeLink:
      'Non trovi la tua impresa? <1>Cercala tramite Codice Fiscale</1>',
  },
  addCompany: {
    title: 'Which company do you want to register?',
    subTitle: 'Enter the tax code for the company you want to <1 />register.',
    textfieldLabel: 'Tax code',
    forwardAction: 'Continue',
  },
  insertBusinessEmail: {
    title: 'What is the PEC address of the company?',
    subTitle: 'Enter the PEC address for the company you want to register.',
    pecLabel: 'PEC address',
  },
  insertBusinessData: {
    title: 'Enter the data for your company',
    subTitle:
      'Inserisci la ragione sociale e l’indirizzo PEC dell’impresa che vuoi <1 />registrare.',
    businessNameLabel: 'Company name',
    pecEmailLabel: 'PEC address',
    invalidEmail: "The entered email address is not correct",
    invalidBusinessName: 'Enter a company name',
    backAction: 'Go back',
    forwardAction: 'Continue',
  },
  cannotRegisterBusiness: {
    title: 'You cannot register <1/>this company',
    description:
      'Dal tuo SPID non risulti essere Legale Rappresentante <1 />dell’impresa associata a questo Codice Fiscale. Puoi <3 />registrare solo le imprese di cui sei Legale Rappresentante.',
    close: 'Close',
  },
  alreadyOnboarded: {
    title: 'Company already registered',
    description:
      'Questa impresa è già stata registrata. Accedi per leggere le <1 />notifiche e aggiungere altri utenti.',
    signIn: 'Login',
  },
  genericError: {
    title: 'An error has occurred',
    message:
      'A causa di un problema tecnico, non riusciamo a registrare <1 /> l’impresa. Riprova più tardi.',
    close: 'Close',
  },
  invalidInputFormat: {
    title: 'The tax code/VAT no. is not correct',
    message: 'Go back, make sure it is correct or enter it <1 /> again.',
    goBack: 'Go back',
  },
  outcome: {
    success: {
      title: 'Company registered!',
      description: 'Log in to read the notifications and add other users.',
      signIn: 'Login',
    },
    error: {
      title: 'Company not registered',
      description:
        "Due to a technical problem, we cannot register <1 />the company. Try again later.",
      close: 'Close',
    },
  },
  app: {
    sessionModal: {
      title: 'Session expired',
      message: 'You are being redirected to the login page...',
    },
  },
};

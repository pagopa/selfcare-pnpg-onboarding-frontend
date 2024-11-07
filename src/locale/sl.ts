export default {
  loadingText: 'Preverjamo vaše podatke',
  chooseBusiness: {
    selectFromBusinessList: {
      title: 'Katero podjetje želite registrirati?',
      subTitle:
        'Queste sono le imprese di cui risulti essere Legale Rappresentante. <1 /> Seleziona quella che vuoi registrare.',
    },
    selectReleatedBusiness: {
      title: 'Registrirajte svoje podjetje',
      subTitle: 'To je podjetje, za katerega je navedeno, da ste njegov pravni zastopnik. ',
    },
    registerBusiness: 'Registrirajte podjetje',
    registerBusinessByTaxCodeLink:
      'Non trovi la tua impresa? <1>Cercala tramite Codice Fiscale</1>',
  },
  addCompany: {
    title: 'Katero podjetje želite registrirati?',
    subTitle: 'Vnesite davčno številko podjetja, ki ga želite <1 />registrirati.',
    textfieldLabel: 'Davčna številka',
    forwardAction: 'Nadaljuj',
  },
  insertBusinessEmail: {
    title: 'Kakšen je naslov PEC podjetja?',
    subTitle: 'Vnesite naslov PEC podjetja, ki ga želite registrirati.',
    pecLabel: 'Naslov PEC',
  },
  insertBusinessData: {
    title: 'Vnesite podatke o podjetju',
    subTitle:
      'Inserisci la ragione sociale e l’indirizzo PEC dell’impresa che vuoi <1 />registrare.',
    businessNameLabel: 'Naziv podjetja',
    pecEmailLabel: 'Naslov PEC',
    invalidEmail: "Vneseni e-poštni naslov ni pravilen",
    invalidBusinessName: 'Vnesite naziv svojega podjetja',
    backAction: 'Nazaj',
    forwardAction: 'Nadaljuj',
  },
  cannotRegisterBusiness: {
    title: '<1/>Tega podjetja ne morete registrirati',
    description:
      'Dal tuo SPID non risulti essere Legale Rappresentante <1 />dell’impresa associata a questo Codice Fiscale. Puoi <3 />registrare solo le imprese di cui sei Legale Rappresentante.',
    close: 'Zapri',
  },
  alreadyOnboarded: {
    title: 'Podjetje je že registrirano',
    description:
      'Questa impresa è già stata registrata. Accedi per leggere le <1 />notifiche e aggiungere altri utenti.',
    signIn: 'Prijava',
  },
  genericError: {
    title: 'Prišlo je do napake',
    message:
      'A causa di un problema tecnico, non riusciamo a registrare <1 /> l’impresa. Riprova più tardi.',
    close: 'Zapri',
  },
  invalidInputFormat: {
    title: 'Davčna številka/številka za DDV ni pravilna',
    message: 'Vrnite se nazaj in se prepričajte, da je pravilna, in jo znova <1 /> vnesite.',
    goBack: 'Pojdi nazaj',
  },
  outcome: {
    success: {
      title: 'Podjetje je registrirano!',
      description: 'Prijavite se za branje obvestil in dodajanje drugih uporabnikov.',
      signIn: 'Prijava',
    },
    error: {
      title: 'Podjetje ni registrirano',
      description:
        "Zaradi tehnične težave <1 />podjetja ne moremo registrirati. Poskusite znova pozneje.",
      close: 'Zapri',
    },
  },
  app: {
    sessionModal: {
      title: 'Seja je potekla',
      message: 'Preusmerjeni boste na stran za prijavo ...',
    },
  },
};

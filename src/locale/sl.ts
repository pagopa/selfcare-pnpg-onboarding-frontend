export default {
  loadingText: 'Preverjamo vaše podatke',
  chooseBusiness: {
    selectFromBusinessList: {
      title: 'Katero podjetje želite registrirati?',
      subTitle:
        'To so podjetja, za katera ste zakoniti zastopnik. <1 /> Izberite tistega, ki ga želite registrirati.',
    },
    selectReleatedBusiness: {
      title: 'Registrirajte svoje podjetje',
      subTitle: 'To je podjetje, za katerega je navedeno, da ste njegov pravni zastopnik. ',
    },
    registerBusiness: 'Registrirajte podjetje',
    registerBusinessByTaxCodeLink:
      'Ne najdete svojega podjetja? <1>Poiščite ga z davčno številko</1>',
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
    subTitle: 'Vnesite ime podjetja in PEC podjetja, ki ga želite <1 />registrirati.',
    businessNameLabel: 'Naziv podjetja',
    pecEmailLabel: 'Naslov PEC',
    invalidEmail: 'Vneseni e-poštni naslov ni pravilen',
    invalidBusinessName: 'Vnesite naziv svojega podjetja',
    backAction: 'Nazaj',
    forwardAction: 'Nadaljuj',
  },
  cannotRegisterBusiness: {
    title: 'Tega podjetja ne morete registrirati <1/>',
    description:
      'Vaš SPID ne kaže, da ste zakoniti zastopnik <1 />podjetja, povezanega s to davčno številko. <3 />Registrirate lahko samo podjetja, katerih zakoniti zastopnik ste.',
    close: 'Zapri',
  },
  alreadyOnboarded: {
    title: 'Podjetje je že registrirano',
    description:
      'To podjetje je že registrirano. Prijavite se, da preberete <1 />obvestila in dodate več uporabnikov.',
    signIn: 'Prijava',
  },
  genericError: {
    title: 'Prišlo je do napake',
    message:
      'Zaradi tehnične težave ne moremo registrirati <1 /> podjetja. Poskusite znova pozneje.',
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
        'Zaradi tehnične težave ne moremo registrirati <1 /> podjetja. Poskusite znova pozneje.',
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

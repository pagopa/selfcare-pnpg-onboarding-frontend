export default {
  loadingText: 'Wir prüfen gerade deine Daten',
  chooseBusiness: {
    selectFromBusinessList: {
      title: 'Welches Unternehmen möchtest du registrieren?',
      subTitle:
        'Queste sono le imprese di cui risulti essere Legale Rappresentante. <1 /> Seleziona quella che vuoi registrare.',
    },
    selectReleatedBusiness: {
      title: 'Registriere dein Unternehmen',
      subTitle: 'Dies ist das Unternehmen, dessen Rechtsvertreter du bist. ',
    },
    registerBusiness: 'Unternehmen registrieren',
    registerBusinessByTaxCodeLink:
      'Non trovi la tua impresa? <1>Cercala tramite Codice Fiscale</1>',
  },
  addCompany: {
    title: 'Welches Unternehmen möchtest du registrieren?',
    subTitle: 'Gib die Steuernummer des Unternehmens ein, das du <1 />registrieren möchtest.',
    textfieldLabel: 'Steuernummer',
    forwardAction: 'Weiter',
  },
  insertBusinessEmail: {
    title: 'Wie lautet die PEC-Adresse des Unternehmens?',
    subTitle: 'Gib die PEC-Adresse des Unternehmens ein, das du registrieren möchtest.',
    pecLabel: 'PEC-Adresse',
  },
  insertBusinessData: {
    title: 'Gib die Daten deines Unternehmens ein.',
    subTitle:
      'Inserisci la ragione sociale e l’indirizzo PEC dell’impresa che vuoi <1 />registrare.',
    businessNameLabel: 'Firmenbezeichnung',
    pecEmailLabel: 'PEC-Adresse',
    invalidEmail: "Die eingegebene E-Mail-Adresse ist falsch",
    invalidBusinessName: 'Eine Firmenbezeichnung eingeben',
    backAction: 'Zurück',
    forwardAction: 'Weiter',
  },
  cannotRegisterBusiness: {
    title: 'Du kannst dieses <1/>Unternehmen nicht registrieren',
    description:
      'Dal tuo SPID non risulti essere Legale Rappresentante <1 />dell’impresa associata a questo Codice Fiscale. Puoi <3 />registrare solo le imprese di cui sei Legale Rappresentante.',
    close: 'Beenden',
  },
  alreadyOnboarded: {
    title: 'Unternehmen bereits registriert',
    description:
      'Questa impresa è già stata registrata. Accedi per leggere le <1 />notifiche e aggiungere altri utenti.',
    signIn: 'Anmelden',
  },
  genericError: {
    title: 'Es ist ein Fehler aufgetreten',
    message:
      'A causa di un problema tecnico, non riusciamo a registrare <1 /> l’impresa. Riprova più tardi.',
    close: 'Beenden',
  },
  invalidInputFormat: {
    title: 'Die Steuernummer/USt-IdNr. ist falsch',
    message: 'Gehe zurück, vergewissere dich, dass sie richtig ist und gib sie <1 /> erneut ein.',
    goBack: 'Zurück',
  },
  outcome: {
    success: {
      title: 'Unternehmen registriert!',
      description: 'Melde dich an, um die Zustellungen zu lesen und andere Benutzer hinzuzufügen.',
      signIn: 'Anmelden',
    },
    error: {
      title: 'Unternehmen nicht registriert',
      description:
        "Aufgrund eines technischen Problems können wir das Unternehmen <1 /> nicht registrieren. Bitte später erneut versuchen.",
      close: 'Beenden',
    },
  },
  app: {
    sessionModal: {
      title: 'Sitzung abgelaufen',
      message: 'Du wirst zur Anmeldeseite weitergeleitet...',
    },
  },
};

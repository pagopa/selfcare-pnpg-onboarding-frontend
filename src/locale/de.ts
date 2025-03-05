export default {
  loadingText: 'Wir prüfen gerade deine Daten',
  chooseBusiness: {
    selectFromBusinessList: {
      title: 'Welches Unternehmen möchtest du registrieren?',
      subTitle:
        'Dies sind die Unternehmen, deren gesetzlicher Vertreter du bist. <1 /> Wähle diejenige aus, die du registrieren möchtest.',
    },
    selectReleatedBusiness: {
      title: 'Registriere dein Unternehmen',
      subTitle: 'Dies ist das Unternehmen, dessen Rechtsvertreter du bist. ',
    },
    registerBusiness: 'Unternehmen registrieren',
    registerBusinessByTaxCodeLink:
      'Du findest dein Unternehmen nicht? <1>Suche es über die Steuernummer</1>',
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
      'Gib den Firmennamen und die PEC-Adresse des Unternehmens ein, das du <1 />registrieren möchtest.',
    businessNameLabel: 'Firmenname',
    pecEmailLabel: 'PEC-Adresse',
    invalidEmail: 'Die eingegebene E-Mail-Adresse ist falsch',
    invalidBusinessName: 'Eine Firmenbezeichnung eingeben',
    backAction: 'Zurück',
    forwardAction: 'Weiter',
  },
  cannotRegisterBusiness: {
    title: 'Du kannst dieses Unternehmen nicht registrieren <1/>',
    description:
      'Aus deiner SPID geht hervor, dass du nicht der gesetzliche Vertreter <1 />des mit dieser Steuernummer verbundenen Unternehmens bist. Du kannst <3 />nur Unternehmen registrieren, deren gesetzlicher Vertreter du bist.',
    close: 'Schließen',
  },
  alreadyOnboarded: {
    title: 'Unternehmen bereits registriert',
    description:
      'Dieses Unternehmen wurde bereits registriert. Melde dich an, um die <1 />Bescheide aufzurufen und weitere Benutzer hinzuzufügen.',
    signIn: 'Anmelden',
  },
  genericError: {
    title: 'Es ist ein Fehler aufgetreten',
    message:
      'Aufgrund eines technischen Problems können wir das Unternehmen nicht <1 /> registrieren. Versuche es später noch einmal.',
    close: 'Schließen',
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
        'Aufgrund eines technischen Problems können wir das Unternehmen <1 /> nicht registrieren. Bitte später erneut versuchen.',
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

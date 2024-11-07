export default {
  loadingText: 'Nous vérifions vos données',
  chooseBusiness: {
    selectFromBusinessList: {
      title: 'Quelle entreprise souhaitez-vous enregistrer ?',
      subTitle:
        'Queste sono le imprese di cui risulti essere Legale Rappresentante. <1 /> Seleziona quella che vuoi registrare.',
    },
    selectReleatedBusiness: {
      title: 'Enregistrez votre entreprise',
      subTitle: 'Il s’agit de l’entreprise dont vous êtes le Représentant Légal. ',
    },
    registerBusiness: 'Enregistrer entreprise',
    registerBusinessByTaxCodeLink:
      'Non trovi la tua impresa? <1>Cercala tramite Codice Fiscale</1>',
  },
  addCompany: {
    title: 'Quelle entreprise souhaitez-vous enregistrer ?',
    subTitle: 'Saisissez le Code Fiscal de l’entreprise que vous souhaitez <1 />enregistrer.',
    textfieldLabel: 'Code Fiscal',
    forwardAction: 'Continuer',
  },
  insertBusinessEmail: {
    title: 'Quelle est l’adresse PEC de l’entreprise ?',
    subTitle: 'Saisissez l’adresse PEC de l’entreprise que vous souhaitez enregistrer.',
    pecLabel: 'Adresse PEC',
  },
  insertBusinessData: {
    title: 'Saisissez les données de votre entreprise',
    subTitle:
      'Inserisci la ragione sociale e l’indirizzo PEC dell’impresa che vuoi <1 />registrare.',
    businessNameLabel: 'Raison sociale',
    pecEmailLabel: 'Adresse PEC',
    invalidEmail: "L’adresse mail saisie est incorrecte",
    invalidBusinessName: 'Saisissez une raison sociale',
    backAction: 'Retour',
    forwardAction: 'Continuer',
  },
  cannotRegisterBusiness: {
    title: 'Vous ne pouvez pas enregistrer <1/>cette entreprise',
    description:
      'Dal tuo SPID non risulti essere Legale Rappresentante <1 />dell’impresa associata a questo Codice Fiscale. Puoi <3 />registrare solo le imprese di cui sei Legale Rappresentante.',
    close: 'Fermer',
  },
  alreadyOnboarded: {
    title: 'Entreprise déjà enregistrée',
    description:
      'Questa impresa è già stata registrata. Accedi per leggere le <1 />notifiche e aggiungere altri utenti.',
    signIn: 'Se connecter',
  },
  genericError: {
    title: 'Une erreur s’est produite',
    message:
      'A causa di un problema tecnico, non riusciamo a registrare <1 /> l’impresa. Riprova più tardi.',
    close: 'Fermer',
  },
  invalidInputFormat: {
    title: 'Le Code Fiscal/N° de TVA saisi est incorrect',
    message: 'Revenez en arrière, assurez-vous qu’il est bien correct et saisissez-le à <1 /> nouveau.',
    goBack: 'Revenez en arrière',
  },
  outcome: {
    success: {
      title: 'Entreprise enregistrée !',
      description: 'Connectez-vous pour lire les notifications et ajouter d’autres utilisateurs.',
      signIn: 'Se connecter',
    },
    error: {
      title: 'Entreprise pas enregistrée',
      description:
        "En raison d’un problème technique, nous ne sommes pas en mesure d’enregistrer <1 />l’entreprise. Veuillez réessayer plus tard.",
      close: 'Fermer',
    },
  },
  app: {
    sessionModal: {
      title: 'Session expirée',
      message: 'Vous allez être redirigé vers la page de connexion...',
    },
  },
};

export default {
  loadingText: 'Nous vérifions vos données',
  chooseBusiness: {
    selectFromBusinessList: {
      title: 'Quelle entreprise souhaitez-vous enregistrer ?',
      subTitle:
        'Ce sont les entreprises dont vous êtes le représentant légal. <1 /> Sélectionnez celle que vous souhaitez enregistrer.',
    },
    selectReleatedBusiness: {
      title: 'Enregistrez votre entreprise',
      subTitle: 'Il s’agit de l’entreprise pour laquelle il s’agit d’un représentant légal. ',
    },
    registerBusiness: 'Enregistrer l’entreprise',
    registerBusinessByTaxCodeLink:
      'Vous ne trouvez pas votre entreprise ? <1>Recherchez-la via le code fiscal</1>',
  },
  addCompany: {
    title: 'Quelle entreprise souhaitez-vous enregistrer ?',
    subTitle: 'Entrez le code fiscal de la société que vous souhaitez <1 />enregistrer.',
    textfieldLabel: 'Numéro fiscal',
    forwardAction: 'Continuer',
  },
  insertBusinessEmail: {
    title: 'Quelle est l’adresse PEC de l’entreprise ?',
    subTitle: 'Entrez l’adresse PEC de l’entreprise que vous souhaitez enregistrer.',
    pecLabel: 'Adresse courriel certifié',
  },
  insertBusinessData: {
    title: 'Saisissez les données de votre entreprise',
    subTitle:
      'Entrez la raison sociale et l’adresse PEC de l’entreprise que vous souhaitez <1 />enregistrer.',
    businessNameLabel: 'Raison sociale',
    pecEmailLabel: 'Adresse courriel certifié',
    invalidEmail: 'Cette adresse mail est incorrecte.',
    invalidBusinessName: 'Entrer le nom de l’entreprise',
    backAction: 'Retour',
    forwardAction: 'Continuer',
  },
  cannotRegisterBusiness: {
    title: 'Vous ne pouvez pas enregistrer <1/>cette entreprise',
    description:
      'Votre SPID n’est pas un représentant légal <1 />de la société associée à ce code fiscal. Vous pouvez <3 />enregistrer uniquement les sociétés dont vous êtes le représentant légal.',
    close: 'Fermez',
  },
  alreadyOnboarded: {
    title: 'Entreprise déjà enregistrée',
    description:
      'Cette société a déjà été enregistrée. Connectez-vous pour lire les <1 />notifications et ajouter d’autres utilisateurs.',
    signIn: 'Se connecter',
  },
  genericError: {
    title: 'Une erreur est survenue',
    message:
      'En raison d’un problème technique, nous ne parvenons pas à enregistrer <1 /> l’entreprise. Veuillez réessayer plus tard.',
    close: 'Fermez',
  },
  invalidInputFormat: {
    title: 'Le code fiscal/numéro de TVA n’est pas correct',
    message: 'Revenez en arrière, assurez-vous qu’il est correct et saisissez-le de <1 /> nouveau.',
    goBack: 'Revenir en arrière',
  },
  outcome: {
    success: {
      title: 'Entreprise déjà enregistrée',
      description: 'Connectez-vous pour lire les notifications et ajouter d’autres utilisateurs.',
      signIn: 'Se connecter',
    },
    error: {
      title: 'Entreprise non enregistrée',
      description:
        'En raison d’un problème technique, nous ne parvenons pas à enregistrer <1 /> l’entreprise. Veuillez réessayer plus tard.',
      close: 'Fermez',
    },
  },
  app: {
    sessionModal: {
      title: 'Session expirée',
      message: 'Vous allez être redirigé vers la page de connexion...',
    },
  },
};

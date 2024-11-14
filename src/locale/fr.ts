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
      subTitle: 'Il s’agit de l’entreprise dont vous êtes le Représentant Légal. ',
    },
    registerBusiness: 'Enregistrer entreprise',
    registerBusinessByTaxCodeLink:
      'Vous ne trouvez pas votre entreprise ? <1>Recherchez-la via le code fiscal</1>',
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
      'Entrez la raison sociale et l’adresse PEC de l’entreprise que vous souhaitez <1 />enregistrer.',
    businessNameLabel: 'Raison sociale',
    pecEmailLabel: 'Adresse PEC',
    invalidEmail: 'L’adresse mail saisie est incorrecte',
    invalidBusinessName: 'Saisissez une raison sociale',
    backAction: 'Retour',
    forwardAction: 'Continuer',
  },
  cannotRegisterBusiness: {
    title: 'Vous ne pouvez pas enregistrer <1/>cette entreprise',
    description:
      'Votre SPID n’est pas un représentant légal <1 />de la société associée à ce code fiscal. Vous pouvez <3 />enregistrer uniquement les sociétés dont vous êtes le représentant légal.',
    close: 'Fermer',
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
    title: 'Le Code Fiscal/N° de TVA saisi est incorrect',
    message:
      'Revenez en arrière, assurez-vous qu’il est bien correct et saisissez-le à <1 /> nouveau.',
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
        'En raison d’un problème technique, nous ne sommes pas en mesure d’enregistrer <1 />l’entreprise. Veuillez réessayer plus tard.',
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

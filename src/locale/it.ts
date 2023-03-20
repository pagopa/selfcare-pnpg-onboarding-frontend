export default {
  loadingText: 'Stiamo verificando i tuoi dati',
  selectFromAgencyList: {
    title: 'Che impresa vuoi registrare?',
    description:
      'Queste sono le imprese di cui risulti essere Legale Rappresentante. <1 /> Seleziona quella che vuoi registrare.',
    registerAgency: 'Registra impresa',
  },
  selectInstitutionReleated: {
    title: 'Seleziona l’impresa',
    description:
      'Se hai accesso alle notifiche di più imprese, potrai modificare la tua scelta dopo avere effettuato l’accesso.',
    registerAgencyByTaxCodeLink: "Sei un Legale Rappresentante? <1>Registra un'altra impresa</1>",
    enter: 'Accedi',
  },
  addCompany: {
    title: 'Che impresa vuoi registrare?',
    description: 'Inserisci il Codice Fiscale/Partita IVA dell’impresa che vuoi <1/>registrare.',
    textfieldLabel: 'Codice Fiscale/Partita IVA',
    forwardAction: 'Continua',
  },
  alreadyOnboarded: {
    title: "L'impresa che hai scelto ha già aderito",
    description:
      "L'impresa selezionata ha già effettuato l'adesione. <1 />Puoi entrare nel portale.",
    signIn: 'Accedi',
  },
  institutionNotFound: {
    title: 'Nessuna impresa trovata',
    message: 'Dal tuo SPID non risulti essere Legale Rappresentante di <1 /> alcuna impresa.',
    close: 'Chiudi',
  },
  matchedButNotLR: {
    title:
      'Abbiamo riscontrato la tua azienda nel nostro database, ma non ne risulti il legale rappresentante. <1 />Contatta il Registro delle imprese per farti aggiungere.',
    registerNewAgency:
      'Sei il Legale Rappresentante di un’azienda? <1> Registra una nuova azienda </1>',
    backToAccess: 'Torna all’accesso',
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
        'A causa di un problema tecnico, non riusciamo a registrare <1 />la tua impresa. Riprova più tardi.',
      close: 'Chiudi',
    },
  },
  dashboard: {
    title: 'Panoramica',
    subTitle: 'Qui puoi vedere un riepilogo dei dati di {{businessName}}.',
    partyLogo: {
      upload: 'Carica il logo dell’azienda',
      modify: 'Modifica il logo dell’azienda',
      uploadError: {
        title: 'Caricamento non riuscito',
        description:
          'Il caricamento del logo non è andato a buon fine. Verifica che il formato e la dimensione siano corretti e caricalo di nuovo',
      },
      modifyError: {
        title: 'Caricamento non riuscito',
        description: 'Spiacenti, qualcosa è andato storto. Riprova più tardi',
      },
      info: 'Inserisci solo il logo della tua azienda. <1 />Sarai responsabile dell’inserimento di immagini diverse da quella indicata.',
      size: 'Dimensione massima 300 x <1 /> 300px - Formato .png',
    },
    infoOverview: {
      typology: 'Tipologia',
      category: 'Categoria',
      businessName: 'Ragione sociale',
      fiscalCode: 'Codice Fiscale',
      primaryPecEmail: 'Indirizzo PEC primario',
      registeredOffice: 'Sede legale',
    },
    sideMenu: {
      overview: 'Panoramica',
      users: 'Utenti',
      groups: 'Gruppi',
    },
    notificationArea: 'Area notifiche',
    productCard: {
      title: 'Vai alle <1 />notifiche',
    },
  },
  app: {
    sessionModal: {
      title: 'Sessione scaduta',
      message: 'Stai per essere rediretto alla pagina di login...',
    },
  },
};

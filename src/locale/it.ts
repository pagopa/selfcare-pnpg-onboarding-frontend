export default {
  loadingText: 'Stiamo verificando i tuoi dati',
  selectFromAgencyList: {
    title: 'A nome di quale azienda vuoi accedere?',
    description:
      'Queste sono le aziende di cui risulti essere Legale Rappresentante. <1 />Seleziona la società di cui vuoi visualizzare le notifiche su Piattaforma Notifiche.',
    registerAgency: 'Registra azienda',
  },
  selectInstitutionReleated: {
    title: 'Seleziona l’azienda',
    description:
      'Se operi per più enti, potrai modificare la tua scelta dopo aver effettuato l’accesso.',
    enter: 'Entra',
  },
  addCompany: {
    title: 'Aggiungi la tua impresa',
    description:
      'Inserisci il Codice Fiscale/Partita IVA dell’impresa con cui vuoi <1 />accedere a Piattaforma Notifiche',
    textfieldLabel: 'Codice Fiscale/Partita IVA',
    forwardAction: 'Continua',
  },
  alreadyOnboarded: {
    title: "L'Ente che hai scelto ha già aderito",
    description: "L'ente selezionato ha già effettuato l'adesione. <1 />Puoi entrare nel portale.",
    enter: 'Entra',
  },
  institutionNotFound: {
    title: 'Nessuna azienda trovata',
    message:
      'Per accedere alle notifiche, l’azienda deve essere registrata <1 />dal Legale Rappresentante.',
    registerNewAgency:
      'Sei il Legale Rappresentante di un’azienda? <1> Registra una nuova azienda </1>',
    backToAccess: 'Torna all’accesso',
  },
  outcome: {
    success: {
      title: 'La registrazione è avvenuta con <1 />successo',
      description:
        'La tua azienda è su Piattaforma Notifiche. Puoi entrare per <1 />vedere le notifiche e per gestire i permessi di altri utenti.',
      enterButton: 'Entra',
    },
    error: {
      title: 'Qualcosa è andato storto',
      description:
        'A causa di un errore del sistema non è possibile completare <1 />la procedura. Ti chiediamo di riprovare più tardi.',
      backToHome: 'Torna all’accesso',
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

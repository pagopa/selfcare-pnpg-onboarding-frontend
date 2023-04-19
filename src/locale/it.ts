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
    registerAgencyByTaxCodeLink:
      'Sei un Legale Rappresentante e non trovi la tua impresa? <1>Cercala tramite Codice Fiscale/Partita IVA</1>',
    enter: 'Accedi',
  },
  addCompany: {
    title: 'Che impresa vuoi registrare?',
    description: 'Inserisci il Codice Fiscale/Partita IVA dell’impresa che vuoi <1/>registrare.',
    textfieldLabel: 'Codice Fiscale/Partita IVA',
    forwardAction: 'Continua',
  },
  typedNotFound: {
    title: 'Nessuna impresa trovata',
    message:
      'Dal tuo SPID non risulti essere Legale Rappresentante <1 />dell’impresa che stavi cercando.',
    close: 'Chiudi',
  },
  alreadyOnboarded: {
    title: 'Impresa già registrata',
    description:
      'Questa impresa è già stata registrata. Accedi per leggere le <1/>notifiche e aggiungere altri utenti.',
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
  app: {
    sessionModal: {
      title: 'Sessione scaduta',
      message: 'Stai per essere rediretto alla pagina di login...',
    },
  },
};

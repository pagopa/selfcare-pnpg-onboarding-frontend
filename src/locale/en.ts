export default {
  loadingText: 'We are now checking your details',
  chooseBusiness: {
    selectFromBusinessList: {
      title: 'Which company do you want to register?',
      subTitle:
        'These are the companies for which you are the Legal Representative. <1 /> Select the one you want to record.',
    },
    selectReleatedBusiness: {
      title: 'Register your company',
      subTitle: 'This is the company for which you are a Legal Representative. ',
    },
    registerBusiness: 'Register company',
    registerBusinessByTaxCodeLink:
      "Can't find your company? <1>Search for it using the Fiscal Code </1>",
  },
  addCompany: {
    title: 'Which company do you want to register?',
    subTitle: 'Enter the Fiscal Code of the company you want to <1 />register.',
    textfieldLabel: 'Fiscal Code',
    forwardAction: 'Continue',
  },
  insertBusinessEmail: {
    title: 'What is the PEC address of the company?',
    subTitle: 'Enter the PEC of the company you want to register.',
    pecLabel: 'PEC',
  },
  insertBusinessData: {
    title: 'Enter your company details',
    subTitle: 'Enter the company name and PEC of the company you want to <1 />register.',
    businessNameLabel: 'Company name',
    pecEmailLabel: 'PEC',
    invalidEmail: 'The email address you entered is incorrect',
    invalidBusinessName: 'Please enter a company name',
    backAction: 'Back',
    forwardAction: 'Continue',
  },
  cannotRegisterBusiness: {
    title: 'You cannot register <1/>this company',
    description:
      'Your SPID does not show that you are the Legal Representative <1 />of the company associated with this Fiscal Code. You can <3 />only register the companies of which you are the Legal Representative.',
    close: 'Close',
  },
  alreadyOnboarded: {
    title: 'Company already registered',
    description:
      'This company has already been registered. Sign in to read <1 />notifications and add more users.',
    signIn: 'Log in',
  },
  genericError: {
    title: 'An error has occurred',
    message:
      'Due to a technical issue, we are unable to register <1 /> the company. Please come back later.',
    close: 'Close',
  },
  invalidInputFormat: {
    title: 'The Fiscal Code/VAT number is incorrect',
    message: 'Please go back, make sure it is correct and enter it <1 /> again.',
    goBack: 'Go back',
  },
  outcome: {
    success: {
      title: 'Company already registered!',
      description: 'Sign in to read notifications and add more users.',
      signIn: 'Log in',
    },
    error: {
      title: 'Company not registered',
      description:
        'Due to a technical issue, we are unable to register <1 /> the company. Please come back later.',
      close: 'Close',
    },
  },
  app: {
    sessionModal: {
      title: 'Session expired',
      message: 'You are about to be redirected to the login page...',
    },
  },
};

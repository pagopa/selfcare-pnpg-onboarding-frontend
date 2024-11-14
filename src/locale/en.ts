export default {
  loadingText: 'We are verifying your data',
  chooseBusiness: {
    selectFromBusinessList: {
      title: 'Which company do you want to register?',
      subTitle:
        'These are the companies for which you are the Legal Representative. <1 /> Select the one you want to record.',
    },
    selectReleatedBusiness: {
      title: 'Register your company',
      subTitle: 'This is the company for which you are a Legal representative. ',
    },
    registerBusiness: 'Register company',
    registerBusinessByTaxCodeLink:
      "Can't find your company? <1>Search for it using the Fiscal Code </1>",
  },
  addCompany: {
    title: 'Which company do you want to register?',
    subTitle: 'Enter the tax code for the company you want to <1 />register.',
    textfieldLabel: 'Tax code',
    forwardAction: 'Continue',
  },
  insertBusinessEmail: {
    title: 'What is the PEC address of the company?',
    subTitle: 'Enter the PEC address for the company you want to register.',
    pecLabel: 'PEC address',
  },
  insertBusinessData: {
    title: 'Enter the data for your company',
    subTitle: 'Enter the company name and PEC of the company you want to <1 />register.',
    businessNameLabel: 'Company name',
    pecEmailLabel: 'PEC address',
    invalidEmail: 'The entered email address is not correct',
    invalidBusinessName: 'Enter a company name',
    backAction: 'Go back',
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
    signIn: 'Login',
  },
  genericError: {
    title: 'An error has occurred',
    message:
      'Due to a technical issue, we are unable to register <1 /> the company. Please come back later.',
    close: 'Close',
  },
  invalidInputFormat: {
    title: 'The tax code/VAT no. is not correct',
    message: 'Go back, make sure it is correct or enter it <1 /> again.',
    goBack: 'Go back',
  },
  outcome: {
    success: {
      title: 'Company registered!',
      description: 'Log in to read the notifications and add other users.',
      signIn: 'Login',
    },
    error: {
      title: 'Company not registered',
      description:
        'Due to a technical problem, we cannot register <1 />the company. Try again later.',
      close: 'Close',
    },
  },
  app: {
    sessionModal: {
      title: 'Session expired',
      message: 'You are being redirected to the login page...',
    },
  },
};

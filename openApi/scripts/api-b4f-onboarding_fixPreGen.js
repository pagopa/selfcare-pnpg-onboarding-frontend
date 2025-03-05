const regexReplace = require('regex-replace');

regexReplace(
  /("format": *"uri",[\s]*"type": "string")/gi,
  '"$ref": "#/definitions/InstitutionOnboardingResourceArray"',
  'openApi/generated-onboarding/onboarding-swagger20.json',
  { fileContentsOnly: true }
);
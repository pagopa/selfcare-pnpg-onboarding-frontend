const regexReplace = require('regex-replace');

regexReplace('array', 'Array<string>', 'src/api/generated/b4f-onboarding-pnpg/requestTypes.ts', {
  fileContentsOnly: true,
});

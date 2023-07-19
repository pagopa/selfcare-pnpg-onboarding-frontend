const regexReplace = require('regex-replace');

regexReplace('array', 'Array<string>', 'src/api/generated/b4f-onboarding-pnpg/requestTypes.ts', {
  fileContentsOnly: true,
});

regexReplace(
  `body\\?\\: File`,
  `body: string | Blob`,
  'src/api/generated/b4f-onboarding-pnpg/requestTypes.ts',
  {
    fileContentsOnly: true,
  }
);

regexReplace(`body_`, `body`, 'src/api/generated/b4f-onboarding-pnpg/client.ts', {
  fileContentsOnly: true,
});

const regexReplace = require('regex-replace');

regexReplace(
  `body\\?\\: File`,
  `body: string | Blob`,
  'src/api/generated/b4f-onboarding/requestTypes.ts',
  {
    fileContentsOnly: true,
  }
);

regexReplace(`body_`, `body`, 'src/api/generated/b4f-onboarding/client.ts', {
  fileContentsOnly: true,
});

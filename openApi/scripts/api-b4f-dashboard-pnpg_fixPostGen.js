const regexReplace = require('regex-replace');

regexReplace(
  'readonly sort\\?: array;',
  'readonly sort?: Array<string>;',
  'src/api/generated/b4f-dashboard-pnpg/requestTypes.ts',
  { fileContentsOnly: true }
);

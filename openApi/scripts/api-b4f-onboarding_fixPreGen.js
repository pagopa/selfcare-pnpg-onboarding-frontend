const regexReplace = require('regex-replace');
const fs = require('fs');
const path = require('path');

// Correzione per i riferimenti URI
regexReplace(
  /("format": *"uri",[\s]*"type": "string")/gi,
  '"$ref": "#/definitions/InstitutionOnboardingResourceArray"',
  'openApi/generated-onboarding/onboarding-swagger20.json',
  { fileContentsOnly: true }
);

// Correzione per i body dei file
const swaggerPath = path.resolve(__dirname, '../generated-onboarding/onboarding-swagger20.json');
const openApiPath = path.resolve(__dirname, '../onboarding-api-docs.json');
console.log('Fixing body parameters in Swagger definition at', swaggerPath);
console.log('Fixing body parameters in OpenAPI definition at', openApiPath);

try {
  // Fix del file Swagger
  const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

  // Correggi tutti i parametri body nelle definizioni di percorso
  Object.entries(swagger.paths).forEach(([pathKey, pathItem]) => {
    Object.entries(pathItem).forEach(([method, operation]) => {
      if (operation.parameters) {
        operation.parameters.forEach((param) => {
          if (param.name === 'body' && param.in === 'body') {
            // Assicurati che il parametro body abbia uno schema valido
            if (!param.schema || Object.keys(param.schema).length === 0) {
              console.log(`Adding missing schema for body in ${method.toUpperCase()} ${pathKey}`);
              param.schema = {
                type: 'object',
                properties: {
                  contract: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              };
            }
          }
        });
      }
    });
  });

  // Scrivi il file modificato
  fs.writeFileSync(swaggerPath, JSON.stringify(swagger, null, 2));
  console.log('Successfully fixed body parameters in Swagger definition');
} catch (error) {
  console.error('Error processing Swagger file:', error);
}

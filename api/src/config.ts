// Shared configuration
export const env = {
  AZURE_COSMOS_ENDPOINT: process.env.AZURE_COSMOS_ENDPOINT || '',
  AZURE_COSMOS_KEY: process.env.AZURE_COSMOS_KEY || '',
  AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT || '',
  AZURE_OPENAI_KEY: process.env.AZURE_OPENAI_KEY || '',
  AZURE_OPENAI_DEPLOYMENT: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4.1-mini',
};

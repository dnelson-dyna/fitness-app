import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  // Server
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().url(),

  // Cosmos DB
  COSMOS_ENDPOINT: z.string().url(),
  COSMOS_KEY: z.string(),
  COSMOS_DATABASE_NAME: z.string().default('fitnessapp'),
  COSMOS_CONTAINER_WORKOUTS: z.string().default('workouts'),
  COSMOS_CONTAINER_MEALS: z.string().default('meals'),
  COSMOS_CONTAINER_USERS: z.string().default('users'),
  COSMOS_CONTAINER_PROGRESS: z.string().default('progress'),

  // Azure OpenAI
  AZURE_OPENAI_ENDPOINT: z.string().url(),
  AZURE_OPENAI_KEY: z.string(),
  AZURE_OPENAI_DEPLOYMENT_NAME: z.string().default('gpt-4'),
  AZURE_OPENAI_API_VERSION: z.string().default('2024-08-01-preview'),

  // Azure AD B2C
  AZURE_AD_B2C_TENANT_NAME: z.string(),
  AZURE_AD_B2C_CLIENT_ID: z.string(),
  AZURE_AD_B2C_CLIENT_SECRET: z.string().optional(),
  AZURE_AD_B2C_POLICY_NAME: z.string().default('B2C_1_signupsignin'),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();

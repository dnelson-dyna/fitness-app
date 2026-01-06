# Phase 2: Azure Backend Integration - Setup Guide

## Overview

Phase 2 integrates your FitFlow frontend with Azure cloud services:
- **Azure OpenAI** for AI-powered workout and meal plan generation
- **Azure Cosmos DB** for data persistence
- **Azure AD B2C** for user authentication
- **Express API** backend running on Azure App Service

## Prerequisites

### 1. Azure Account
- Create an Azure account at [portal.azure.com](https://portal.azure.com)
- You'll need an active subscription

### 2. Azure CLI (Optional but recommended)
```bash
# Install Azure CLI
# Windows: Download from https://aka.ms/installazurecliwindows
# Or use winget:
winget install -e --id Microsoft.AzureCLI

# Login
az login
```

## Azure Services Setup

### 1. Create Azure OpenAI Resource

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for "Azure OpenAI" → Create
3. Fill in details:
   - **Resource Group:** Create new (e.g., `fitness-app-rg`)
   - **Region:** Choose available region (e.g., East US)
   - **Name:** `fitness-app-openai`
   - **Pricing Tier:** Standard S0

4. After creation, go to resource:
   - Click "Keys and Endpoint"
   - Copy **KEY 1** and **Endpoint**

5. Deploy a model:
   - Go to "Model deployments" → "Manage Deployments"
   - Click "Create new deployment"
   - Model: `gpt-4` or `gpt-35-turbo`
   - Deployment name: `gpt-4`

### 2. Create Azure Cosmos DB

1. Search for "Azure Cosmos DB" → Create
2. Select **API:** Azure Cosmos DB for NoSQL
3. Fill in details:
   - **Resource Group:** Use same as above
   - **Account Name:** `fitness-app-cosmos`
   - **Location:** Same as OpenAI
   - **Capacity mode:** Serverless (for development)

4. After creation:
   - Go to "Keys"
   - Copy **URI** and **PRIMARY KEY**

### 3. Create Azure AD B2C Tenant (Optional - for authentication)

1. Search for "Azure AD B2C" → Create
2. Select "Create a new Azure AD B2C Tenant"
3. Fill in details:
   - **Organization name:** FitFlow
   - **Initial domain name:** fitflow (+ `.onmicrosoft.com`)
   - **Country/Region:** Your country

4. After creation:
   - Register your application
   - Create sign-up/sign-in user flow
   - Copy **Tenant Name**, **Client ID**, **Client Secret**

## Backend Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create `.env` file in the `server/` directory:

```bash
# Copy example file
copy .env.example .env
```

Edit `.env` with your Azure credentials:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Azure Cosmos DB
COSMOS_ENDPOINT=https://fitness-app-cosmos.documents.azure.com:443/
COSMOS_KEY=your-cosmos-primary-key-here
COSMOS_DATABASE_NAME=fitnessapp
COSMOS_CONTAINER_WORKOUTS=workouts
COSMOS_CONTAINER_MEALS=meals
COSMOS_CONTAINER_USERS=users
COSMOS_CONTAINER_PROGRESS=progress

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://fitness-app-openai.openai.azure.com/
AZURE_OPENAI_KEY=your-openai-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
AZURE_OPENAI_API_VERSION=2024-08-01-preview

# Azure AD B2C (Optional for now)
AZURE_AD_B2C_TENANT_NAME=fitflow
AZURE_AD_B2C_CLIENT_ID=your-client-id
AZURE_AD_B2C_CLIENT_SECRET=your-client-secret
AZURE_AD_B2C_POLICY_NAME=B2C_1_signupsignin
```

### 3. Start Backend Server

```bash
# Development mode with hot reload
npm run dev

# Or build and run production
npm run build
npm start
```

You should see:
```
✅ Connected to Cosmos DB: fitnessapp
✅ Container ready: workouts
✅ Container ready: meals
✅ Container ready: users
✅ Container ready: progress
✅ Server running on port 3000
✅ Environment: development
✅ Frontend URL: http://localhost:5173

🚀 API ready at http://localhost:3000/api
```

## API Endpoints

### Health Check
```http
GET /api/health
```

### Workouts
```http
POST /api/workouts/generate
GET /api/workouts
GET /api/workouts/:id
PATCH /api/workouts/:id
POST /api/workouts/:id/complete
DELETE /api/workouts/:id
```

### Meal Plans
```http
POST /api/meals/generate
GET /api/meals
GET /api/meals/:id
DELETE /api/meals/:id
```

## Frontend Integration

### Update API Configuration

Edit `src/services/api.ts` in the frontend:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
```

Create `.env` in root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Test API Connection

1. Keep backend server running (`npm run dev` in `server/`)
2. Start frontend (`npm run dev` in root)
3. Open browser to frontend URL
4. Generate a workout - it should now use Azure OpenAI!

## Testing

### Test Backend API

```bash
# Health check
curl http://localhost:3000/api/health

# Generate workout (requires backend running)
curl -X POST http://localhost:3000/api/workouts/generate \
  -H "Content-Type: application/json" \
  -d '{
    "bodyArea": "chest",
    "fitnessGoal": "muscle",
    "difficulty": "intermediate"
  }'
```

### Test with Frontend

1. Generate a workout in the UI
2. Check browser Network tab - you should see calls to `localhost:3000`
3. Check backend console - you should see Azure OpenAI API calls
4. Check Azure Portal - Cosmos DB should show new documents

## Cost Monitoring

### Estimated Costs (Pay-as-you-go)

- **Azure OpenAI (GPT-4):** ~$0.03 per 1K tokens
  - Average workout generation: ~500 tokens = $0.015
  - Average meal plan: ~800 tokens = $0.024

- **Cosmos DB (Serverless):** ~$0.25 per million RU
  - Average operation: 10 RU
  - 1000 operations = ~$0.0025

- **Storage:** ~$0.25 per GB/month

**Total estimated cost for development:** < $5/month

### Monitor Costs

1. Azure Portal → "Cost Management + Billing"
2. Set up budget alerts
3. Monitor usage in each service

## Troubleshooting

### Backend won't start

**Error: "Invalid environment variables"**
- Check `.env` file exists in `server/` directory
- Verify all required variables are set
- Check for typos in variable names

**Error: "Failed to initialize Cosmos DB"**
- Verify `COSMOS_ENDPOINT` and `COSMOS_KEY` are correct
- Check Azure Portal - Cosmos DB resource must be running
- Ensure Cosmos DB allows connections from your IP

**Error: "OpenAI API error"**
- Verify `AZURE_OPENAI_KEY` is correct
- Check deployment name matches (`gpt-4` or `gpt-35-turbo`)
- Ensure model is deployed in Azure Portal

### CORS Errors

If you see CORS errors in browser:
- Check `FRONTEND_URL` in backend `.env` matches your frontend URL
- Restart backend server after changing environment variables

### TypeScript Errors

```bash
cd server
npm run build
```

Fix any type errors before running.

## Next Steps

1. ✅ Backend API running locally
2. ✅ Azure services connected
3. ⏭️ Update frontend to use real API
4. ⏭️ Deploy to Azure App Service
5. ⏭️ Set up CI/CD pipeline
6. ⏭️ Add production authentication

## Project Structure

```
fitness-app/
├── server/                    # Backend API
│   ├── src/
│   │   ├── config/           # Azure service configs
│   │   ├── controllers/      # API controllers
│   │   ├── services/         # Business logic
│   │   ├── models/           # Type definitions
│   │   ├── middleware/       # Auth, error handling
│   │   ├── routes/           # API routes
│   │   └── index.ts          # Server entry point
│   ├── .env                  # Environment variables (git-ignored)
│   ├── .env.example          # Template
│   └── package.json
└── src/                      # Frontend (existing)
```

## Resources

- [Azure OpenAI Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [Azure Cosmos DB Docs](https://learn.microsoft.com/en-us/azure/cosmos-db/)
- [Azure AD B2C Docs](https://learn.microsoft.com/en-us/azure/active-directory-b2c/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

**Status:** Backend ready for local development
**Next:** Frontend integration and Azure deployment

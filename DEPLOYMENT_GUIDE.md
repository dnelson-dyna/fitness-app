# Deployment Guide - Azure Static Web Apps with API

## Summary

Your Visual Studio Enterprise subscription has App Service quota limitations. The best alternative is **Azure Static Web Apps**, which:
- ✅ Hosts both frontend AND backend (API) in one resource
- ✅ Free tier available with no quota issues
- ✅ Automatic GitHub Actions CI/CD
- ✅ Built-in global CDN
- ✅ Custom domains and SSL included

## Deployment Steps

### Option 1: Deploy via Azure Portal (Easiest)

1. **Go to Azure Portal**: https://portal.azure.com

2. **Create Static Web App**:
   - Search for "Static Web Apps"
   - Click "Create"
   - **Subscription**: Visual Studio Enterprise Subscription
   - **Resource Group**: fitness-app-rg
   - **Name**: fitness-app
   - **Region**: East US 2
   - **Plan Type**: Free
   
3. **Connect to GitHub**:
   - Sign in to GitHub
   - Select your repository (or create one first - see below)
   - **Build Presets**: React
   - **App location**: /
   - **API location**: server
   - **Output location**: dist

4. **Azure will automatically**:
   - Create a GitHub Action workflow
   - Deploy your app
   - Provide a public URL

### Option 2: Create GitHub Repository First

```powershell
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - FitFlow app"

# Create repo on GitHub and push
# Then use Portal method above
```

### Option 3: Deploy Using Azure CLI

```powershell
# Create Static Web App
az staticwebapp create \
  --name fitness-app \
  --resource-group fitness-app-rg \
  --location "East US 2" \
  --sku Free \
  --branch main \
  --app-location "/" \
  --api-location "server" \
  --output-location "dist"
```

## Environment Variables

After deployment, configure environment variables in Azure Portal:

**Static Web App → Configuration → Environment Variables**:

```
COSMOS_ENDPOINT=<your-cosmos-endpoint>
COSMOS_KEY=<your-cosmos-key>
COSMOS_DATABASE_NAME=fitnessapp
COSMOS_CONTAINER_WORKOUTS=workouts
COSMOS_CONTAINER_MEALS=meals
COSMOS_CONTAINER_USERS=users
COSMOS_CONTAINER_PROGRESS=progress
AZURE_OPENAI_ENDPOINT=<your-openai-endpoint>
AZURE_OPENAI_KEY=<your-openai-key>
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4.1-mini
AZURE_OPENAI_API_VERSION=2024-08-01-preview
NODE_ENV=production
```

## Alternative: Request Quota Increase

If you prefer App Service:

1. Go to Azure Portal → Subscriptions → Usage + quotas
2. Search for "App Service Plan"
3. Request quota increase for Basic tier
4. Wait for approval (usually 24-48 hours)

## Current Status

✅ Backend built successfully
✅ Frontend ready to deploy
✅ Deployment files created
✅ Azure resources (Cosmos DB, OpenAI) ready
⏳ Waiting for deployment method selection

## Recommended Next Step

**Use Azure Static Web Apps** - it's the fastest path to production with your current subscription.

Would you like to:
1. Create GitHub repo and deploy via Portal (recommended)
2. Deploy via VS Code Azure extension
3. Request App Service quota increase and wait

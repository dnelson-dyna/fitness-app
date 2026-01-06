# GitHub Repository Setup

## ✅ Git repository initialized and committed

Your code is ready to push to GitHub!

## Next Steps:

### 1. Create GitHub Repository

A browser window should open to https://github.com/new

Fill in:
- **Repository name**: `fitness-app` (or `fitflow`)
- **Description**: AI-powered fitness app with Azure OpenAI and Cosmos DB
- **Visibility**: Public or Private (your choice)
- **DO NOT** initialize with README, .gitignore, or license (we already have these)

Click "Create repository"

### 2. Push Your Code

After creating the repository, GitHub will show you commands. Use these:

```powershell
# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/fitness-app.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### 3. Deploy to Azure Static Web Apps

Once code is pushed to GitHub:

**Option A: Via Azure Portal** (Recommended)
1. Go to https://portal.azure.com
2. Search for "Static Web Apps" → Create
3. Fill in:
   - **Subscription**: Visual Studio Enterprise Subscription
   - **Resource Group**: fitness-app-rg
   - **Name**: fitness-app
   - **Region**: East US 2
   - **Plan Type**: Free
4. **GitHub Details**:
   - Sign in to GitHub
   - **Organization**: Your GitHub username
   - **Repository**: fitness-app
   - **Branch**: main
5. **Build Details**:
   - **Build Presets**: React
   - **App location**: /
   - **Api location**: server
   - **Output location**: dist
6. Click "Review + create" → "Create"

**Option B: Via Azure CLI**
```powershell
# After pushing to GitHub
az staticwebapp create \
  --name fitness-app \
  --resource-group fitness-app-rg \
  --location "East US 2" \
  --sku Free \
  --source https://github.com/YOUR_USERNAME/fitness-app \
  --branch main \
  --app-location "/" \
  --api-location "server" \
  --output-location "dist" \
  --token YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
```

### 4. Configure Environment Variables

After deployment, add environment variables in Azure Portal:

1. Go to your Static Web App
2. Click **Configuration** → **Application settings**
3. Add each variable:

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

4. Click **Save**

### 5. Test Your Deployment

After deployment completes:
1. Azure will provide a URL like `https://fitness-app-xxx.azurestaticapps.net`
2. Visit the URL
3. Test workout and meal generation
4. Verify data saves to Cosmos DB

## Troubleshooting

**Build fails**: Check GitHub Actions tab in your repo for errors
**API not working**: Verify environment variables are set in Azure
**Timeout errors**: Wait 2-3 minutes after deployment for all services to sync

## What Happens Next

Azure Static Web Apps will:
- ✅ Automatically create a GitHub Actions workflow
- ✅ Build and deploy your app on every push to main
- ✅ Provide a production URL with SSL
- ✅ Deploy preview environments for PRs
- ✅ Handle both frontend and API automatically

---

**Current Status**: 
- ✅ Code committed to local git
- ⏳ Waiting for GitHub repository creation
- ⏳ Waiting for push to GitHub
- ⏳ Waiting for Azure deployment

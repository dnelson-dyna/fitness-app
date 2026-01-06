# Phase 2 Setup - Next Steps

## Current Status - Updated January 6, 2026

✅ **Phase 2 - COMPLETE:**
- Azure Cosmos DB created successfully in West US 2
  - Account: fitness-app-cosmos-1767729895
  - Database: fitnessapp
  - Containers: workouts, meals, users, progress
- Azure OpenAI resource created with GPT-4.1-mini deployment
- Backend code complete in `server/` directory
- Environment file configured at `server/.env`
- Azure OpenAI credentials added and VERIFIED ✅
- Backend dependencies installed ✅
- Backend server running successfully ✅
- Frontend connected to backend API ✅
- **API Tests Passing:**
  - ✅ Workout generation with Azure OpenAI
  - ✅ Meal plan generation with Azure OpenAI
  - ✅ Data persistence to Cosmos DB

🎯 **Ready for Phase 3: Production Deployment**

---

## Phase 3: Production Deployment

Now that your app is working locally with Azure services, here are your deployment options:

### Option A: Deploy to Azure (Recommended)

#### 1. Deploy Backend to Azure App Service

**Create App Service:**
```bash
az webapp create \
  --name fitness-app-api \
  --resource-group fitness-app-rg \
  --plan fitness-app-plan \
  --runtime "NODE:18-lts"
```

**Configure Environment Variables:**
- Go to Azure Portal → App Service → Configuration
- Add all variables from `server/.env`
- Enable CORS for your frontend domain

**Deploy Code:**
```bash
cd server
npm run build
# Deploy via VS Code Azure extension or GitHub Actions
```

#### 2. Deploy Frontend to Azure Static Web Apps

**Create Static Web App:**
```bash
az staticwebapp create \
  --name fitness-app-frontend \
  --resource-group fitness-app-rg \
  --location "West US 2"
```

**Update Frontend API URL:**
- Create `.env.production` in root:
  ```env
  VITE_API_BASE_URL=https://fitness-app-api.azurewebsites.net/api
  ```

**Deploy:**
- Connect to GitHub repository
- Azure will auto-deploy on push to main branch

#### 3. Set Up CI/CD with GitHub Actions

**Create `.github/workflows/deploy.yml`:**
```yaml
name: Deploy FitFlow

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to App Service
        uses: azure/webapps-deploy@v2
        with:
          app-name: fitness-app-api
          
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and Deploy Static Web App
        uses: Azure/static-web-apps-deploy@v1
```

### Option B: Continue Local Development

Keep developing locally with:
- Frontend: `npm run dev` (port 5173)
- Backend: `cd server && npm run dev` (port 3000)
- Already connected to production Azure services (OpenAI + Cosmos DB)

---

## Immediate Next Steps

### 1. Test Full User Flow

Try these in the browser at http://localhost:5173:

**Workouts:**
- Navigate to /workouts
- Select body area, goal, difficulty
- Generate workout (will call Azure OpenAI)
- Check off exercises
- Verify workout saves to Cosmos DB

**Meal Plans:**
- Navigate to /meals
- Select goal and dietary preference
- Generate meal plan (will call Azure OpenAI)
- View detailed nutritional info
- Verify meal plan saves to Cosmos DB

**Progress:**
- Navigate to /progress
- Complete a few workouts
- Check stats dashboard
- Verify data persists

### 2. Add Authentication (Optional)

**Azure AD B2C Setup:**
1. Create user flows in Azure Portal
2. Update `server/.env` with B2C credentials
3. Update `server/src/middleware/auth.ts` to validate tokens
4. Add login/signup UI to frontend

### 3. Enhance Features

**Workout Tracking:**
- Add workout history page
- Filter by date, body area, goal
- Export workout data

**Meal Planning:**
- Add shopping list generator
- Meal prep instructions
- Calorie tracking over time

**Progress Analytics:**
- Charts for progress over time
- Goal setting and tracking
- Achievement badges

### 4. Deploy to Production

When ready:
1. Push code to GitHub
2. Set up Azure resources (App Service + Static Web Apps)
3. Configure environment variables in Azure
4. Enable CI/CD
5. Add custom domain (optional)

---

## Current Environment Configuration

Your `server/.env` is configured with:

```
✅ Cosmos DB Endpoint: https://fitness-app-cosmos-1767729895.documents.azure.com:443/
✅ Cosmos DB Key: Configured
✅ Database: fitnessapp
✅ Containers: workouts, meals, users, progress

⏳ Azure OpenAI Endpoint: Needs your resource URL
⏳ Azure OpenAI Key: Needs KEY 1 from portal
✅ Deployment Name: gpt-4.1-mini
```

---

## Architecture

```
┌─────────────┐
│   Browser   │  http://localhost:5173
│  (React)    │
└──────┬──────┘
       │ HTTP/REST
       ↓
┌─────────────────┐
│  Express API    │  http://localhost:3000
│  (Node.js)      │
└────┬────────┬───┘
     │        │
     │        └────────────────┐
     ↓                         ↓
┌────────────┐        ┌─────────────────┐
│  Azure     │        │   Azure         │
│  OpenAI    │        │  Cosmos DB      │
│ (GPT-4.1)  │        │  (West US 2)    │
└────────────┘        └─────────────────┘
```

---

## Cost Monitoring

### Current Usage (Development):
- Cosmos DB Serverless: ~$0.25 per million RU (~$0.01/day for light testing)
- Azure OpenAI GPT-4.1-mini: ~$0.01-0.05 per workout/meal generation
- **Estimated: < $5/month during development**

### Monitor in Azure Portal:
1. Go to "Cost Management + Billing"
2. View by resource group: `fitness-app-rg`
3. Set up budget alerts (recommended: $10/month for development)

---

## What's Next

After backend is running:

### Phase 3: Full Integration
- Connect all frontend pages to real API
- Implement user authentication flow
- Add error handling and loading states
- Test all features end-to-end

### Phase 4: Deployment
- Deploy backend to Azure App Service
- Deploy frontend to Azure Static Web Apps
- Configure production environment variables
- Set up CI/CD with GitHub Actions

---

## Support Resources

- **Phase 2 Setup Guide:** `PHASE2_SETUP.md`
- **Architecture Overview:** `PHASE2_SUMMARY.md`
- **Azure OpenAI Docs:** https://learn.microsoft.com/en-us/azure/ai-services/openai/
- **Azure Cosmos DB Docs:** https://learn.microsoft.com/en-us/azure/cosmos-db/

---

**Ready to proceed?** Complete Step 1 (add OpenAI credentials) and Step 2 (npm install), then start the backend server!

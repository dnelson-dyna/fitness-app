# FitFlow - Code Context Documentation

**Last Updated:** January 7, 2026  
**Build:** Production deployment on Azure Static Web Apps  
**Live URL:** https://blue-rock-0765eaa0f.1.azurestaticapps.net

## Overview

FitFlow is an AI-powered fitness application that generates personalized workout plans and meal plans using Azure OpenAI (GPT-4.1-mini). The application features protein preference selection, meal regeneration, and stores all data in Azure Cosmos DB.

## Tech Stack

### Frontend
- **Framework:** React 18.2 with TypeScript 5.9
- **Build Tool:** Vite 7.2
- **Styling:** Tailwind CSS 3.4
- **Routing:** React Router DOM 7.1
- **State Management:** React hooks (useState, useEffect)
- **UI Components:** Custom components with Tailwind

### Backend (Production)
- **Platform:** Azure Functions v4 (Node.js 20)
- **Runtime:** TypeScript compiled to CommonJS
- **AI Service:** Azure OpenAI Service (GPT-4.1-mini deployment)
- **Database:** Azure Cosmos DB (NoSQL, Serverless)
- **Validation:** Zod schema validation

### Backend (Local Development)
- **Framework:** Express.js server on Node 18
- **Location:** `server/` directory (localhost:3000)

### Deployment & Infrastructure
- **Hosting:** Azure Static Web Apps
- **CI/CD:** GitHub Actions
- **Region:** East US
- **Resource Group:** fitness-app-rg

## Project Structure

```
fitness-app/
├── src/                          # Frontend React application
│   ├── components/
│   │   ├── Common/              # Reusable UI components
│   │   │   ├── Button.tsx       # Button with variants (primary, secondary, ghost)
│   │   │   ├── Card.tsx
│   │   │   └── Loading.tsx
│   │   ├── Layout/              # App layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx       # Includes build number
│   │   │   └── Navigation.tsx
│   │   ├── MealPlans/           # Meal planning features
│   │   │   ├── MealCard.tsx     # Shows meal with regenerate/protein swap
│   │   │   ├── MealPlan.tsx     # Full meal plan display
│   │   │   └── MealSelector.tsx # Dietary & goal selection
│   │   └── Workouts/            # Workout features
│   │       ├── WorkoutCard.tsx
│   │       ├── WorkoutPlan.tsx
│   │       └── ExerciseItem.tsx
│   ├── hooks/                   # Custom React hooks
│   │   ├── useMealPlans.ts      # Meal plan state management
│   │   ├── useWorkouts.ts       # Workout state management
│   │   └── useProgress.ts
│   ├── services/                # API integration layer
│   │   ├── api.ts               # Base API client with dynamic URL
│   │   ├── mealService.ts       # Meal generation & management
│   │   ├── workoutService.ts    # Workout generation
│   │   └── aiService.ts
│   ├── types/                   # TypeScript type definitions
│   │   ├── fitness.ts
│   │   ├── meal.ts              # MealPlan, Meal, Ingredient, ProteinPreference
│   │   ├── workout.ts           # Workout, Exercise, WorkoutBodyArea
│   │   └── user.ts
│   ├── pages/                   # Route components
│   │   ├── Home.tsx
│   │   ├── MealPlansPage.tsx
│   │   ├── WorkoutsPage.tsx
│   │   └── ProgressPage.tsx
│   └── App.tsx                  # Main app component with routing
├── api/                         # Azure Functions (Production API)
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts           # Environment variable mapping
│   │   │   ├── openai.ts        # Azure OpenAI client
│   │   │   └── cosmosdb.ts      # Cosmos DB client
│   │   ├── functions/
│   │   │   ├── generateMeal.ts  # POST /api/meals/generate
│   │   │   └── generateWorkout.ts # POST /api/workouts/generate
│   │   ├── models/
│   │   │   └── types.ts         # Shared type definitions
│   │   ├── health.ts            # GET /api/health endpoint
│   │   └── index.ts             # Entry point - imports all functions
│   ├── dist/                    # Compiled JavaScript (deployed)
│   ├── host.json                # Azure Functions runtime config
│   ├── package.json             # Dependencies & build scripts
│   └── tsconfig.json            # TypeScript compiler config
├── server/                      # Local Express server (development)
│   └── src/
│       ├── config/              # Same structure as api/
│       ├── services/
│       └── index.ts
├── public/
│   └── favicon.svg              # Pink gradient 'F' logo
├── .github/workflows/
│   └── azure-static-web-apps-blue-rock-0765eaa0f.yml
├── index.html                   # Entry HTML (title: FitFlow)
├── .env.production              # Production environment config
└── package.json                 # Frontend dependencies

```

## Key Features

### 1. AI-Powered Meal Plans
- **Generation:** Uses Azure OpenAI GPT-4.1-mini to create personalized meal plans
- **Customization:** 
  - Fitness goals: toning, muscle, cardio, weight loss, strength
  - Dietary preferences: standard, vegetarian, keto, high protein, gluten-free, dairy-free
  - Target calories
- **Protein Selection:** Users can choose specific proteins (chicken, beef, fish, salmon, etc.)
- **Meal Regeneration:** Generate new meals on demand with "Generate New Meal" button
- **Protein Swapping:** Change protein source for individual meals
- **Mock Fallback:** Uses intelligent mock data when API unavailable

### 2. AI-Powered Workouts
- **Generation:** Creates workout plans based on:
  - Body areas: chest, back, shoulders, arms, legs, core, full body
  - Difficulty: beginner, intermediate, advanced
  - Fitness goals
- **Exercise Details:** Sets, reps, duration, descriptions, form tips
- **Calorie Estimation:** Estimated calories burned per workout

### 3. Data Persistence
- **Storage:** Azure Cosmos DB with containers for:
  - `meals` (partitioned by userId)
  - `workouts` (partitioned by userId)
  - `users` (partitioned by id)
  - `progress` (partitioned by userId)
- **Automatic:** All generated plans saved to database

## Architecture

### Frontend Architecture

```
User Request (e.g., Generate Meal Plan)
    ↓
Page Component (MealPlansPage.tsx)
    ↓
Custom Hook (useMealPlans.ts)
    ↓
Service Layer (mealService.ts)
    ↓
API Client (api.ts) → API_BASE_URL
    ↓
    ├── Development: http://localhost:3000/api
    └── Production: /api (relative path)
```

### API Architecture (Azure Functions)

```
HTTP Request → Azure Static Web Apps
    ↓
Azure Functions Runtime (Node 20)
    ↓
Function Handler (generateMeal.ts / generateWorkout.ts)
    ↓
    ├── Zod Schema Validation
    ├── Azure OpenAI Client → GPT-4.1-mini
    │       ↓
    │   JSON Response (meal/workout structure)
    ├── Add IDs with randomUUID()
    └── Cosmos DB Client → Save to database
    ↓
Return JSON Response to Frontend
```

### Data Flow Example: Meal Generation

1. **User Action:** Clicks "Generate Meal Plan" with preferences
2. **Frontend:** `useMealPlans.generateMealPlan()` called
3. **Service:** `mealService.generateMealPlan()` sends POST to `/api/meals/generate`
4. **Azure Function:** `generateMeal` handler receives request
5. **Validation:** Zod validates `fitnessGoal`, `dietaryPreference`, `targetCalories`
6. **AI Generation:** Azure OpenAI generates meal plan with specific ingredients
7. **Data Transform:** Add UUIDs to meals and ingredients
8. **Storage:** Save to Cosmos DB `meals` container
9. **Response:** Return complete meal plan to frontend
10. **UI Update:** Display meal plan with regenerate/swap options

## API Endpoints

### Production API (Azure Functions)

**Base URL:** `/api` (relative to https://blue-rock-0765eaa0f.1.azurestaticapps.net)

#### `GET /api/health`
Health check endpoint
- **Response:** `{ status: "ok", timestamp: "...", message: "FitFlow API is running" }`

#### `POST /api/meals/generate`
Generate AI-powered meal plan
- **Request Body:**
  ```json
  {
    "fitnessGoal": "muscle" | "toning" | "cardio" | "weightloss" | "strength",
    "dietaryPreference": "standard" | "vegetarian" | "keto" | "highprotein" | "glutenfree" | "dairyfree",
    "targetCalories": 2000
  }
  ```
- **Response:** Full `MealPlan` object with meals, ingredients, macros

#### `POST /api/workouts/generate`
Generate AI-powered workout plan
- **Request Body:**
  ```json
  {
    "bodyArea": "chest" | "back" | "shoulders" | "arms" | "legs" | "core" | "fullbody",
    "fitnessGoal": "muscle" | "toning" | "cardio" | "weightloss" | "strength",
    "difficulty": "beginner" | "intermediate" | "advanced"
  }
  ```
- **Response:** Full `Workout` object with exercises

## Type System

### Core Types

#### MealPlanBodyArea
```typescript
'lowcarb' | 'balanced' | 'highprotein' | 'vegetarian' | 'keto'
```

#### WorkoutBodyArea
```typescript
'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'fullbody'
```

#### ProteinPreference
```typescript
'any' | 'chicken' | 'beef' | 'fish' | 'salmon' | 'tuna' | 'pork' | 'turkey' | 'eggs' | 'tofu' | 'tempeh' | 'legumes'
```

#### FitnessGoal
```typescript
'toning' | 'muscle' | 'cardio' | 'weightloss' | 'strength'
```

#### DietaryPreference
```typescript
'standard' | 'vegetarian' | 'keto' | 'highprotein' | 'glutenfree' | 'dairyfree'
```

### Key Interfaces

```typescript
interface MealPlan {
  id: string;
  userId: string;
  name: string;
  fitnessGoal: FitnessGoal;
  dietaryPreference: DietaryPreference;
  meals: Meal[];
  totalCalories: number;
  macros: Macros;
  createdAt: Date;
  updatedAt: Date;
}

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  macros: Macros;
  ingredients: Ingredient[];
  instructions: string;
  prepTime?: number;
}

interface Ingredient {
  id: string;
  name: string;        // e.g., "Chicken Breast", "Salmon", "Tofu"
  amount: string;      // e.g., "6 oz", "1 cup"
  calories: number;
}

interface Workout {
  id: string;
  userId: string;
  name: string;
  bodyArea: WorkoutBodyArea;
  fitnessGoal: FitnessGoal;
  exercises: Exercise[];
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  caloriesBurned: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Environment Variables

### Azure Static Web Apps Configuration

Located in Azure Portal → Static Web App → Settings → Environment variables

```bash
# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://fitness-app-openai.openai.azure.com/
AZURE_OPENAI_KEY=<your-key>
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4.1-mini
AZURE_OPENAI_API_VERSION=2024-08-01-preview

# Cosmos DB
COSMOS_ENDPOINT=https://fitness-app-cosmos-1767729895.documents.azure.com:443/
COSMOS_KEY=<your-key>
COSMOS_DATABASE_NAME=fitnessapp
COSMOS_CONTAINER_MEALS=meals
COSMOS_CONTAINER_WORKOUTS=workouts
COSMOS_CONTAINER_USERS=users
COSMOS_CONTAINER_PROGRESS=progress

# Node Environment
NODE_ENV=production
```

### Local Development (.env)

```bash
# Frontend (in root .env)
VITE_API_BASE_URL=http://localhost:3000/api

# Backend (server/.env)
AZURE_OPENAI_ENDPOINT=https://fitness-app-openai.openai.azure.com/
AZURE_OPENAI_KEY=<your-key>
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4.1-mini
AZURE_OPENAI_API_VERSION=2024-08-01-preview
AZURE_COSMOS_ENDPOINT=https://fitness-app-cosmos-1767729895.documents.azure.com:443/
AZURE_COSMOS_KEY=<your-key>
```

### Production Frontend (.env.production)

```bash
VITE_API_BASE_URL=/api
```

## Development Workflow

### Local Development

1. **Start Backend (Express Server):**
   ```bash
   cd server
   npm install
   npm run dev
   # Runs on http://localhost:3000
   ```

2. **Start Frontend:**
   ```bash
   npm install
   npm run dev
   # Runs on http://localhost:5173
   ```

3. **Frontend calls:** `http://localhost:3000/api`

### Production Deployment

1. **Trigger:** Push to `main` branch on GitHub
2. **GitHub Actions Workflow:** `.github/workflows/azure-static-web-apps-blue-rock-0765eaa0f.yml`
3. **Steps:**
   - Checkout code
   - Setup Node.js 20
   - Build API: `cd api && npm ci && npm run build`
   - Build frontend: `npm run build`
   - Deploy to Azure Static Web Apps
4. **Deployment Target:**
   - Frontend: `dist/` folder
   - API: `api/` folder (with compiled `dist/` inside)
5. **Live URL:** https://blue-rock-0765eaa0f.1.azurestaticapps.net

## Important Files

### Configuration Files

- **`index.html`** - HTML entry point, sets title "FitFlow", favicon
- **`vite.config.ts`** - Vite build configuration
- **`tailwind.config.js`** - Tailwind CSS theme (pink primary color)
- **`tsconfig.json`** - TypeScript compiler options
- **`.env.production`** - Production environment variables
- **`api/host.json`** - Azure Functions runtime v2.0 configuration
- **`api/.funcignore`** - Excludes src/, includes dist/ for deployment
- **`api/tsconfig.json`** - API TypeScript config (CommonJS, ES2022)

### Entry Points

- **Frontend:** `src/main.tsx` → `App.tsx`
- **API:** `api/src/index.ts` (imports all functions)
- **Local Server:** `server/src/index.ts`

### Key Service Files

- **`src/services/api.ts`** - Dynamic API URL based on environment
- **`src/services/mealService.ts`** - Meal generation, regeneration, protein swapping
- **`src/services/workoutService.ts`** - Workout generation
- **`api/src/config/openai.ts`** - Azure OpenAI client with prompt templates
- **`api/src/config/cosmosdb.ts`** - Cosmos DB client with auto-init

## AI Prompt Templates

### Meal Plan Generation Prompt

**System:** "You are a certified nutritionist creating personalized meal plans. Generate balanced, nutritious meal plans in JSON format."

**User:**
```
Create a daily meal plan for {fitnessGoal} following a {dietaryPreference} diet.
Target calories: {targetCalories}

Return JSON:
{
  "name": "Plan name",
  "totalCalories": 2000,
  "macros": { "protein": 150, "carbs": 200, "fats": 60 },
  "meals": [
    {
      "type": "breakfast",
      "name": "Meal name",
      "calories": 500,
      "macros": { "protein": 30, "carbs": 50, "fats": 15 },
      "ingredients": [
        { "name": "Ingredient", "amount": "1 cup", "calories": 100 }
      ],
      "instructions": "Cooking instructions",
      "prepTime": 15
    }
  ]
}
```

### Workout Plan Generation Prompt

**System:** "You are an expert fitness trainer creating personalized workout plans. Generate detailed, safe, and effective workouts in JSON format."

**User:**
```
Create a {difficulty} workout plan for {bodyArea} focused on {fitnessGoal}.

Return JSON:
{
  "name": "Workout name",
  "description": "Brief description",
  "estimatedDuration": 45,
  "caloriesBurned": 300,
  "exercises": [
    {
      "name": "Exercise name",
      "sets": 3,
      "reps": 12,
      "duration": 30,
      "description": "How to perform",
      "formTips": ["tip1", "tip2"]
    }
  ]
}
```

## Current State & Features

### ✅ Working Features

1. **Meal Plan Generation**
   - AI-generated meals with Azure OpenAI
   - Specific protein sources (not generic "Protein Source")
   - Dietary preference filtering
   - Calorie targeting
   - Mock fallback when API unavailable

2. **Meal Customization**
   - Protein preference selection (12 options)
   - "Generate New Meal" for individual meals
   - "Change Protein" for protein swapping
   - Real-time macro recalculation

3. **Workout Generation**
   - AI-generated workouts
   - Body area targeting
   - Difficulty levels
   - Exercise details with form tips

4. **UI/UX**
   - Responsive design (mobile/desktop)
   - Loading states for async operations
   - Pink gradient branding (#E91E63 → #F06292)
   - Build number in footer

5. **Infrastructure**
   - Azure Static Web Apps hosting
   - Azure Functions API
   - Azure OpenAI integration
   - Cosmos DB persistence
   - GitHub Actions CI/CD

### 🚧 Mock/Limited Features

- Meal regeneration (uses mock data, not backend endpoint)
- Protein swapping (uses mock data)
- Progress tracking (UI only)
- User authentication (placeholder userId: "dev-user-123")

### 🎯 Potential Next Features

1. **Backend Endpoints:**
   - `POST /api/meals/regenerate` - Regenerate single meal
   - `POST /api/meals/swap-protein` - Swap protein in meal
   - `GET /api/meals` - Retrieve user's saved meal plans
   - `GET /api/workouts` - Retrieve user's saved workouts

2. **User Features:**
   - User authentication (Azure AD B2C)
   - User profile management
   - Preferences saving
   - Meal/workout history

3. **Progress Tracking:**
   - Weight tracking over time
   - Workout completion tracking
   - Calorie burn tracking
   - Progress charts (Chart.js or Recharts)

4. **Social Features:**
   - Share meal plans
   - Share workout plans
   - Community features

5. **Enhanced AI:**
   - Meal plan variations
   - Grocery list generation
   - Recipe substitutions
   - Workout progression plans

## Debugging & Troubleshooting

### Console Logs

The app includes debug logging for API URL resolution:
- Check browser console for: "Using VITE_API_BASE_URL: /api"
- "Production mode: using /api" or "Development mode: using localhost:3000"

### Build Number

Footer displays current build number and environment:
- Format: "Build YYYYMMDD (Production/Development)"
- Confirms deployment version

### Common Issues

1. **404 on API calls:** Check `.env.production` has `VITE_API_BASE_URL=/api`
2. **Functions not deployed:** Verify `api/.funcignore` doesn't exclude `dist/`
3. **TypeScript errors:** Run `npm run build` in both root and `api/` directories
4. **Missing environment variables:** Check Azure Portal → Static Web App → Environment variables

## Git Repository

- **URL:** https://github.com/dnelson-dyna/fitness-app
- **Branch:** main
- **GitHub Actions:** https://github.com/dnelson-dyna/fitness-app/actions

## Azure Resources

- **Resource Group:** fitness-app-rg
- **Region:** East US
- **Static Web App:** blue-rock-0765eaa0f
- **Azure OpenAI:** fitness-app-openai (gpt-4.1-mini deployment)
- **Cosmos DB:** fitness-app-cosmos-1767729895 (Serverless)

---

**For LLM Context:** This application is a production-ready AI fitness app using Azure services. The frontend is React/TypeScript/Tailwind, backend is Azure Functions with TypeScript, AI is Azure OpenAI GPT-4.1-mini, and database is Cosmos DB. All code follows TypeScript strict mode and uses modern React patterns (hooks, functional components). The app generates personalized meal plans and workouts based on user preferences.

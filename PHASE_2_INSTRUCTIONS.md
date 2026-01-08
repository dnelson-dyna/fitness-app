# FitFlow Phase 1: Auth0 Integration & User Management

**Last Updated:** January 8, 2026  
**Phase Focus:** User authentication, profile management, and meal/workout tracking foundation

---

## Phase 1 Overview

This phase implements:
1. ✅ **Auth0 OAuth integration** (Google login)
2. **User profile management** with personal data (age, height, weight, target weight)
3. **Weight tracking** with timestamps and weight trend visualization
4. **Enhanced meal generation** with detailed step-by-step instructions + substitutions
5. **New meal selection flow** - user selects goals/preferences, then generates 3 meal options
6. **Meal tracking** - mark meals as consumed with timestamps
7. **Updated progress page** - meal tracking + weight trends

---

## Prerequisites

### Completed Setup
- ✅ Auth0 tenant: `fitflow-dev.us.auth0.com`
- ✅ Google OAuth credentials configured in Auth0
- ✅ Auth0 Application created with correct redirect URIs

### Technologies
- React 18.2 + TypeScript
- Auth0 React SDK (`@auth0/auth0-react`)
- Azure Functions (Node.js 20) for API endpoints
- Cosmos DB for data persistence
- Azure OpenAI GPT-4.1-mini for AI features

### Important URLs
- **Production:** https://blue-rock-0765eaa0f.1.azurestaticapps.net
- **Local Dev Frontend:** http://localhost:5173
- **Local Dev API:** http://localhost:3000/api
- **GitHub:** https://github.com/dnelson-dyna/fitness-app

---

## STEP 1: Install Auth0 React SDK

### Task 1.1: Add package to frontend

**Location:** Root of project (fitness-app/)

**Command:**
```bash
npm install @auth0/auth0-react
```

**Verify:** Check `package.json` has `@auth0/auth0-react` in dependencies

---

## STEP 2: Create Auth0 Provider Wrapper

### Task 2.1: Create `src/providers/Auth0Provider.tsx`

**File Path:** `src/providers/Auth0Provider.tsx`

**Content:**
```typescript
import React, { ReactNode } from 'react';
import { Auth0Provider as Auth0ProviderOrig } from '@auth0/auth0-react';

interface Auth0ProviderProps {
  children: ReactNode;
}

export const Auth0Provider: React.FC<Auth0ProviderProps> = ({ children }) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN || 'fitflow-dev.us.auth0.com';
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || '';
  
  // Determine redirect URI based on environment
  const redirectUri = 
    window.location.origin + '/callback' || 
    (import.meta.env.DEV 
      ? 'http://localhost:5173/callback'
      : 'https://blue-rock-0765eaa0f.1.azurestaticapps.net/callback'
    );

  return (
    <Auth0ProviderOrig
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        scope: 'openid profile email'
      }}
    >
      {children}
    </Auth0ProviderOrig>
  );
};
```

**Notes:**
- Environment variables loaded from `.env` and `.env.production`
- Scopes: `openid profile email` (standard for user info)

---

## STEP 3: Add Environment Variables

### Task 3.1: Update `.env` (Local Development)

**File Path:** `.env`

**Add:**
```
VITE_AUTH0_DOMAIN=fitflow-dev.us.auth0.com
VITE_AUTH0_CLIENT_ID=<YOUR_AUTH0_CLIENT_ID>
```

**Where to get Client ID:**
- Auth0 Dashboard → Applications → FitFlow React App → Settings → Client ID

### Task 3.2: Update `.env.production` (Production)

**File Path:** `.env.production`

**Add:**
```
VITE_AUTH0_DOMAIN=fitflow-dev.us.auth0.com
VITE_AUTH0_CLIENT_ID=<YOUR_AUTH0_CLIENT_ID>
```

**Note:** Same values as `.env` for now

---

## STEP 4: Update Main App Component

### Task 4.1: Wrap App with Auth0Provider

**File Path:** `src/main.tsx`

**Current Code:**
```typescript
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Updated Code:**
```typescript
import { Auth0Provider } from './providers/Auth0Provider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider>
      <App />
    </Auth0Provider>
  </React.StrictMode>,
)
```

---

## STEP 5: Create Auth0 Custom Hook

### Task 5.1: Create `src/hooks/useAuth0Context.ts`

**File Path:** `src/hooks/useAuth0Context.ts`

**Content:**
```typescript
import { useAuth0 } from '@auth0/auth0-react';

export const useAuth0Context = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();

  return {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    userId: user?.sub, // Auth0 unique user ID
  };
};
```

**Purpose:** Simplified hook for accessing Auth0 auth state throughout app

---

## STEP 6: Create Callback Route Component

### Task 6.1: Create `src/pages/Callback.tsx`

**File Path:** `src/pages/Callback.tsx`

**Content:**
```typescript
import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export const Callback: React.FC = () => {
  const { isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      navigate('/');
    }
  }, [isLoading, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 to-pink-200">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <p className="mt-4 text-white text-lg">Logging in...</p>
      </div>
    </div>
  );
};
```

---

## STEP 7: Update App Router

### Task 7.1: Add Callback Route to `src/App.tsx`

**File Path:** `src/App.tsx`

**Add import:**
```typescript
import { Callback } from './pages/Callback';
```

**Add to router (in Routes):**
```typescript
<Route path="/callback" element={<Callback />} />
```

**Make sure Home page is still accessible:** It should handle both authenticated and unauthenticated users

---

## STEP 8: Update Header/Navigation Component

### Task 8.1: Create Login/Logout Buttons in `src/components/Layout/Header.tsx`

**Pseudo-code:**
```typescript
- Import useAuth0Context hook
- If NOT authenticated: Show "Sign In with Google" button → calls loginWithRedirect()
- If authenticated: 
  - Show user name/avatar
  - Show "Sign Out" button → calls logout()
  - Link to user profile settings
```

**Keep existing:** Navigation to Home, MealPlans, Workouts, Progress pages

---

## STEP 9: Create User Profile Database Schema

### Task 9.1: Create user profile type in `src/types/user.ts`

**File Path:** `src/types/user.ts`

**Content:**
```typescript
export interface UserProfile {
  id: string; // Auth0 user ID (sub)
  email: string;
  name?: string;
  picture?: string;
  
  // Personal metrics
  age?: number;
  height?: number; // in cm
  weight?: number; // current weight in kg
  targetWeight?: number; // goal weight in kg
  
  // Preferences (used for meal/workout generation)
  fitnessGoal?: 'muscle' | 'toning' | 'cardio' | 'weightloss' | 'strength';
  dietaryPreference?: 'standard' | 'vegetarian' | 'keto' | 'highprotein' | 'glutenfree' | 'dairyfree';
  preferredProteins?: string[]; // e.g., ['chicken', 'beef', 'tofu']
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface WeightCheckIn {
  id: string;
  userId: string;
  weight: number; // kg
  recordedAt: Date;
  notes?: string;
}
```

---

## STEP 10: Create User Profile API Endpoints

### Task 10.1: Create backend endpoint `api/src/functions/getUserProfile.ts`

**Endpoint:** `GET /api/users/{userId}/profile`

**Functionality:**
- Takes userId from route
- Validates Auth0 token
- Returns user profile from Cosmos DB `users` container
- If user doesn't exist: Return 404 or initialize default profile

**Returns:**
```json
{
  "id": "google-oauth2|...",
  "email": "user@gmail.com",
  "name": "John Doe",
  "age": 30,
  "height": 180,
  "weight": 85,
  "targetWeight": 80,
  "fitnessGoal": "weightloss",
  "dietaryPreference": "highprotein",
  "createdAt": "2026-01-08T...",
  "updatedAt": "2026-01-08T..."
}
```

### Task 10.2: Create backend endpoint `api/src/functions/updateUserProfile.ts`

**Endpoint:** `PUT /api/users/{userId}/profile`

**Request Body:**
```json
{
  "age": 30,
  "height": 180,
  "weight": 85,
  "targetWeight": 80,
  "fitnessGoal": "weightloss",
  "dietaryPreference": "highprotein",
  "preferredProteins": ["chicken", "fish"]
}
```

**Functionality:**
- Validates Auth0 token matches userId
- Updates user profile in Cosmos DB
- Returns updated profile

### Task 10.3: Create backend endpoint `api/src/functions/createWeightCheckIn.ts`

**Endpoint:** `POST /api/users/{userId}/weight-checkin`

**Request Body:**
```json
{
  "weight": 84.5,
  "notes": "after workout"
}
```

**Functionality:**
- Creates weight check-in record in Cosmos DB `weightCheckins` container
- Automatically sets timestamp
- Returns created check-in

### Task 10.4: Create backend endpoint `api/src/functions/getWeightHistory.ts`

**Endpoint:** `GET /api/users/{userId}/weight-history?days=30`

**Functionality:**
- Returns weight check-ins from last N days
- Used for trend visualization

**Returns:**
```json
[
  { "id": "...", "weight": 85, "recordedAt": "2026-01-08T..." },
  { "id": "...", "weight": 84.8, "recordedAt": "2026-01-07T..." }
]
```

---

## STEP 11: Create User Profile Service

### Task 11.1: Create `src/services/userService.ts`

**File Path:** `src/services/userService.ts`

**Functionality:**
```typescript
- getUserProfile(userId: string) → Promise<UserProfile>
- updateUserProfile(userId: string, profile: Partial<UserProfile>) → Promise<UserProfile>
- addWeightCheckIn(userId: string, weight: number, notes?: string) → Promise<WeightCheckIn>
- getWeightHistory(userId: string, days?: number) → Promise<WeightCheckIn[]>
```

**Uses:** `api.ts` client to call endpoints

---

## STEP 12: Create User Profile Settings Page

### Task 12.1: Create `src/pages/SettingsPage.tsx`

**File Path:** `src/pages/SettingsPage.tsx`

**Components:**
1. **Profile Section:**
   - Name, Email (read-only from Auth0)
   - Age, Height, Weight, Target Weight (editable)
   - Save button

2. **Preferences Section:**
   - Fitness Goal (dropdown)
   - Dietary Preference (dropdown)
   - Preferred Proteins (multi-select)
   - Save button

3. **Weight Check-In Section:**
   - Input field for current weight
   - Optional notes
   - "Log Weight" button
   - Display last 5 check-ins

**Behavior:**
- Load user profile on mount
- Show loading state while fetching
- Handle errors gracefully

---

## STEP 13: Update Navigation to include Settings

### Task 13.1: Add Settings link to `src/components/Layout/Navigation.tsx`

**Add route:** `/settings` → SettingsPage

**Visibility:** Only show if user is authenticated

---

## STEP 14: Enhance Meal Generation Prompt

### Task 14.1: Update AI prompt in `api/src/config/openai.ts`

**Current Prompt Issues:**
- Doesn't include detailed cooking instructions
- Doesn't suggest substitutions
- Only generates 1 meal

**New Prompt Template:**
```
You are a certified nutritionist creating personalized meal plans.

User Profile:
- Fitness Goal: {fitnessGoal}
- Dietary Preference: {dietaryPreference}
- Target Calories: {targetCalories}
- Protein Preference: {proteinPreference}

Generate 3 DIFFERENT meal options for {mealType} (breakfast/lunch/dinner/snack).

Return JSON with this structure for EACH meal:
{
  "name": "Meal name",
  "mealType": "breakfast|lunch|dinner|snack",
  "calories": 500,
  "macros": { "protein": 30, "carbs": 50, "fats": 15 },
  "ingredients": [
    { "name": "Ingredient", "amount": "1 cup", "calories": 100 }
  ],
  "instructions": [
    "Step 1: Prepare...",
    "Step 2: Cook...",
    "Step 3: Assemble...",
    "Step 4: Serve..."
  ],
  "prepTime": 15,
  "substitutions": [
    {
      "ingredient": "Chicken",
      "alternatives": ["Turkey", "Tofu", "Tempeh"],
      "notes": "Similar protein content"
    }
  ]
}

Return as array: [meal1, meal2, meal3]
```

---

## STEP 15: Create Meal Generation Options Endpoint

### Task 15.1: Create `api/src/functions/generateMealOptions.ts`

**Endpoint:** `POST /api/meals/options`

**Request Body:**
```json
{
  "userId": "google-oauth2|...",
  "mealType": "breakfast|lunch|dinner|snack",
  "fitnessGoal": "muscle|toning|cardio|weightloss|strength",
  "dietaryPreference": "standard|vegetarian|keto|highprotein|glutenfree|dairyfree",
  "proteinPreference": "chicken",
  "targetCalories": 500
}
```

**Functionality:**
- Calls Azure OpenAI with enhanced prompt
- Generates 3 different meals with instructions + substitutions
- Returns array of 3 meal options
- Does NOT save to DB yet (user selects first)

**Returns:**
```json
{
  "meals": [
    { meal object with instructions & substitutions },
    { meal object with instructions & substitutions },
    { meal object with instructions & substitutions }
  ]
}
```

---

## STEP 16: Create Meal Tracking Types

### Task 16.1: Update `src/types/meal.ts`

**Add types:**
```typescript
export interface MealLogEntry {
  id: string;
  userId: string;
  meal: Meal;
  consumedAt: Date;
  notes?: string;
}

export interface DailyMealLog {
  date: string; // YYYY-MM-DD
  meals: MealLogEntry[];
  totalCalories: number;
  totalMacros: {
    protein: number;
    carbs: number;
    fats: number;
  };
}
```

---

## STEP 17: Create Meal Logging Endpoints

### Task 17.1: Create `api/src/functions/logMeal.ts`

**Endpoint:** `POST /api/meals/log`

**Request Body:**
```json
{
  "userId": "google-oauth2|...",
  "mealId": "meal-uuid",
  "meal": { /* full meal object */ },
  "consumedAt": "2026-01-08T12:30:00Z",
  "notes": "optional notes"
}
```

**Functionality:**
- Creates entry in Cosmos DB `mealLogs` container
- Used for progress tracking

### Task 17.2: Create `api/src/functions/getDailyMealLog.ts`

**Endpoint:** `GET /api/meals/log/{userId}?date=2026-01-08`

**Functionality:**
- Returns all meals logged for a specific date
- Calculates totals
- Used by Progress page

---

## STEP 18: Create Meal Selection UI Component

### Task 18.1: Create `src/components/MealPlans/MealSelector.tsx` (Enhanced)

**Current:** Already exists but needs enhancement

**Update to:**
1. Step 1: Select fitness goal, dietary preference, protein preference, target calories
2. Step 2: Select meal type (breakfast, lunch, dinner, snack)
3. Step 3: Generate 3 meal options (calls new endpoint)
4. Step 4: Display 3 options with "Select This Meal" buttons
5. If "More Options" clicked: Generate 3 new options

**State Management:**
- Step tracking
- Current 3 options displayed
- Loading state for generation

---

## STEP 19: Create Meal Details Modal

### Task 19.1: Create `src/components/MealPlans/MealDetailsModal.tsx`

**Display when meal is selected:**
- Full meal details
- **Detailed Instructions** (new):
  - Step-by-step cooking instructions
  - Prep time
  - Cook time
  - Difficulty level (optional)
- **Substitution Suggestions** (new):
  - Alternative ingredients
  - Why they work (notes)
  - Macro adjustments if applicable
- Buttons:
  - "Log This Meal" → Adds to today's meal log
  - "Save for Later" → Saves to user's saved meals
  - "Close"

---

## STEP 20: Update Progress Page

### Task 20.1: Update `src/pages/ProgressPage.tsx`

**Add sections:**

1. **Today's Meals:**
   - List meals logged today
   - Calories consumed / target
   - Macro breakdown
   - "Add Meal" button

2. **Meal History:**
   - Calendar view or date picker
   - View meals from previous days

3. **Weight Trend Chart:**
   - Line chart of weight over time (last 30 days)
   - Trend line
   - Current weight vs target weight
   - "Log Weight" button

4. **Weight Goal Progress:**
   - Current weight
   - Target weight
   - Pounds/KG to goal
   - Progress percentage

5. **Existing Workout Section:**
   - Keep existing workout tracking

---

## STEP 21: Create Meal Service Enhancement

### Task 21.1: Update `src/services/mealService.ts`

**Add functions:**
```typescript
- generateMealOptions(params) → calls /api/meals/options
- logMeal(userId, meal, consumedAt) → calls /api/meals/log
- getDailyMealLog(userId, date) → calls /api/meals/log/{userId}?date=
- saveMealForLater(userId, meal) → saves to user's meal library
```

---

## STEP 22: Add Cosmos DB Containers

### Task 22.1: Ensure these containers exist in Cosmos DB

**Containers needed:**
1. `users` - User profiles (partitioned by `/id`)
2. `weightCheckins` - Weight logs (partitioned by `/userId`)
3. `mealLogs` - Meal consumption logs (partitioned by `/userId`)
4. `meals` - Generated meals (partitioned by `/userId`) [existing]
5. `workouts` - Generated workouts (partitioned by `/userId`) [existing]

**If not existing:** Create via Azure Portal or script

---

## Testing Checklist

After implementation, test these scenarios:

- [ ] User can sign in with Google OAuth
- [ ] Redirect to /callback, then redirects to home
- [ ] User profile is created in Cosmos DB on first login
- [ ] User can access Settings page (only if authenticated)
- [ ] User can update profile (age, height, weight, preferences)
- [ ] User can log weight check-in
- [ ] Weight check-ins display on progress page
- [ ] User can start meal selection flow
- [ ] Generate meal options returns 3 different meals
- [ ] Meals display with detailed instructions + substitutions
- [ ] User can select a meal and log it
- [ ] Progress page shows today's meals + calories
- [ ] Progress page shows weight trend chart
- [ ] User can sign out
- [ ] After sign out, user is redirected to home (unauthenticated)

---

## Deployment Notes

### Environment Variables Required (Azure Static Web App)
```
VITE_AUTH0_DOMAIN=fitflow-dev.us.auth0.com
VITE_AUTH0_CLIENT_ID=<YOUR_CLIENT_ID>
```

**Set via:**
Azure Portal → Static Web App → Configuration → Application settings

### API Environment Variables (Azure Functions)
```
AZURE_OPENAI_ENDPOINT=<your endpoint>
AZURE_OPENAI_API_KEY=<your key>
COSMOS_DB_CONNECTION_STRING=<your connection string>
```

---

## Phase 2 Complete When:

✅ All 22 tasks completed  
✅ All tests in Testing Checklist pass  
✅ Deployed to production and tested  
✅ Auth0 OAuth login working  
✅ User profiles functional  
✅ Meal selection + tracking working  
✅ Weight tracking functional  

---

## Next Phase (Phase 3)

- Workout completion tracking on Progress page
- Calorie/macro analytics dashboard
- Grocery list generation from meals
- Meal plan export (PDF)
- Social sharing features
- Progress photo tracking

---

**Created:** January 8, 2026  
**Status:** Ready for Claude Code implementation
# FitFlow Phase 2: New Meal Selection Flow with 3-Option Generation

**Last Updated:** January 9, 2026  
**Phase Focus:** Replace meal generation with new single-meal, multi-option flow

---

## Phase 2 Overview

This phase **replaces** the existing full-day meal plan generation with a new smart meal selection system:

### What Changes:
- ❌ **REMOVE:** `/api/meals/generate` endpoint (full day meal plan)
- ✅ **ADD:** `/api/meals/options` endpoint (generates 3 meal options for selected meal type)
- ✅ **NEW:** Detailed step-by-step cooking instructions (AI-generated)
- ✅ **NEW:** Substitution suggestions for each ingredient
- ✅ **NEW:** Meal tracking with timestamps on Progress page
- ✅ **NEW:** Daily calorie target reminder on each meal option

### User Flow:
```
1. User enters MealPlans page
   ↓
2. Select Fitness Goal → Dietary Preference → Protein Preference → Target Daily Calories
   ↓
3. Select Meal Type (Breakfast/Lunch/Dinner/Snack)
   ↓
4. System generates 3 DIFFERENT meal options (varying calories: low/medium/high)
   ↓
5. User clicks a meal to view:
   - Full meal details
   - Step-by-step instructions
   - Substitution suggestions
   ↓
6. User clicks "Make It" → Logs meal to today's log
   OR clicks "More Options" → Generates 3 new options
```

---

## Data Type Updates

### STEP 1: Update Meal Type in `src/types/meal.ts`

Add these fields to the existing `Meal` interface:

```typescript
export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  macros: Macros;
  ingredients: Ingredient[];
  
  // NEW FIELDS:
  instructions: MealInstruction[];      // Step-by-step cooking
  prepTime?: number;                    // Minutes to prepare
  cookTime?: number;                    // Minutes to cook
  totalTime?: number;                   // Total prepTime + cookTime
  difficulty?: 'easy' | 'moderate' | 'advanced';
  substitutions: IngredientSubstitution[];
}

export interface MealInstruction {
  step: number;
  description: string;  // e.g., "Preheat oven to 375°F"
}

export interface IngredientSubstitution {
  ingredient: string;              // Original ingredient name
  alternatives: SubstitutionOption[];
}

export interface SubstitutionOption {
  name: string;                    // Alternative ingredient
  amount?: string;                 // Amount if different
  calories?: number;               // Calorie adjustment
  notes?: string;                  // Why it works
}

export interface MealLogEntry {
  id: string;
  userId: string;
  mealId: string;
  meal: Meal;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  loggedAt: Date;
  notes?: string;
}

export interface DailyMealLog {
  date: string;  // YYYY-MM-DD
  meals: MealLogEntry[];
  totalCalories: number;
  totalMacros: Macros;
}
```

---

## Backend API Endpoint

### STEP 2: Create New Endpoint `api/src/functions/generateMealOptions.ts`

**Endpoint:** `POST /api/meals/options`

**Request Body:**
```json
{
  "userId": "google-oauth2|...",
  "mealType": "breakfast|lunch|dinner|snack",
  "fitnessGoal": "muscle|toning|cardio|weightloss|strength",
  "dietaryPreference": "standard|vegetarian|keto|highprotein|glutenfree|dairyfree",
  "proteinPreference": "chicken|beef|fish|salmon|tuna|pork|turkey|eggs|tofu|tempeh|legumes",
  "dailyCalorieTarget": 2000
}
```

**Response:**
```json
{
  "meals": [
    {
      "id": "uuid-1",
      "name": "Grilled Chicken with Quinoa",
      "type": "breakfast",
      "calories": 380,
      "macros": {
        "protein": 35,
        "carbs": 40,
        "fats": 12
      },
      "ingredients": [
        {
          "id": "uuid-ing-1",
          "name": "Grilled Chicken Breast",
          "amount": "6 oz",
          "calories": 280
        },
        {
          "id": "uuid-ing-2",
          "name": "Cooked Quinoa",
          "amount": "1 cup",
          "calories": 100
        }
      ],
      "instructions": [
        {
          "step": 1,
          "description": "Preheat pan over medium-high heat for 2 minutes"
        },
        {
          "step": 2,
          "description": "Season chicken breast with salt, pepper, and garlic powder"
        },
        {
          "step": 3,
          "description": "Place chicken in hot pan and cook 6-7 minutes per side until internal temp reaches 165°F"
        },
        {
          "step": 4,
          "description": "Let rest for 2 minutes, then slice into strips"
        },
        {
          "step": 5,
          "description": "Serve chicken over warm quinoa with a side of steamed broccoli"
        }
      ],
      "prepTime": 10,
      "cookTime": 15,
      "totalTime": 25,
      "difficulty": "easy",
      "substitutions": [
        {
          "ingredient": "Chicken Breast",
          "alternatives": [
            {
              "name": "Turkey Breast",
              "amount": "6 oz",
              "calories": 280,
              "notes": "Similar protein, slightly leaner"
            },
            {
              "name": "Salmon",
              "amount": "5 oz",
              "calories": 280,
              "notes": "Higher in omega-3 fats, slightly fewer calories"
            },
            {
              "name": "Tofu (extra firm)",
              "amount": "8 oz",
              "calories": 180,
              "notes": "Vegetarian option, fewer calories, add extra seasoning"
            }
          ]
        },
        {
          "ingredient": "Quinoa",
          "alternatives": [
            {
              "name": "Brown Rice",
              "amount": "1 cup",
              "calories": 108,
              "notes": "Similar carbs, slightly more filling"
            },
            {
              "name": "Sweet Potato",
              "amount": "1 medium",
              "calories": 105,
              "notes": "Higher fiber, more nutrients"
            }
          ]
        }
      ]
    },
    {
      "id": "uuid-2",
      "name": "Scrambled Eggs with Toast",
      "type": "breakfast",
      "calories": 420,
      // ... similar structure, different meal
    },
    {
      "id": "uuid-3",
      "name": "Oatmeal with Berries & Nuts",
      "type": "breakfast",
      "calories": 450,
      // ... similar structure, third option with higher calories
    }
  ],
  "dailyCalorieTarget": 2000,
  "mealTypeCalorieRange": {
    "breakfast": "350-500 cal",
    "lunch": "500-700 cal",
    "dinner": "500-700 cal",
    "snack": "150-250 cal"
  }
}
```

**Functionality:**
1. Validate request body with Zod
2. Call Azure OpenAI with enhanced prompt (see STEP 3 below)
3. GPT returns 3 different meals with:
   - Different proteins (only selected protein type)
   - Varying calories (low/med/high within meal type range)
   - Step-by-step instructions
   - Substitution suggestions
4. Add UUIDs to meals, ingredients, and instructions
5. Return 3 meals + daily target reminder

**IMPORTANT:** Do NOT save to Cosmos DB yet—user selects first, then logs from Progress page

---

### STEP 3: Enhanced AI Prompt

**File:** `api/src/config/openai.ts`

**Add new function:** `getMealOptionsPrompt()`

```typescript
function getMealOptionsPrompt(params: {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  fitnessGoal: FitnessGoal;
  dietaryPreference: DietaryPreference;
  proteinPreference: string;
  dailyCalorieTarget: number;
}): { system: string; user: string } {
  const mealCalorieTargets: Record<string, { low: number; mid: number; high: number }> = {
    breakfast: { low: 350, mid: 420, high: 500 },
    lunch: { low: 500, mid: 600, high: 700 },
    dinner: { low: 500, mid: 600, high: 700 },
    snack: { low: 150, mid: 200, high: 250 },
  };

  const targets = mealCalorieTargets[params.mealType];

  return {
    system: `You are a certified nutritionist creating personalized meal plans. Generate balanced, nutritious meals in JSON format. Each meal should include detailed step-by-step cooking instructions and ingredient substitution suggestions. Meals should vary in calorie content (low, medium, high) to give users options.`,
    
    user: `Create 3 DIFFERENT ${params.mealType} meal options for someone with a ${params.fitnessGoal} fitness goal following a ${params.dietaryPreference} diet.

CONSTRAINTS:
- Daily calorie target: ${params.dailyCalorieTarget} calories
- Meal type calorie range: ${targets.low}-${targets.high} calories
- Generate 3 meals with varying calories: ${targets.low}, ${targets.mid}, ${targets.high}
- All meals MUST feature ${params.proteinPreference} as the primary protein
- Meals must be DIFFERENT (different dishes, not variations of same meal)
- Each meal must be realistic and achievable for home cooking

For EACH meal, return JSON object with this EXACT structure:
{
  "name": "Descriptive meal name",
  "type": "${params.mealType}",
  "calories": <number>,
  "macros": {
    "protein": <grams>,
    "carbs": <grams>,
    "fats": <grams>
  },
  "ingredients": [
    {
      "name": "Ingredient name",
      "amount": "1 cup" or "6 oz" (include unit)",
      "calories": <number>
    }
  ],
  "instructions": [
    {
      "step": 1,
      "description": "First step of cooking (be specific and detailed)"
    },
    {
      "step": 2,
      "description": "Second step..."
    }
  ],
  "prepTime": <minutes as number>,
  "cookTime": <minutes as number>,
  "totalTime": <minutes as number>,
  "difficulty": "easy|moderate|advanced",
  "substitutions": [
    {
      "ingredient": "Original ingredient name",
      "alternatives": [
        {
          "name": "Alternative ingredient name",
          "amount": "amount with unit (can differ from original)",
          "calories": <estimated calories>,
          "notes": "Why this works (e.g., similar nutrition, dietary restriction, flavor profile)"
        }
      ]
    }
  ]
}

RETURN as JSON array with 3 meal objects: [meal1, meal2, meal3]

IMPORTANT:
- Instructions must be step-by-step and detailed (minimum 4 steps, maximum 8 steps)
- Include prep time and cook time estimates
- Each meal should have 2-3 substitution options
- Substitutions should cover dietary variations (e.g., chicken → tofu, salmon for pescatarian)
- Calories should be accurate and realistic
- Make meals interesting and varied (not just different portions of same dish)`
  };
}
```

---

## Frontend Components & Pages

### STEP 4: Update `src/pages/MealPlansPage.tsx`

**Purpose:** Main page with 5-step flow

**Flow:**
```
Step 1: Select Fitness Goal (dropdown)
Step 2: Select Dietary Preference (dropdown)
Step 3: Select Protein Preference (dropdown)
Step 4: Enter Daily Calorie Target (input field, shows range: 1500-3500)
Step 5: Select Meal Type (buttons: Breakfast, Lunch, Dinner, Snack)
         ↓ (on selection)
         → Call API to generate 3 options
         → Display MealOptionsDisplay component
```

**State Management:**
```typescript
const [step, setStep] = useState(1);
const [selectedGoal, setSelectedGoal] = useState<FitnessGoal | null>(null);
const [selectedDietaryPref, setSelectedDietaryPref] = useState<DietaryPreference | null>(null);
const [selectedProtein, setSelectedProtein] = useState<string | null>(null);
const [dailyCalories, setDailyCalories] = useState(2000);
const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | null>(null);
const [mealOptions, setMealOptions] = useState<Meal[]>([]);
const [isLoading, setIsLoading] = useState(false);
```

**On Meal Type Selection:**
- Call `mealService.generateMealOptions()`
- Show loading state
- Display `MealOptionsDisplay` component with 3 options

---

### STEP 5: Create `src/components/MealPlans/MealOptionsDisplay.tsx`

**Purpose:** Display 3 meal options in a grid

**Props:**
```typescript
interface MealOptionsDisplayProps {
  meals: Meal[];
  dailyCalorieTarget: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  onSelectMeal: (meal: Meal) => void;
  onMoreOptions: () => void;
  isLoadingMore: boolean;
}
```

**Layout:**
```
┌─────────────────────────────────────────────┐
│ Daily Calorie Target: 2000 cal              │
│ Meal Type: Breakfast                        │
│ Recommended Range: 350-500 cal              │
└─────────────────────────────────────────────┘

┌──────────┐  ┌──────────┐  ┌──────────┐
│ Meal 1   │  │ Meal 2   │  │ Meal 3   │
│ 380 cal  │  │ 420 cal  │  │ 490 cal  │
│          │  │          │  │          │
│ [VIEW]   │  │ [VIEW]   │  │ [VIEW]   │
└──────────┘  └──────────┘  └──────────┘

[MORE OPTIONS] button
```

**Components:**
- `MealOptionCard` - Single meal card (compact)
  - Shows: name, calories, macros
  - Button: "View Details"
- Modal trigger on "View Details" → `MealDetailsModal`

---

### STEP 6: Create `src/components/MealPlans/MealOptionCard.tsx`

**Purpose:** Display single meal option in compact form

**Renders:**
```
┌──────────────────┐
│ Grilled Chicken  │ ← Meal name
│ with Quinoa      │
├──────────────────┤
│ 🔥 380 cal       │
│ P: 35g C: 40g    │
│ F: 12g           │
├──────────────────┤
│  [View Details]  │
└──────────────────┘
```

**Props:**
```typescript
interface MealOptionCardProps {
  meal: Meal;
  dailyCalorieTarget: number;
  onClick: () => void;
}
```

---

### STEP 7: Create `src/components/MealPlans/MealDetailsModal.tsx`

**Purpose:** Full meal details with instructions and substitutions

**Sections:**
1. **Header**
   - Meal name
   - Meal type badge
   - Calories + macros
   - Daily target reminder

2. **Overview**
   - Difficulty level
   - Prep time + Cook time + Total time
   - Servings/portion info

3. **Ingredients Tab**
   - Listed with amounts and calories
   - Ingredient list for shopping

4. **Instructions Tab** (NEW)
   - Numbered steps (1-8)
   - Clear, detailed instructions
   - E.g.:
     ```
     Step 1: Preheat pan over medium-high heat for 2 minutes
     Step 2: Season chicken with salt, pepper, garlic
     Step 3: Cook 6-7 minutes per side until 165°F internal temp
     ...
     ```

5. **Substitutions Tab** (NEW)
   - For each ingredient, show alternatives
   - Display: name, amount (if different), calorie adjustment, why it works
   - E.g.:
     ```
     CHICKEN BREAST:
     • Turkey Breast (6 oz) - 280 cal
       "Similar protein, slightly leaner"
     • Salmon (5 oz) - 280 cal
       "Higher in omega-3, slightly fewer calories"
     • Tofu (8 oz) - 180 cal
       "Vegetarian option, add extra seasoning"
     ```

6. **Actions**
   - "Make It" button → Logs meal, closes modal
   - "Close" button

**State:**
```typescript
const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'instructions' | 'substitutions'>('overview');
```

---

### STEP 8: Update `src/services/mealService.ts`

**Add function:**
```typescript
async generateMealOptions(params: {
  userId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  fitnessGoal: FitnessGoal;
  dietaryPreference: DietaryPreference;
  proteinPreference: string;
  dailyCalorieTarget: number;
}): Promise<{ meals: Meal[]; dailyCalorieTarget: number }> {
  // Call POST /api/meals/options
  // Return 3 meal options
}

async logMeal(userId: string, meal: Meal, mealType: string): Promise<MealLogEntry> {
  // Call POST /api/meals/log
  // Log meal to mealLogs container with timestamp
}
```

---

## Meal Logging (Backend)

### STEP 9: Create `api/src/functions/logMeal.ts`

**Endpoint:** `POST /api/meals/log`

**Request Body:**
```json
{
  "userId": "google-oauth2|...",
  "mealType": "breakfast|lunch|dinner|snack",
  "meal": { /* full meal object */ },
  "notes": "optional notes"
}
```

**Functionality:**
1. Validate Auth0 token matches userId
2. Create MealLogEntry with:
   - Unique ID (UUID)
   - userId
   - mealId
   - Full meal object
   - mealType
   - loggedAt: current timestamp
   - notes (optional)
3. Save to Cosmos DB `mealLogs` container (partitioned by userId)
4. Return created entry

**Returns:**
```json
{
  "id": "uuid-log-1",
  "userId": "google-oauth2|...",
  "mealId": "uuid-meal-1",
  "meal": { /* full meal object */ },
  "mealType": "breakfast",
  "loggedAt": "2026-01-09T12:30:00Z",
  "notes": "optional notes"
}
```

---

### STEP 10: Create `api/src/functions/getDailyMealLog.ts`

**Endpoint:** `GET /api/meals/log/{userId}?date=2026-01-09`

**Functionality:**
1. Validate Auth0 token matches userId
2. Query Cosmos DB `mealLogs` for date
3. Calculate totals:
   - Total calories
   - Total macros (protein, carbs, fats)
4. Group by meal type
5. Return DailyMealLog

**Returns:**
```json
{
  "date": "2026-01-09",
  "meals": [
    {
      "id": "uuid-log-1",
      "meal": { /* breakfast meal */ },
      "mealType": "breakfast",
      "loggedAt": "2026-01-09T08:00:00Z"
    },
    {
      "id": "uuid-log-2",
      "meal": { /* lunch meal */ },
      "mealType": "lunch",
      "loggedAt": "2026-01-09T12:30:00Z"
    }
  ],
  "totalCalories": 1850,
  "totalMacros": {
    "protein": 150,
    "carbs": 180,
    "fats": 55
  }
}
```

---

## Progress Page Integration

### STEP 11: Update `src/pages/ProgressPage.tsx`

**Add Sections:**

1. **Today's Meals**
   - Loads from `/api/meals/log/{userId}?date=today`
   - Shows:
     - Meals logged (breakfast, lunch, dinner, snack)
     - Total calories consumed vs. target
     - Macro breakdown
   - "Add Meal" button → Routes to MealPlansPage

2. **Calorie Summary**
   - Calories consumed / Daily target
   - Progress bar
   - Remaining calories
   - Optional: Macros breakdown (pie chart or bars)

3. **Meal History**
   - Date picker
   - View past days' meals
   - Can delete logged meals

4. **Weight Trend** (existing, keep)
   - 30-day weight chart
   - Current vs. target weight

---

### STEP 12: Create `src/hooks/useMealTracking.ts`

**Purpose:** Custom hook for meal logging

```typescript
interface UseMealTrackingReturn {
  dailyLog: DailyMealLog | null;
  isLoading: boolean;
  error: string | null;
  logMeal: (meal: Meal, mealType: string, notes?: string) => Promise<void>;
  deleteMealLog: (mealLogId: string) => Promise<void>;
  getDailyLog: (date: string) => Promise<void>;
}

export const useMealTracking = (userId: string): UseMealTrackingReturn => {
  // State + functions for meal tracking
}
```

---

## Database Schema

### STEP 13: Ensure Cosmos DB Containers

**Containers needed:**

1. **`mealLogs`** (NEW)
   - Partition Key: `/userId`
   - Sample document:
     ```json
     {
       "id": "uuid-log-1",
       "userId": "google-oauth2|...",
       "mealId": "uuid-meal-1",
       "meal": { /* full meal object */ },
       "mealType": "breakfast",
       "loggedAt": "2026-01-09T08:00:00Z",
       "notes": "optional"
     }
     ```

2. **`meals`** (EXISTING, Update)
   - Add fields: `instructions[]`, `difficulty`, `prepTime`, `cookTime`, `substitutions[]`

---

## API Endpoint Updates

### STEP 14: Update `api/src/index.ts`

Remove:
```typescript
// OLD ENDPOINTS (REMOVED):
// - POST /api/meals/generate (full day meal plan)
```

Add:
```typescript
// NEW ENDPOINTS:
// - POST /api/meals/options (3 meal options for single meal type)
// - POST /api/meals/log (log meal to daily log)
// - GET /api/meals/log/{userId} (get daily meal log)
```

---

## Step-by-Step Implementation Checklist

### Phase 2A: Backend Setup
- [ ] Step 1: Update meal types in `src/types/meal.ts`
- [ ] Step 2: Create `api/src/functions/generateMealOptions.ts`
- [ ] Step 3: Add enhanced prompt to `api/src/config/openai.ts`
- [ ] Step 9: Create `api/src/functions/logMeal.ts`
- [ ] Step 10: Create `api/src/functions/getDailyMealLog.ts`
- [ ] Step 13: Create Cosmos DB `mealLogs` container
- [ ] Step 14: Update `api/src/index.ts` with new endpoints
- [ ] Test endpoints locally with Postman/curl

### Phase 2B: Frontend Setup
- [ ] Step 4: Update `src/pages/MealPlansPage.tsx` (5-step flow)
- [ ] Step 5: Create `src/components/MealPlans/MealOptionsDisplay.tsx`
- [ ] Step 6: Create `src/components/MealPlans/MealOptionCard.tsx`
- [ ] Step 7: Create `src/components/MealPlans/MealDetailsModal.tsx` (tabs)
- [ ] Step 8: Update `src/services/mealService.ts` (new functions)
- [ ] Step 12: Create `src/hooks/useMealTracking.ts`

### Phase 2C: Progress Page Integration
- [ ] Step 11: Update `src/pages/ProgressPage.tsx` (add meals section)
- [ ] Test meal logging on Progress page

### Phase 2D: Testing
- [ ] E2E test: Full flow from meal selection → logging → progress page
- [ ] Test all 5 steps of MealPlansPage
- [ ] Test "More Options" button regenerates different meals
- [ ] Test modal tabs (ingredients, instructions, substitutions)
- [ ] Test "Make It" logs meal correctly
- [ ] Test daily calorie target reminder displays on all options
- [ ] Test weight tracked alongside meals

---

## Important Notes

### Daily Calorie Target Context
- User enters daily target (e.g., 2000 cal) in Step 4
- This is passed to API and displayed on all meal options
- Each option shows: "Daily Target: 2000 cal | This Meal: 380 cal | Remaining: 1620 cal"
- Helps user make informed decisions about meal selection

### Meal Variation
- GPT generates 3 **different** meals (not variations of same meal)
- Vary in calories: low/mid/high within meal type range
- Same protein source (user selected)
- Different dishes, preparations, sides

### Instructions Detail
- 4-8 steps per meal
- Specific temperatures (e.g., 165°F for chicken)
- Timing (e.g., "cook 6-7 minutes per side")
- Visual cues (e.g., "until golden brown")

### Substitutions
- 2-3 alternatives per ingredient
- Include dietary variants (vegan, pescatarian, etc.)
- Show calorie impact
- Explain why it works

### No Full-Day Plans
- ❌ User can no longer generate full day (breakfast, lunch, dinner, snack) at once
- ✅ User generates one meal type at a time
- ✅ User builds their own daily plan by selecting each meal
- ✅ Progress page shows what they've logged today

---

## Deployment & Testing

### Local Testing
```bash
# Backend
cd api
npm run build
func start

# Frontend
npm run dev

# Test: http://localhost:5173/meals
# Generate 3 breakfast options
# Click "View Details" on one
# Review instructions & substitutions
# Click "Make It"
# Check Progress page → should show logged meal
```

### Production Deployment
1. Deploy API changes to Azure Functions
2. Deploy frontend changes to Azure Static Web Apps
3. Verify Cosmos DB `mealLogs` container exists
4. Test OAuth login flow
5. Full end-to-end test on production

---

## Success Criteria

✅ All checks must pass:

- [ ] User can complete 5-step meal selection flow
- [ ] API returns 3 different meal options with varying calories
- [ ] Each meal has detailed instructions (4-8 steps)
- [ ] Each meal has substitution suggestions
- [ ] Modal displays all 4 tabs (overview, ingredients, instructions, substitutions)
- [ ] "Make It" button logs meal with timestamp
- [ ] Progress page shows today's meals with calorie total
- [ ] Daily calorie target reminder shows on all meal options
- [ ] "More Options" regenerates 3 new different meals
- [ ] Meal options respect selected protein preference
- [ ] API returns appropriate calorie ranges for meal type
- [ ] Cosmos DB mealLogs records all logged meals
- [ ] Auth token validation prevents unauthorized access
- [ ] Error handling for API failures (fallback to mock data optional)

---

## Phase 2 Dependencies

**Must Complete Before Phase 2:**
- ✅ Phase 1: Auth0 OAuth setup
- ✅ Phase 1: User profile management
- ✅ Phase 1: Cosmos DB setup

**Can Run Alongside Phase 2:**
- Progress page updates (meal tracking display)
- Weight tracking (already in Phase 1)

---

## Next Phase (Phase 3)

- Grocery list generation from selected meals
- Meal plan export to PDF
- Social sharing of meals
- Recurring meal preferences
- Calorie/macro analytics dashboard
- Workout completion tracking enhancements

---

**Created:** January 9, 2026  
**Status:** Ready for Claude Code implementation  
**Estimated Effort:** 20-25 tasks, 8-12 hours of implementation

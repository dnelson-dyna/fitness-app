# Fitness App - Claude Code Instructions

## Project Overview
Building a mobile-friendly fitness app targeting young women (18+) with AI-powered personalized workouts and meal plans using React, TypeScript, Azure, and Azure OpenAI.

## Target User
- Primary: Young women (18+)
- Secondary: Fitness enthusiasts wanting personalized AI guidance
- Design tone: Supportive, empowering, non-intimidating

## Tech Stack
- **Frontend:** React 18.2 + TypeScript 5.0 + Vite
- **Styling:** Tailwind CSS 3.3 (mobile-first design)
- **Backend:** Node.js + Express (Azure App Service)
- **Database:** Azure Cosmos DB
- **AI:** Azure OpenAI (GPT models)
- **Auth:** Azure AD B2C
- **Deployment:** Azure Static Web Apps (frontend) + Azure App Service (backend)

## MVP Features (4-6 week timeline)

### 1. Fitness Goals (5 options)
- Toning/Sculpting
- Building Muscle/Curves
- Cardio & Endurance
- Weight Loss/Fat Loss
- Building Strength

### 2. Dietary Preferences (6 options)
- No restrictions (Standard/Balanced)
- Vegetarian
- Keto/Low-Carb
- High Protein
- Gluten-Free
- Dairy-Free

### 3. Core Features
- **Workout Selection:** Users choose body area + fitness goal → get AI-generated workout plan
- **Workout Tracking:** Check off completed exercises, track sets/reps/time
- **Meal Planning:** Users choose body area + fitness goal + dietary preference → get AI-generated meal plans
- **Calories Burned:** Calculate and display estimated calories for workouts
- **Progress Tracking:** View completed workouts, track progress over time
- **AI Feedback:** Real-time encouragement and form tips during workouts
- **Analytics:** Basic dashboard showing workout frequency, calories burned, progress trends

## Project Structure
```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   ├── Workouts/
│   │   ├── WorkoutSelector.tsx
│   │   ├── WorkoutPlan.tsx
│   │   ├── WorkoutCard.tsx
│   │   └── ExerciseItem.tsx
│   ├── MealPlans/
│   │   ├── MealSelector.tsx
│   │   ├── MealPlan.tsx
│   │   └── MealCard.tsx
│   ├── Progress/
│   │   ├── ProgressDashboard.tsx
│   │   ├── StatsCard.tsx
│   │   └── Charts.tsx
│   └── Common/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Loading.tsx
├── pages/
│   ├── Home.tsx
│   ├── WorkoutsPage.tsx
│   ├── MealPlansPage.tsx
│   └── ProgressPage.tsx
├── hooks/
│   ├── useWorkouts.ts
│   ├── useMealPlans.ts
│   └── useProgress.ts
├── types/
│   ├── fitness.ts
│   ├── workout.ts
│   ├── meal.ts
│   └── user.ts
├── services/
│   ├── api.ts
│   ├── workoutService.ts
│   ├── mealService.ts
│   └── aiService.ts
├── styles/
│   ├── globals.css
│   └── tailwind.css
├── App.tsx
└── main.tsx
```

## Key Type Definitions Needed

### FitnessGoal
```typescript
type FitnessGoal = 'toning' | 'muscle' | 'cardio' | 'weightloss' | 'strength';
```

### DietaryPreference
```typescript
type DietaryPreference = 'standard' | 'vegetarian' | 'keto' | 'highprotein' | 'glutenfree' | 'dairyfree';
```

### BodyArea
```typescript
type BodyArea = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'fullbody';
```

### Workout
- id: string
- name: string
- bodyArea: BodyArea
- fitnessGoal: FitnessGoal
- exercises: Exercise[]
- estimatedDuration: number (minutes)
- difficulty: 'beginner' | 'intermediate' | 'advanced'
- caloriesBurned: number (estimated)
- completed: boolean
- completedDate?: Date

### Exercise
- id: string
- name: string
- sets: number
- reps: number
- duration?: number (seconds)
- description: string
- imageUrl?: string
- completed: boolean

### MealPlan
- id: string
- name: string
- bodyArea: BodyArea
- fitnessGoal: FitnessGoal
- dietaryPreference: DietaryPreference
- meals: Meal[] (breakfast, lunch, dinner, snacks)
- totalCalories: number
- macros: { protein: number, carbs: number, fats: number }

### Meal
- id: string
- name: string
- type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
- calories: number
- macros: { protein: number, carbs: number, fats: number }
- ingredients: Ingredient[]
- instructions: string

## Component Specifications

### Pages
1. **Home Page** - Landing, quick stats, CTA to workouts/meal plans
2. **Workouts Page** - Body area selector → fitness goal selector → workout plan display
3. **Meal Plans Page** - Body area selector → fitness goal selector → dietary preference selector → meal plan display
4. **Progress Page** - Stats dashboard, charts, workout history, calories burned

### Layout Components
- **Header:** Logo, app title, hamburger menu (mobile)
- **Navigation:** Bottom nav on mobile, side nav on desktop (Workouts, Meal Plans, Progress, Profile)
- **Footer:** Link to settings, about, feedback

### Shared Components
- **Button:** Primary, secondary, danger variants, loading state, disabled state
- **Card:** Container component for content sections
- **Loading:** Spinner/skeleton loader for async operations

## Design Guidelines
- **Mobile-first:** Design for mobile (320px+), then scale up
- **Accessibility:** WCAG 2.1 AA compliant, semantic HTML
- **Color Scheme:** Suggest warm, empowering colors (pinks, purples, oranges) - adjust based on brand
- **Typography:** Clear hierarchy, readable fonts
- **Spacing:** Consistent 8px/16px/24px spacing system

## API Integration (Phase 2)
These will be implemented after the frontend structure is solid:
- GET /api/workouts (filtered by body area + fitness goal)
- POST /api/workouts/:id/complete (mark workout as done)
- GET /api/mealplans (filtered by body area + fitness goal + dietary preference)
- GET /api/progress (user stats)
- POST /api/feedback (save AI feedback interactions)

## Important Notes for Claude Code
1. Use TypeScript strictly - no `any` types
2. Create functional components with hooks only
3. Use Tailwind CSS for all styling (no CSS-in-JS)
4. Keep components small and focused (single responsibility)
5. Add JSDoc comments to complex functions
6. Mock data for now (no backend calls yet)
7. Make components responsive using Tailwind breakpoints
8. Include loading states and error boundaries
9. Use semantic HTML for accessibility
10. Keep file names consistent: PascalCase for components, camelCase for utilities

## Next Steps
1. ✅ Project scaffolding (this request)
2. Create main pages with dummy data
3. Implement body area + fitness goal + dietary preference selection flows
4. Add workout/meal plan display with check-off functionality
5. Create progress tracking dashboard
6. Integrate Azure OpenAI for AI generation
7. Connect to Azure backend APIs
8. Add user authentication with Azure AD B2C

---

**Last Updated:** {{ TODAY }}
**Timeline:** 4-6 weeks
**Current Phase:** 1 - Frontend Scaffolding
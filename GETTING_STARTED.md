# Getting Started with FitFlow

## Prerequisites
- Node.js 18+ and npm installed
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

   This will install:
   - React 19.2 and React DOM
   - React Router DOM 7.1 for routing
   - Tailwind CSS 3.4 for styling
   - TypeScript 5.9
   - Vite 7.2 as the build tool
   - All development dependencies

2. **Start the Development Server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173` (or another port if 5173 is in use)

3. **Build for Production**
   ```bash
   npm run build
   ```

   This creates an optimized production build in the `dist/` folder

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Project Structure Overview

```
fitness-app/
├── src/
│   ├── components/      # React components organized by feature
│   ├── pages/           # Page-level components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # Business logic and API calls
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main app component with routing
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles with Tailwind
├── public/              # Static assets
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── vite.config.ts       # Vite build configuration
└── tsconfig.json        # TypeScript configuration
```

## Key Features

### 1. Workouts
- Navigate to `/workouts`
- Select body area (Chest, Back, Legs, etc.)
- Choose fitness goal (Toning, Muscle Building, etc.)
- Pick difficulty level
- Get AI-generated workout with exercises
- Check off exercises as you complete them
- Track progress with visual progress bar

### 2. Meal Plans
- Navigate to `/meals`
- Select your fitness goal
- Choose dietary preference
- Get personalized daily meal plan
- View calories and macros
- See detailed ingredients and instructions

### 3. Progress Tracking
- Navigate to `/progress`
- View workout statistics
- See calories burned
- Check workout breakdown by goal and body area
- Review recent workout history

## Development Tips

### Working with Mock Data
Currently, the app uses mock data from the services layer:
- `src/services/workoutService.ts` - Workout generation
- `src/services/mealService.ts` - Meal plan generation
- `src/services/aiService.ts` - AI feedback (placeholder)

### Adding New Features
1. Create types in `src/types/`
2. Add business logic to `src/services/`
3. Create custom hooks in `src/hooks/` if needed
4. Build UI components in `src/components/`
5. Add pages to `src/pages/`
6. Update routing in `src/App.tsx`

### Styling with Tailwind
The app uses Tailwind CSS utility classes. Key colors:
- `primary-*`: Pink shades
- `secondary-*`: Purple shades
- `accent-*`: Orange shades

Example:
```tsx
<button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg">
  Click Me
</button>
```

### State Management
The app uses React hooks for state management:
- `useWorkouts` - Workout generation and tracking
- `useMealPlans` - Meal plan generation
- `useProgress` - Progress tracking with localStorage

### Data Persistence
Progress data is stored in browser localStorage:
- Automatically saves when workouts are completed
- Persists between browser sessions
- Can be cleared using browser dev tools

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Port Already in Use
If port 5173 is in use, Vite will automatically try the next available port.

### Module Not Found Errors
Run `npm install` to ensure all dependencies are installed.

### Tailwind Styles Not Working
1. Check that `tailwind.config.js` exists
2. Verify `@tailwind` directives in `src/index.css`
3. Restart the dev server

### TypeScript Errors
Run `npx tsc --noEmit` to see all TypeScript errors.

## Next Steps

### Phase 2 - Backend Integration
1. Set up Azure App Service for backend
2. Configure Azure Cosmos DB for data persistence
3. Integrate Azure OpenAI for AI-generated content
4. Add Azure AD B2C for authentication

### Additional Features to Consider
- User profiles and settings
- Workout history with filtering/search
- Custom workout creation
- Progress photos upload
- Social sharing
- Push notifications
- Offline mode with service workers
- Export workout/meal data

## Resources
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com)

## Support
For issues or questions, refer to:
- BUILD_SUMMARY.md for project overview
- CLAUDE_INSTRUCTIONS.md for design specifications
- Component source code (well-commented)

---

**Happy Building! 💪**

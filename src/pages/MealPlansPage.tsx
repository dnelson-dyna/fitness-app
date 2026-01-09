import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { mealService } from '../services';
import { useMealTracking } from '../hooks';
import { MealOptionsDisplay, MealDetailsModal } from '../components/MealPlans';
import { Button, Loading } from '../components/Common';
import { Meal, FitnessGoal, DietaryPreference } from '../types';

const fitnessGoals: FitnessGoal[] = ['muscle', 'toning', 'cardio', 'weightloss', 'strength'];
const dietaryPreferences: DietaryPreference[] = ['standard', 'vegetarian', 'keto', 'highprotein', 'glutenfree', 'dairyfree'];
const proteinOptions = ['chicken', 'beef', 'fish', 'salmon', 'tuna', 'pork', 'turkey', 'eggs', 'tofu', 'tempeh', 'legumes'];
const mealTypes: Array<'breakfast' | 'lunch' | 'dinner' | 'snack'> = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function MealPlansPage() {
  const { user } = useAuth0();
  const { logMeal, isLoggingMeal } = useMealTracking();

  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal | null>(null);
  const [selectedDietaryPref, setSelectedDietaryPref] = useState<DietaryPreference | null>(null);
  const [selectedProtein, setSelectedProtein] = useState<string | null>(null);
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | null>(null);
  const [mealOptions, setMealOptions] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateOptions = async (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    if (!user || !selectedGoal || !selectedDietaryPref || !selectedProtein) return;

    setIsLoading(true);
    setError(null);
    setSelectedMealType(mealType);

    try {
      const response = await mealService.generateMealOptions({
        userId: user.sub!,
        mealType,
        fitnessGoal: selectedGoal,
        dietaryPreference: selectedDietaryPref,
        proteinPreference: selectedProtein,
        dailyCalorieTarget: dailyCalories,
      });
      setMealOptions(response.meals);
      setStep(6); // Move to options display
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate meal options');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoreOptions = async () => {
    if (!selectedMealType) return;
    await handleGenerateOptions(selectedMealType);
  };

  const handleMakeIt = async (meal: Meal) => {
    if (!user || !selectedMealType) return;

    try {
      await logMeal(user.sub!, meal, selectedMealType);
      setSelectedMeal(null);
      alert('Meal logged successfully! Check your Progress page to see it.');
    } catch (err) {
      alert('Failed to log meal. Please try again.');
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedGoal(null);
    setSelectedDietaryPref(null);
    setSelectedProtein(null);
    setDailyCalories(2000);
    setSelectedMealType(null);
    setMealOptions([]);
    setError(null);
  };

  if (isLoading) {
    return <Loading text="Generating your meal options..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meal Plans</h1>
          <p className="text-gray-600 mt-2">
            {step === 6 ? 'Choose your perfect meal' : 'Select your preferences to generate meal options'}
          </p>
        </div>
        {step > 1 && (
          <Button onClick={handleReset} variant="outline">
            Start Over
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Step 6: Display Meal Options */}
      {step === 6 && mealOptions.length > 0 && selectedMealType && (
        <>
          <MealOptionsDisplay
            meals={mealOptions}
            dailyCalorieTarget={dailyCalories}
            mealType={selectedMealType}
            onSelectMeal={setSelectedMeal}
            onMoreOptions={handleMoreOptions}
            isLoadingMore={isLoading}
          />
          {selectedMeal && (
            <MealDetailsModal
              meal={selectedMeal}
              dailyCalorieTarget={dailyCalories}
              onClose={() => setSelectedMeal(null)}
              onMakeIt={handleMakeIt}
              isLoggingMeal={isLoggingMeal}
            />
          )}
        </>
      )}

      {/* Step 1: Fitness Goal */}
      {step === 1 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Step 1: Select Your Fitness Goal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fitnessGoals.map((goal) => (
              <button
                key={goal}
                onClick={() => {
                  setSelectedGoal(goal);
                  setStep(2);
                }}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors capitalize"
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Dietary Preference */}
      {step === 2 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Step 2: Select Your Dietary Preference</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dietaryPreferences.map((pref) => (
              <button
                key={pref}
                onClick={() => {
                  setSelectedDietaryPref(pref);
                  setStep(3);
                }}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors capitalize"
              >
                {pref === 'highprotein' ? 'High Protein' : pref === 'glutenfree' ? 'Gluten Free' : pref === 'dairyfree' ? 'Dairy Free' : pref}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Protein Preference */}
      {step === 3 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Step 3: Select Your Protein Preference</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {proteinOptions.map((protein) => (
              <button
                key={protein}
                onClick={() => {
                  setSelectedProtein(protein);
                  setStep(4);
                }}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors capitalize"
              >
                {protein}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Daily Calorie Target */}
      {step === 4 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Step 4: Enter Your Daily Calorie Target</h2>
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Calorie Target
            </label>
            <input
              type="number"
              min="1500"
              max="3500"
              step="50"
              value={dailyCalories}
              onChange={(e) => setDailyCalories(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              Recommended range: 1500-3500 calories
            </p>
            <Button
              onClick={() => setStep(5)}
              className="w-full mt-4"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 5: Meal Type Selection */}
      {step === 5 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Step 5: Select Meal Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {mealTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleGenerateOptions(type)}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="text-2xl mb-2">
                  {type === 'breakfast' && '🍳'}
                  {type === 'lunch' && '🥗'}
                  {type === 'dinner' && '🍽️'}
                  {type === 'snack' && '🍎'}
                </div>
                <div className="font-semibold capitalize">{type}</div>
              </button>
            ))}
          </div>
          
          {/* Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Your Selection:</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li><span className="font-medium">Goal:</span> {selectedGoal}</li>
              <li><span className="font-medium">Diet:</span> {selectedDietaryPref}</li>
              <li><span className="font-medium">Protein:</span> {selectedProtein}</li>
              <li><span className="font-medium">Daily Calories:</span> {dailyCalories}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}


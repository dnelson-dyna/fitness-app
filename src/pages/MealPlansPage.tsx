import { useMealPlans } from '../hooks';
import { MealSelector, MealPlan } from '../components/MealPlans';
import { Loading } from '../components/Common';

export default function MealPlansPage() {
  const { currentMealPlan, isLoading, generateMealPlan, changeMealProtein, regenerateMeal, saveMealPlan, clearCurrentMealPlan } = useMealPlans();

  const handleSave = async () => {
    if (currentMealPlan) {
      await saveMealPlan(currentMealPlan);
      alert('Meal plan saved successfully!');
    }
  };

  if (isLoading) {
    return <Loading text="Creating your personalized meal plan..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meal Plans</h1>
        <p className="text-gray-600 mt-2">
          {currentMealPlan
            ? 'Your personalized daily meal plan'
            : 'Select your fitness goal and dietary preference to generate a customized meal plan'}
        </p>
      </div>

      {currentMealPlan ? (
        <MealPlan
          mealPlan={currentMealPlan}
          onSave={handleSave}
          onBack={clearCurrentMealPlan}
          onChangeProtein={changeMealProtein}
          onRegenerateMeal={regenerateMeal}
          isLoading={isLoading}
        />
      ) : (
        <MealSelector onGenerate={generateMealPlan} isLoading={isLoading} />
      )}
    </div>
  );
}

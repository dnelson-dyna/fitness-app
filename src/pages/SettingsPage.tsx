import { useState, useEffect } from 'react';
import { useAuth0Context } from '../hooks/useAuth0Context';
import { Loading, Button, Card } from '../components/Common';
import { userService } from '../services';
import type { UserProfile } from '../types';

export default function SettingsPage() {
  const { userId, user, isLoading: authLoading } = useAuth0Context();
  const [, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingWeight, setIsAddingWeight] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    height: '',
    weight: '',
    targetWeight: '',
    fitnessGoal: '',
    dietaryPreference: '',
    preferredProteins: [] as string[],
  });

  // Weight check-in state
  const [newWeight, setNewWeight] = useState('');
  const [weightNotes, setWeightNotes] = useState('');

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await userService.getUserProfile(userId);
      setProfile(data);
      setFormData({
        name: data.name || user?.name || '',
        email: data.email || user?.email || '',
        age: data.age?.toString() || '',
        height: data.height?.toString() || '',
        weight: data.weight?.toString() || '',
        targetWeight: data.targetWeight?.toString() || '',
        fitnessGoal: data.fitnessGoal || '',
        dietaryPreference: data.dietaryPreference || '',
        preferredProteins: data.preferredProteins || [],
      });
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      const updatedProfile: Partial<UserProfile> = {
        name: formData.name,
        email: formData.email,
        age: formData.age ? parseInt(formData.age) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : undefined,
        fitnessGoal: (formData.fitnessGoal || undefined) as UserProfile['fitnessGoal'],
        dietaryPreference: (formData.dietaryPreference || undefined) as UserProfile['dietaryPreference'],
        preferredProteins: formData.preferredProteins.length > 0 ? formData.preferredProteins : undefined,
      };

      const updated = await userService.updateUserProfile(userId, updatedProfile);
      setProfile(updated);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newWeight) return;

    try {
      setIsAddingWeight(true);
      setError(null);
      setSuccessMessage(null);

      await userService.addWeightCheckIn(userId, parseFloat(newWeight), weightNotes || undefined);
      setSuccessMessage('Weight check-in added successfully!');
      setNewWeight('');
      setWeightNotes('');
      setTimeout(() => setSuccessMessage(null), 3000);

      // Update profile to reflect new weight
      await loadProfile();
    } catch (err) {
      setError('Failed to add weight check-in');
      console.error(err);
    } finally {
      setIsAddingWeight(false);
    }
  };

  const handleProteinToggle = (protein: string) => {
    setFormData(prev => ({
      ...prev,
      preferredProteins: prev.preferredProteins.includes(protein)
        ? prev.preferredProteins.filter(p => p !== protein)
        : [...prev.preferredProteins, protein],
    }));
  };

  if (authLoading || isLoading) {
    return <Loading text="Loading settings..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your profile and preferences
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
          {successMessage}
        </div>
      )}

      {/* Profile Form */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                id="age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="13"
                max="120"
              />
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                Height (inches)
              </label>
              <input
                type="number"
                id="height"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="36"
                max="96"
                step="0.1"
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Current Weight (lbs)
              </label>
              <input
                type="number"
                id="weight"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="50"
                max="1000"
                step="0.1"
              />
            </div>

            <div>
              <label htmlFor="targetWeight" className="block text-sm font-medium text-gray-700 mb-1">
                Target Weight (lbs)
              </label>
              <input
                type="number"
                id="targetWeight"
                value={formData.targetWeight}
                onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="50"
                max="1000"
                step="0.1"
              />
            </div>

            <div>
              <label htmlFor="fitnessGoal" className="block text-sm font-medium text-gray-700 mb-1">
                Fitness Goal
              </label>
              <select
                id="fitnessGoal"
                value={formData.fitnessGoal}
                onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a goal</option>
                <option value="weightloss">Weight Loss</option>
                <option value="muscle">Muscle Gain</option>
                <option value="toning">Toning</option>
                <option value="cardio">Cardio</option>
                <option value="strength">Strength</option>
              </select>
            </div>

            <div>
              <label htmlFor="dietaryPreference" className="block text-sm font-medium text-gray-700 mb-1">
                Dietary Preference
              </label>
              <select
                id="dietaryPreference"
                value={formData.dietaryPreference}
                onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select preference</option>
                <option value="standard">Standard</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="keto">Keto</option>
                <option value="highprotein">High Protein</option>
                <option value="glutenfree">Gluten Free</option>
                <option value="dairyfree">Dairy Free</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Proteins
            </label>
            <div className="flex flex-wrap gap-2">
              {['Chicken', 'Turkey', 'Beef', 'Pork', 'Fish', 'Eggs', 'Tofu', 'Beans', 'Lentils'].map((protein) => (
                <button
                  key={protein}
                  type="button"
                  onClick={() => handleProteinToggle(protein)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    formData.preferredProteins.includes(protein)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {protein}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Weight Check-in */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Log Weight Check-in</h2>
        <form onSubmit={handleAddWeight} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="newWeight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight (lbs)
              </label>
              <input
                type="number"
                id="newWeight"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="50"
                max="1000"
                step="0.1"
                required
              />
            </div>

            <div>
              <label htmlFor="weightNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <input
                type="text"
                id="weightNotes"
                value={weightNotes}
                onChange={(e) => setWeightNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Morning weight, post-workout"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={isAddingWeight}>
              {isAddingWeight ? 'Adding...' : 'Add Weight Check-in'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

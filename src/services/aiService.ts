import { mockDelay } from './api';

/**
 * AI service for generating personalized feedback and tips
 * Will be connected to Azure OpenAI in Phase 2
 */

export interface AIFeedback {
  message: string;
  type: 'encouragement' | 'tip' | 'correction';
}

const encouragementMessages = [
  "You're doing amazing! Keep up the great work!",
  "Every rep counts! You're getting stronger!",
  "Feel the burn? That's your body transforming!",
  "You're crushing it! Stay focused!",
  "Great form! Keep that energy up!",
  "One step closer to your goals!",
  "Your dedication is inspiring!",
  "Strong and steady wins the race!",
];

const formTips = [
  "Remember to engage your core for stability",
  "Keep your breathing steady - exhale on exertion",
  "Focus on controlled movements, not speed",
  "Maintain proper posture throughout",
  "Listen to your body and adjust as needed",
  "Quality over quantity - focus on form",
];

export const aiService = {
  /**
   * Get AI-generated encouragement during workout
   */
  getEncouragement: async (): Promise<AIFeedback> => {
    await mockDelay(300);
    const message = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
    return {
      message,
      type: 'encouragement',
    };
  },

  /**
   * Get form tips for exercises
   */
  getFormTip: async (exerciseName: string): Promise<AIFeedback> => {
    await mockDelay(300);
    const message = formTips[Math.floor(Math.random() * formTips.length)];
    return {
      message: `${exerciseName}: ${message}`,
      type: 'tip',
    };
  },

  /**
   * Get personalized workout advice (placeholder for Azure OpenAI integration)
   */
  getWorkoutAdvice: async (fitnessGoal: string, bodyArea: string): Promise<string> => {
    await mockDelay(500);
    return `For ${fitnessGoal} focused on ${bodyArea}, consistency is key! Aim for 3-4 sessions per week, progressively increasing intensity. Don't forget to rest and recover!`;
  },

  /**
   * Get personalized nutrition advice (placeholder for Azure OpenAI integration)
   */
  getNutritionAdvice: async (
    fitnessGoal: string,
    dietaryPreference: string
  ): Promise<string> => {
    await mockDelay(500);
    return `For ${fitnessGoal} with a ${dietaryPreference} diet, focus on whole foods, adequate protein, and staying hydrated. Consider meal prep to stay on track!`;
  },
};

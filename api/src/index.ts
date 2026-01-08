// Import all Azure Functions to register them
import './health';
import './functions/generateMeal';
import './functions/generateWorkout';
import './functions/getUserProfile';
import './functions/updateUserProfile';
import './functions/createWeightCheckIn';
import './functions/getWeightHistory';

export * from './health';
export * from './functions/generateMeal';
export * from './functions/generateWorkout';
export * from './functions/getUserProfile';
export * from './functions/updateUserProfile';
export * from './functions/createWeightCheckIn';
export * from './functions/getWeightHistory';

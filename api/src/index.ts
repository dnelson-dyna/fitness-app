// Import all Azure Functions to register them
import './health';
import './functions/generateMeal';
import './functions/generateWorkout';

export * from './health';
export * from './functions/generateMeal';
export * from './functions/generateWorkout';

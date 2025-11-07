import type { UserProfile, Macros, ActivityLevel, Goal } from '../types';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    extra: 1.9,
};

const GOAL_ADJUSTMENTS: Record<Goal, number> = {
    'fat-loss': -400, // Slightly more conservative deficit
    'muscle-gain': 300,
    'recomp': 0,
};

// Protein multiplier per kg of body weight based on goal
const PROTEIN_MULTIPLIERS: Record<Goal, number> = {
    'fat-loss': 1.8,    // Higher to preserve muscle mass in a deficit
    'muscle-gain': 1.8, // Higher to support muscle protein synthesis
    'recomp': 1.6,      // A solid middle ground
};

// Calculate TDEE using Mifflin-St Jeor equation
function calculateTDEE(profile: UserProfile): number {
    const { weight, height, age, gender, activityLevel } = profile;

    let bmr: number;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];
    return tdee;
}

export function calculateNutritionalGoals(profile: UserProfile): Macros {
    const { goal, weight } = profile;
    const maintenanceCalories = calculateTDEE(profile);
    const targetCalories = maintenanceCalories + GOAL_ADJUSTMENTS[goal];

    // 1. Calculate Protein (based on bodyweight and goal)
    const proteinGrams = Math.round(weight * PROTEIN_MULTIPLIERS[goal]);
    const proteinCalories = proteinGrams * 4;

    // 2. Calculate Fat (as a percentage of total calories, e.g., 25%)
    const fatCalories = targetCalories * 0.25;
    const fatGrams = Math.round(fatCalories / 9);

    // 3. Calculate Carbs (the remainder)
    const carbCalories = targetCalories - proteinCalories - fatCalories;
    const carbGrams = Math.round(carbCalories / 4);
    
    // Ensure calculated macros don't result in negative carbs
     if (carbGrams < 0) {
        // This is a failsafe for very low calorie targets. Prioritize protein, then split the rest.
        const nonProteinCalories = targetCalories - proteinCalories;
        const adjustedFatGrams = Math.round((nonProteinCalories * 0.5) / 9);
        const adjustedCarbGrams = Math.round((nonProteinCalories * 0.5) / 4);
         return {
            calories: Math.round(targetCalories),
            protein: proteinGrams,
            carbs: Math.max(0, adjustedCarbGrams),
            fat: Math.max(0, adjustedFatGrams),
        };
    }


    return {
        calories: Math.round(targetCalories),
        protein: proteinGrams,
        carbs: carbGrams,
        fat: fatGrams,
    };
}
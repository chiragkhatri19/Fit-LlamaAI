export interface FoodItem {
  id: string; // Add a unique ID for React keys
  name: string;
  servingSizeValue: number;
  servingSizeUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  // Nutritional info per 100g/ml for recalculations
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

export interface AnalysisResult {
  items: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  insights: string[];
  disclaimer: string;
}

export interface FoodSearchResult {
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

export type Goal = 'fat-loss' | 'muscle-gain' | 'recomp';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
export type Gender = 'male' | 'female';
export type DietaryPreference = 'vegetarian' | 'non-vegetarian' | 'any';

export interface MealSlot {
    id: string;
    name: string;
    time: string; // e.g., "08:00"
}

export interface UserProfile {
    age: number;
    gender: Gender;
    height: number; // in cm
    weight: number; // in kg
    activityLevel: ActivityLevel;
    goal: Goal;
    dietaryPreference: DietaryPreference;
    workoutTime?: string; // e.g., "17:30"
    mealSlots?: MealSlot[]; // Array of user-defined meals
}

export interface Macros {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface Meal {
    id: string;
    mealSlotId: string; // Link to the custom meal slot
    name: string;
    items: FoodItem[];
    totals: Macros;
    insights: string[];
}

// --- Enhanced AI Coach Types ---
export interface MacroAnalysis {
    status: 'on-track' | 'too-low' | 'too-high' | 'goal-met';
    comment: string;
}

export interface RecipeSuggestion {
    name: string;
    description: string;
}

export interface AICoachInsight {
    dailySummary: string;
    macroAnalysis: {
        protein: MacroAnalysis;
        carbs: MacroAnalysis;
        fat: MacroAnalysis;
    };
    nutrientTiming: {
        preWorkout: string;
        postWorkout: string;
    };
    winsAndOpportunities: {
        wins: string[];
        opportunities: string[];
    };
    hydrationTip: string;
    microNutrientTip: {
        name: string;
        tip: string;
    };
    quickAddIdeas: string[];
    recipeSuggestions: RecipeSuggestion[];
}

// --- Chatbot Types ---
export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}
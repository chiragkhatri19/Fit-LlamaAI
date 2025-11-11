
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { AnalysisResult, FoodItem, UserProfile, Macros, Meal, AICoachInsight, FoodSearchResult, ChatMessage } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY environment variable not set");
}
  
const ai = new GoogleGenAI({ apiKey });

async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

export async function analyzeImage(imageFile: File): Promise<AnalysisResult> {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = {
      text: `
        Analyze the provided image of a meal with extreme detail for a nutrition tracking app.
        1.  Identify each distinct food item.
        2.  For EACH item, provide:
            - A descriptive 'name'.
            - Your best estimate of the serving size as a number ('servingSizeValue') and its unit ('servingSizeUnit', e.g., 'g', 'ml', 'cup').
            - Based on that serving size, provide the estimated 'calories', 'protein', 'carbs', and 'fat' in grams.
            - CRITICAL: Also provide the nutritional information PER 100g (or 100ml). This includes 'caloriesPer100g', 'proteinPer100g', 'carbsPer100g', and 'fatPer100g'. This is for user adjustments.
        3.  Calculate the 'totalCalories', 'totalProtein', 'totalCarbs', and 'totalFat' for the entire meal based on your initial estimates.
        4.  Provide 2-3 actionable 'insights' as an array of strings, focusing on macro balance and simple health improvements.
        5.  Include a brief 'disclaimer'.

        Return a structured JSON. Ensure all numerical fields are integers.
      `,
    };

    console.log('🔍 Sending image to Gemini for analysis...');
    
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  servingSizeValue: { type: Type.INTEGER },
                  servingSizeUnit: { type: Type.STRING },
                  calories: { type: Type.INTEGER },
                  protein: { type: Type.INTEGER },
                  carbs: { type: Type.INTEGER },
                  fat: { type: Type.INTEGER },
                  caloriesPer100g: { type: Type.INTEGER },
                  proteinPer100g: { type: Type.INTEGER },
                  carbsPer100g: { type: Type.INTEGER },
                  fatPer100g: { type: Type.INTEGER },
                },
                required: ["name", "servingSizeValue", "servingSizeUnit", "calories", "protein", "carbs", "fat", "caloriesPer100g", "proteinPer100g", "carbsPer100g", "fatPer100g"],
              },
            },
            totalCalories: { type: Type.INTEGER },
            totalProtein: { type: Type.INTEGER },
            totalCarbs: { type: Type.INTEGER },
            totalFat: { type: Type.INTEGER },
            insights: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            },
            disclaimer: { type: Type.STRING }
          },
          required: ["items", "totalCalories", "totalProtein", "totalCarbs", "totalFat", "insights", "disclaimer"],
        },
      },
    });

    const jsonString = response.text;
    console.log('✅ Gemini response received');
    const result: Omit<AnalysisResult, 'items'> & { items: Omit<FoodItem, 'id'>[] } = JSON.parse(jsonString);
    
    // Basic validation & add unique IDs
    if (!result || !Array.isArray(result.items) || typeof result.totalCalories !== 'number') {
        throw new Error("Invalid response format received from the API.");
    }

    const itemsWithIds: FoodItem[] = result.items.map(item => ({
        ...item,
        id: `${item.name}-${Math.random()}`
    }));
    
    return { ...result, items: itemsWithIds };

  } catch (error) {
    console.error("❌ Error analyzing image with Gemini:", error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('API_KEY') || error.message.includes('API key')) {
        throw new Error("API key is invalid or not configured correctly. Please check your Gemini API key.");
      }
      if (error.message.includes('quota') || error.message.includes('limit')) {
        throw new Error("API quota exceeded. Please try again later or check your Gemini API quota.");
      }
      if (error.message.includes('overloaded') || error.message.includes('503')) {
        throw new Error("Gemini service is temporarily overloaded. Please try again in a few moments.");
      }
    }
    
    throw new Error("Failed to analyze the image. Please try again with a clearer photo of your meal.");
  }
}

export async function getAIAssistantInsight(profile: UserProfile, goals: Macros, meals: Meal[]): Promise<AICoachInsight> {
    const dailyTotals = meals.reduce((acc, meal) => {
        acc.calories += meal.totals.calories;
        acc.protein += meal.totals.protein;
        acc.carbs += meal.totals.carbs;
        acc.fat += meal.totals.fat;
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const prompt = `
      Act as Lorenzo the Llama Coach, an expert, quirky, motivating, and highly specific AI Nutrition Coach. You are a wise llama who gives great, friendly advice. Your tone should be encouraging and a little playful. Use occasional llama-related puns, but don't overdo it. The user wants a detailed, scrollable, mobile-friendly breakdown of their day.
      
      The user's profile:
      - Goal: ${profile.goal}
      - Dietary Preference: ${profile.dietaryPreference}
      - Daily Calorie Target: ${goals.calories} kcal
      - Daily Macro Targets: ${goals.protein}g Protein, ${goals.carbs}g Carbs, ${goals.fat}g Fat
      - Typical Workout Time: ${profile.workoutTime || 'Not specified'}

      So far today, the user has consumed: ${dailyTotals.calories} kcal, ${dailyTotals.protein}g P, ${dailyTotals.carbs}g C, ${dailyTotals.fat}g F.

      Based on this complete picture, provide a detailed, structured JSON response for a mobile UI with multiple cards.
      1.  'dailySummary': A concise, encouraging summary of their progress from Lorenzo's perspective.
      2.  'macroAnalysis': An object with keys 'protein', 'carbs', 'fat'. For each:
          - 'status': 'too-low', 'on-track', 'too-high', or 'goal-met'.
          - 'comment': A brief, analytical comment from Lorenzo.
      3.  'nutrientTiming': An object. If workout time is specified, provide specific advice.
          - 'preWorkout': Suggestion for a meal before the workout.
          - 'postWorkout': Suggestion for a meal after the workout.
      4.  'winsAndOpportunities': An object with two arrays of strings.
          - 'wins': 1-2 things the user is doing well today. (e.g., "Alpaca my bags, you're crushing it with hydration!")
          - 'opportunities': 1-2 gentle, actionable suggestions for improvement.
      5.  'hydrationTip': A simple, actionable tip about staying hydrated.
      6.  'microNutrientTip': An "easter egg" style tip. An object with a 'name' (e.g., "Magnesium") and a 'tip' (a fun, helpful fact).
      7.  'quickAddIdeas': An array of 2-3 simple, single-ingredient food suggestions, respecting dietary preference.
      8.  'recipeSuggestions': An array of 1-2 objects, each with 'name' and 'description' for a simple recipe, respecting dietary preference.
    `;

    try {
        console.log('🦙 Requesting AI Coach insights...');
        
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    dailySummary: { type: Type.STRING },
                    macroAnalysis: {
                      type: Type.OBJECT,
                      properties: {
                        protein: {
                          type: Type.OBJECT,
                          properties: { status: { type: Type.STRING }, comment: { type: Type.STRING } },
                          required: ['status', 'comment'],
                        },
                        carbs: {
                          type: Type.OBJECT,
                          properties: { status: { type: Type.STRING }, comment: { type: Type.STRING } },
                           required: ['status', 'comment'],
                        },
                        fat: {
                          type: Type.OBJECT,
                          properties: { status: { type: Type.STRING }, comment: { type: Type.STRING } },
                           required: ['status', 'comment'],
                        },
                      },
                       required: ['protein', 'carbs', 'fat'],
                    },
                    nutrientTiming: {
                        type: Type.OBJECT,
                        properties: {
                            preWorkout: { type: Type.STRING },
                            postWorkout: { type: Type.STRING },
                        },
                        required: ['preWorkout', 'postWorkout'],
                    },
                    winsAndOpportunities: {
                        type: Type.OBJECT,
                        properties: {
                            wins: { type: Type.ARRAY, items: { type: Type.STRING } },
                            opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                        },
                        required: ['wins', 'opportunities'],
                    },
                    hydrationTip: { type: Type.STRING },
                    microNutrientTip: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            tip: { type: Type.STRING },
                        },
                        required: ['name', 'tip'],
                    },
                    quickAddIdeas: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    recipeSuggestions: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: { name: { type: Type.STRING }, description: { type: Type.STRING } },
                        required: ['name', 'description'],
                      },
                    },
                  },
                  required: ["dailySummary", "macroAnalysis", "nutrientTiming", "winsAndOpportunities", "hydrationTip", "microNutrientTip", "quickAddIdeas", "recipeSuggestions"],
                },
            },
        });
        const jsonString = response.text;
        console.log('✅ AI Coach insights received');
        return JSON.parse(jsonString) as AICoachInsight;
    } catch (error) {
        console.error("❌ Error getting AI assistant insight:", error);
        
        // Log detailed error
        if (error instanceof Error) {
          console.error('AI Coach Error:', error.message);
        }
        // Return a default error structure that matches the type
        return {
            dailySummary: "I'm having a little trouble analyzing your day right now, but keep up the great work with tracking!",
            macroAnalysis: {
                protein: { status: 'on-track', comment: "Unable to analyze at this moment." },
                carbs: { status: 'on-track', comment: "Unable to analyze at this moment." },
                fat: { status: 'on-track', comment: "Unable to analyze at this moment." },
            },
            nutrientTiming: {
                preWorkout: "Focus on easily digestible carbs for energy.",
                postWorkout: "Combine protein and carbs to refuel and repair.",
            },
            winsAndOpportunities: {
                wins: ["You're doing a great job tracking your meals today!"],
                opportunities: ["Look for opportunities to add more colorful vegetables to your plate."],
            },
            hydrationTip: "Don't forget to drink plenty of water throughout the day to stay hydrated and support your metabolism.",
            microNutrientTip: { name: "Potassium", tip: "Important for fluid balance and muscle contractions. Find it in bananas and sweet potatoes!" },
            quickAddIdeas: ["A piece of fruit", "A small yogurt"],
            recipeSuggestions: [{ name: "Simple Salad", description: "A mixed greens salad with your favorite veggies and a light vinaigrette." }]
        };
    }
}

export async function searchFoodDatabase(query: string): Promise<FoodSearchResult[]> {
    if (!query.trim()) return [];
    try {
        console.log('🔍 Searching food database for:', query);
        
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: `Act as a food nutrition database. The user is searching for "${query}". Return a JSON array of up to 10 matching food items. For each item, provide a descriptive 'name', and its nutritional information PER 100g: 'caloriesPer100g', 'proteinPer100g', 'carbsPer100g', 'fatPer100g'. Ensure all nutritional values are integers.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            caloriesPer100g: { type: Type.INTEGER },
                            proteinPer100g: { type: Type.INTEGER },
                            carbsPer100g: { type: Type.INTEGER },
                            fatPer100g: { type: Type.INTEGER },
                        },
                        required: ["name", "caloriesPer100g", "proteinPer100g", "carbsPer100g", "fatPer100g"]
                    }
                },
            },
        });
        const jsonString = response.text;
        console.log('✅ Food search results received');
        return JSON.parse(jsonString) as FoodSearchResult[];
    } catch (error) {
        console.error("❌ Error searching food database:", error);
        if (error instanceof Error) {
          console.error('Food Search Error:', error.message);
        }
        throw new Error("Failed to search for food items. Please try again.");
    }
}

export async function getChatbotResponse(
    question: string, 
    history: ChatMessage[],
    profile: UserProfile, 
    goals: Macros, 
    meals: Meal[]
): Promise<string> {
    const dailyTotals = meals.reduce((acc, meal) => {
        acc.calories += meal.totals.calories;
        acc.protein += meal.totals.protein;
        acc.carbs += meal.totals.carbs;
        acc.fat += meal.totals.fat;
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const mealsSummary = meals.map(meal => 
        `- ${meal.name}: ${meal.totals.calories}kcal (P:${meal.totals.protein}g, C:${meal.totals.carbs}g, F:${meal.totals.fat}g)`
    ).join('\n');

    const systemInstruction = `You are Lorenzo the Llama Coach, an expert, quirky, motivating, and highly specific AI Nutrition Coach. Your goal is to answer the user's questions based on the detailed context provided below. Be concise, helpful, and always maintain a positive, encouraging tone. Use occasional llama-related puns.

    **USER'S COMPLETE CONTEXT:**
    - **Profile:** Age: ${profile.age}, Gender: ${profile.gender}, Weight: ${profile.weight}kg, Height: ${profile.height}cm
    - **Goal:** ${profile.goal}
    - **Dietary Preference:** ${profile.dietaryPreference}
    - **Daily Calorie Target:** ${goals.calories} kcal
    - **Daily Macro Targets:** ${goals.protein}g Protein, ${goals.carbs}g Carbs, ${goals.fat}g Fat
    - **Typical Workout Time:** ${profile.workoutTime || 'Not specified'}
    - **Today's Total Intake So Far:** ${dailyTotals.calories} kcal (P:${dailyTotals.protein}g, C:${dailyTotals.carbs}g, F:${dailyTotals.fat}g)
    - **Meals Logged Today:**
    ${mealsSummary || "No meals logged yet."}

    Now, answer the user's question based on ALL of this information.`;
    
    try {
        console.log('💬 Chatbot query:', question);
        
        const chat: Chat = ai.chats.create({
            model: 'gemini-1.5-flash',
            config: { systemInstruction },
            history: history
        });

        const response = await chat.sendMessage({ message: question });
        console.log('✅ Chatbot response received');
        return response.text;
    } catch (error) {
        console.error("❌ Error getting chatbot response:", error);
        if (error instanceof Error) {
          console.error('Chatbot Error:', error.message);
        }
        return "I'm sorry, my brain is a little fuzzy right now. Please try asking again in a moment.";
    }
}
import { supabase } from '../lib/supabase';
import type { UserProfile, Meal } from '../types';

export interface SupabaseUserProfile extends UserProfile {
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseMeal extends Meal {
  user_id: string;
  created_at?: string;
}

// User Profile Operations
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No profile found
      throw error;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function upsertUserProfile(userId: string, profile: UserProfile): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        ...profile,
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error upserting user profile:', error);
    return false;
  }
}

// Meal Operations
export async function getUserMeals(userId: string, date?: string): Promise<Meal[]> {
  try {
    let query = supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (date) {
      // Use the date column for filtering (not created_at timestamp)
      query = query.eq('date', new Date(date).toISOString().split('T')[0]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Supabase error fetching meals:', error);
      throw error;
    }
    
    console.log('✅ Fetched meals from Supabase:', data); // Debug log
    console.log('Number of meals:', data?.length || 0); // Debug log
    
    // Convert database format to app format (meal_slot_id -> mealSlotId)
    const meals = (data || []).map((meal: any) => ({
      id: meal.id,
      mealSlotId: meal.meal_slot_id, // Convert snake_case to camelCase
      name: meal.name,
      items: meal.items,
      totals: meal.totals,
      insights: meal.insights,
    }));
    
    console.log('Formatted meals:', meals); // Debug log
    return meals as Meal[];
  } catch (error) {
    console.error('❌ Error fetching meals:', error);
    return [];
  }
}

export async function addMeal(userId: string, meal: Meal): Promise<boolean> {
  try {
    const mealData = {
      user_id: userId,
      name: meal.name,
      items: meal.items, // Supabase will handle JSONB automatically
      totals: meal.totals, // Supabase will handle JSONB automatically
      insights: meal.insights || [],
      timestamp: (meal as any).timestamp || new Date().toISOString(),
      date: new Date().toISOString().split('T')[0], // Store date as YYYY-MM-DD
      meal_slot_id: meal.mealSlotId || 'custom', // Use mealSlotId from the meal object
      created_at: new Date().toISOString(),
    };
    
    console.log('Inserting meal into Supabase:', mealData); // Debug log
    console.log('User ID:', userId); // Debug log
    
    const { data, error } = await supabase
      .from('meals')
      .insert(mealData)
      .select();

    if (error) {
      console.error('❌ Supabase error adding meal:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      throw error;
    }
    
    console.log('✅ Meal inserted successfully:', data); // Debug log
    return true;
  } catch (error) {
    console.error('❌ Error adding meal:', error);
    return false;
  }
}

export async function deleteMeal(mealId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', mealId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting meal:', error);
    return false;
  }
}

// Real-time subscriptions
export function subscribeToMeals(userId: string, callback: (meals: Meal[]) => void) {
  const subscription = supabase
    .channel('meals_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'meals',
        filter: `user_id=eq.${userId}`,
      },
      async () => {
        const meals = await getUserMeals(userId, new Date().toLocaleDateString());
        callback(meals);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

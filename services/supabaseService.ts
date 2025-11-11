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
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query = query
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []) as Meal[];
  } catch (error) {
    console.error('Error fetching meals:', error);
    return [];
  }
}

export async function addMeal(userId: string, meal: Meal): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('meals')
      .insert({
        user_id: userId,
        ...meal,
        created_at: new Date().toISOString(),
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding meal:', error);
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

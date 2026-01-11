import { useState, useEffect } from "react";
import api from "@/services/api"; // Using existing axios instance
import { useAuth } from "./useAuth";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  company: string | null;
  role: string | null;
  avatar_url: string | null;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/auth/user/');
      const data = response.data;

      setProfile({
        id: data.pk?.toString() || data.id?.toString(),
        user_id: data.pk?.toString() || data.id?.toString(),
        full_name: data.full_name || `${data.first_name} ${data.last_name}`,
        company: data.company,
        role: data.role,
        avatar_url: null // Not implemented yet
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Pick<Profile, "full_name" | "company" | "role">>) => {
    try {
      const payload: any = {};
      if (updates.full_name !== undefined) payload.full_name_update = updates.full_name;
      if (updates.company !== undefined) payload.company = updates.company;
      if (updates.role !== undefined) payload.role = updates.role;

      const response = await api.patch('/api/auth/user/', payload);
      const data = response.data;

      // Update local state with returned data
      setProfile(prev => prev ? {
        ...prev,
        full_name: data.full_name,
        company: data.company,
        role: data.role
      } : null);

      return { error: null };
    } catch (error: any) {
      console.error("Error updating profile:", error);
      return { error: error };
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile,
  };
}

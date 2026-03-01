import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/schema.js";

async function fetchUser(): Promise<User | null> {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  const response = await fetch("/api/auth/user", {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    return null;
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
}

async function logout(): Promise<void> {
  const token = localStorage.getItem('accessToken');
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    await fetch("/api/auth/logout", {
      method: 'POST',
      headers
    });
  } catch (error) {
    console.error("Logout request failed", error);
  } finally {
    localStorage.removeItem('accessToken');
    window.location.href = "/";
  }
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}

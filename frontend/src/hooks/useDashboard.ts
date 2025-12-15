import { useQuery } from '@tanstack/react-query';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard');
      return res.json();
    }
  });
}
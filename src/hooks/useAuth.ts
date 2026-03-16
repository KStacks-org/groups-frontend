import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";

import type { AuthUser } from "@/types/auth-user";


export function useAuth() {
	const {
		data: user = null,
		isLoading,
		isError,
		refetch,
	} = useQuery<AuthUser | null>({
		queryKey: ["authUser"],
		queryFn: async () => {
			const res = await api.get<AuthUser>("/auth/me");
			return res.data;
		},
		retry: false,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	return {
		user,
		isLoading,
		isAuthenticated: !!user,
		isError,
		refetch,
	};
}

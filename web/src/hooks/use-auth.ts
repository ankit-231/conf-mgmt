import { userKeys } from "@/config/query-keys";
import { authService } from "@/services/auth.service";
import { tokenStorage } from "@/utils/token-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.getToken,
    onSuccess: async (res) => {
      const { access, refresh } = res.data;

      await tokenStorage.saveAccessToken(access);
      await tokenStorage.saveRefreshToken(refresh);

      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.blacklistToken,
    onSuccess: async () => {
      await tokenStorage.clearAllTokens();

      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
}

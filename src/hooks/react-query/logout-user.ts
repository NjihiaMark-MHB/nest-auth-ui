import { useMutation } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";

const logoutUser = async () => {
  const response = await apiClient.post("/auth/signout");
  return response.data;
};

export function useLogoutUser() {
  return useMutation({
    mutationFn: logoutUser,
  });
}

import { useMutation } from "@tanstack/react-query";
import type { inferredLoginSchema } from "../../types/login";
import apiClient from "../../api/apiClient";

const loginUser = async (data: inferredLoginSchema) => {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
};

export function useLoginUser() {
  return useMutation({
    mutationFn: loginUser,
  });
}

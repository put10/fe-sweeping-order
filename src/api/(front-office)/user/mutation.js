import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userApi } from "./api";

export const useUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-user"],
    mutationFn: userApi.createUser,
    onSuccess: (data) => {
      toast.success(data.message || "User created successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-users"] });
    },
    onError: (error) => {
      if (error.response) {
        const responseData = error.response.data;

        const errorMessage =
          typeof responseData.message === "object" && responseData.message.error
            ? responseData.message.error
            : typeof responseData.message === "string"
              ? responseData.message
              : "Please try again";

        toast.error(`Failed to create user: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-user"],
    mutationFn: (data) => userApi.updateUser(data),
    onSuccess: (data) => {
      toast.success(data.message || "User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-users"] });
    },
    onError: (error) => {
      if (error.response) {
        const responseData = error.response.data;

        const errorMessage =
          typeof responseData.message === "object" && responseData.message.error
            ? responseData.message.error
            : typeof responseData.message === "string"
              ? responseData.message
              : "Please try again";

        toast.error(`Failed to update user: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-user"],
    mutationFn: ({ id_user }) => userApi.deleteUser(id_user),
    onSuccess: (data) => {
      toast.success(data.message || "User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-users"] });
    },
    onError: (error) => {
      if (error.response) {
        const responseData = error.response.data;

        const errorMessage =
          typeof responseData.message === "object" && responseData.message.error
            ? responseData.message.error
            : typeof responseData.message === "string"
              ? responseData.message
              : "Please try again";

        toast.error(`Failed to delete user: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cooperationApi } from "./api";

export const useCooperationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-cooperation"],
    mutationFn: cooperationApi.createCooperation,
    onSuccess: (data) => {
      toast.success(data.message || "Kerjasama created successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-cooperation"] });
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

        toast.error(`Failed to create kerjasama: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useUpdateCooperationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-cooperation"],
    mutationFn: (data) => cooperationApi.updateCooperation(data),
    onSuccess: (data) => {
      toast.success(data.message || "Kerjasama updated successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-cooperation"] });
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

        toast.error(`Failed to update kerjasama: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useDeleteCooperationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-cooperation"],
    mutationFn: ({ id_kerjasama }) =>
      cooperationApi.deleteCooperation(id_kerjasama),
    onSuccess: (data) => {
      toast.success(data.message || "Kerjasama deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-cooperation"] });
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

        toast.error(`Failed to delete kerjasama: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

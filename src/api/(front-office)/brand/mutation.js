import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { brandApi } from "./api";

export const useBrandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-brand"],
    mutationFn: brandApi.createBrand,
    onSuccess: (data) => {
      toast.success(data.message || "Brand created successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-brand"] });
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

        toast.error(`Failed to create brand: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useUpdateBrandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-brand"],
    mutationFn: (data) => brandApi.updateBrand(data),
    onSuccess: (data) => {
      toast.success(data.message || "Brand updated successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-brand"] });
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

        toast.error(`Failed to update brand: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useDeleteBrandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-brand"],
    mutationFn: ({ id_brand }) => brandApi.deleteBrand(id_brand),
    onSuccess: (data) => {
      toast.success(data.message || "Brand deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-brand"] });
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

        toast.error(`Failed to delete brand: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

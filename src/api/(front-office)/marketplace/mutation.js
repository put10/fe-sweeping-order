import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { marketplaceApi } from "./api";

export const useMarketplaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-marketplace"],
    mutationFn: marketplaceApi.createMarketplace,
    onSuccess: (data) => {
      toast.success(data.message || "Marketplace created successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-marketplaces"] });
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

        toast.error(`Failed to create marketplace: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useUpdateMarketplaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-marketplace"],
    mutationFn: (data) => marketplaceApi.updateMarketplace(data),
    onSuccess: (data) => {
      toast.success(data.message || "Marketplace updated successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-marketplaces"] });
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

        toast.error(`Failed to update marketplace: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useDeleteMarketplaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-marketplace"],
    mutationFn: ({ id_marketplace }) =>
      marketplaceApi.deleteMarketplace(id_marketplace),
    onSuccess: (data) => {
      toast.success(data.message || "Marketplace deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-marketplaces"] });
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

        toast.error(`Failed to delete marketplace: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

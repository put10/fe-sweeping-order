import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { shippingApi } from "./api";

export const useShippingServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-shipping-service"],
    mutationFn: shippingApi.createShippingService,
    onSuccess: (data) => {
      toast.success(data.message || "Shipping service created successfully");
      queryClient.invalidateQueries({
        queryKey: ["get-all-shipping-services"],
      });
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

        toast.error(`Failed to create shipping service: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useUpdateShippingServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-shipping-service"],
    mutationFn: (data) => shippingApi.updateShippingService(data),
    onSuccess: (data) => {
      toast.success(data.message || "Shipping service updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["get-all-shipping-services"],
      });
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

        toast.error(`Failed to update shipping service: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useDeleteShippingServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-shipping-service"],
    mutationFn: ({ id_jasa }) => shippingApi.deleteShippingService(id_jasa),
    onSuccess: (data) => {
      toast.success(data.message || "Shipping service deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["get-all-shipping-services"],
      });
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

        toast.error(`Failed to delete shipping service: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

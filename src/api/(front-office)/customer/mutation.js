import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { customerApi } from "./api";

export const useCustomerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-customer"],
    mutationFn: customerApi.createCustomer,
    onSuccess: (data) => {
      toast.success(data.message || "Customer created successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-customer"] });
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

        toast.error(`Failed to create customer: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useUpdateCustomerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-customer"],
    mutationFn: (data) => customerApi.updateCustomer(data),
    onSuccess: (data) => {
      toast.success(data.message || "Customer updated successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-customer"] });
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

        toast.error(`Failed to update customer: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useDeleteCustomerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-customer"],
    mutationFn: ({ id_pembeli }) => customerApi.deleteCustomer(id_pembeli),
    onSuccess: (data) => {
      toast.success(data.message || "Customer deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-customer"] });
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

        toast.error(`Failed to delete customer: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

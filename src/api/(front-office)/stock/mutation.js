import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { stockApi } from "./api";

export const useAddStockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-stock"],
    mutationFn: stockApi.addStock,
    onSuccess: (data) => {
      toast.success(data.message || "Stock added successfully");
      queryClient.invalidateQueries({ queryKey: ["get-stock-by-product"] });
      queryClient.invalidateQueries({ queryKey: ["get-out-stock-history"] });
      queryClient.invalidateQueries({ queryKey: ["get-in-stock-history"] });
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

        toast.error(`Failed to add stock: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useRemoveStockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["remove-stock"],
    mutationFn: stockApi.removeStock,
    onSuccess: (data) => {
      toast.success(data.message || "Stock removed successfully");
      queryClient.invalidateQueries({ queryKey: ["get-stock-by-product"] });
      queryClient.invalidateQueries({ queryKey: ["get-out-stock-history"] });
      queryClient.invalidateQueries({ queryKey: ["get-in-stock-history"] });
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

        toast.error(`Failed to remove stock: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

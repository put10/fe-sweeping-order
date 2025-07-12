import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productApi } from "./api";

export const useProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-product"],
    mutationFn: productApi.createProduct,
    onSuccess: (data) => {
      toast.success(data.message || "Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-product"] });
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

        toast.error(`Failed to create product: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-product"],
    mutationFn: (data) => productApi.updateProduct(data),
    onSuccess: (data) => {
      toast.success(data.message || "Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-product"] });
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

        toast.error(`Failed to update product: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-product"],
    mutationFn: ({ id_produk }) => productApi.deleteProduct(id_produk),
    onSuccess: (data) => {
      toast.success(data.message || "Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-product"] });
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

        toast.error(`Failed to delete product: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

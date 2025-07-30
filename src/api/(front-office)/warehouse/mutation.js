import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { warehouseApi } from "./api";

export const useWarehouseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-warehouse"],
    mutationFn: warehouseApi.createWarehouse,
    onSuccess: (data) => {
      toast.success(data.message || "Warehouse created successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-warehouse"] });
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

        toast.error(`Failed to create warehouse: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useUpdateWarehouseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-warehouse"],
    mutationFn: (data) => warehouseApi.updateWarehouse(data),
    onSuccess: (data) => {
      toast.success(data.message || "Warehouse updated successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-warehouse"] });
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

        toast.error(`Failed to update warehouse: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useDeleteWarehouseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-warehouse"],
    mutationFn: (id_warehouse) => warehouseApi.deleteWarehouse(id_warehouse),
    onSuccess: (data) => {
      toast.success(data.message || "Warehouse deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-warehouse"] });
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

        toast.error(`Failed to delete warehouse: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { shippingApi } from "./api";

export const useCreateShippingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-shipping"],
    mutationFn: shippingApi.createShipping,
    onSuccess: (data) => {
      toast.success(data.message || "Shipping created successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-orders"] });
      queryClient.invalidateQueries({ queryKey: ["get-all-printing"] });
      queryClient.invalidateQueries({ queryKey: ["get-all-packing"] });
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

        toast.error(`Failed to create shipping: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useExportFilteredShippingMutation = () => {
  return useMutation({
    mutationKey: ["export-filtered-shipping"],
    mutationFn: shippingApi.exportFilteredShipping,
    onSuccess: (response) => {
      const excelBlob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(excelBlob);
      link.download = "shipping_filtered.xlsx";
      link.click();

      toast.success("Filtered shipping data exported successfully");
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

        toast.error(`Failed to export shipping data: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useImportShippingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["import-shipping"],
    mutationFn: shippingApi.importShipping,
    onSuccess: (data) => {
      toast.success(data.message || "Shipping data imported successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-orders"] });
      queryClient.invalidateQueries({ queryKey: ["get-all-shipping"] });
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

        toast.error(`Failed to import shipping data: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useCreateShippingManyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-shipping-many"],
    mutationFn: shippingApi.createShippingMany,
    onSuccess: (data) => {
      toast.success(data.message || "Shipping created successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-orders"] });
      queryClient.invalidateQueries({ queryKey: ["get-all-shipping"] });
      queryClient.invalidateQueries({ queryKey: ["get-shipping-ready"] });
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

        toast.error(`Failed to create shipping: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useExportSelectedShippingMutation = () => {
  return useMutation({
    mutationKey: ["export-selected-shipping"],
    mutationFn: shippingApi.exportSelectedShipping,
    onSuccess: (response) => {
      const excelBlob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(excelBlob);
      link.download = "selected_shipping.xlsx";
      link.click();

      toast.success("Selected shipping items exported successfully");
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

        toast.error(`Failed to export shipping items: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

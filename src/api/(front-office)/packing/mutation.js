import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { packingApi } from "./api";

export const useCreatePackingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-packing"],
    mutationFn: packingApi.createPacking,
    onSuccess: (data) => {
      toast.success(data.message || "Packing created successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-orders"] });
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

        toast.error(`Failed to create packing: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useExportFilteredPackingMutation = () => {
  return useMutation({
    mutationKey: ["export-filtered-packing"],
    mutationFn: packingApi.exportFilteredPacking,
    onSuccess: (response) => {
      const excelBlob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(excelBlob);
      link.download = "packing_filtered.xlsx";
      link.click();

      toast.success("Filtered packing data exported successfully");
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

        toast.error(`Failed to export packing data: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useImportPackingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["import-packing"],
    mutationFn: packingApi.importPacking,
    onSuccess: (data) => {
      toast.success(data.message || "Packing data imported successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-orders"] });
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

        toast.error(`Failed to import packing data: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useCreatePackingManyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-packing-many"],
    mutationFn: packingApi.createPackingMany,
    onSuccess: (data) => {
      toast.success(data.message || "Packings created successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-orders"] });
      queryClient.invalidateQueries({ queryKey: ["get-all-packing"] });
      queryClient.invalidateQueries({ queryKey: ["get-packing-ready"] });
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

        toast.error(`Failed to create packings: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useExportSelectedPackingMutation = () => {
  return useMutation({
    mutationKey: ["export-selected-packing"],
    mutationFn: packingApi.exportSelectedPacking,
    onSuccess: (response) => {
      const excelBlob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(excelBlob);
      link.download = "selected_packing.xlsx";
      link.click();

      toast.success("Selected packing items exported successfully");
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

        toast.error(`Failed to export packing items: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

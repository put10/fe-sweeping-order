import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { printingApi } from "./api";

export const useCreatePrintingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-printing"],
    mutationFn: printingApi.createPrinting,
    onSuccess: (data) => {
      toast.success(data.message || "Printing created successfully");
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

        toast.error(`Failed to create printing: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useExportFilteredPrintingMutation = () => {
  return useMutation({
    mutationKey: ["export-filtered-printing"],
    mutationFn: printingApi.exportFilteredPrinting,
    onSuccess: (response) => {
      const excelBlob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(excelBlob);
      link.download = "printing_filtered.xlsx";
      link.click();

      toast.success("Filtered printing data exported successfully");
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

        toast.error(`Failed to export printing data: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useImportPrintingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["import-printing"],
    mutationFn: printingApi.importPrinting,
    onSuccess: (data) => {
      toast.success(data.message || "Printing data imported successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-orders"] });
      queryClient.invalidateQueries({ queryKey: ["get-all-printing"] });
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

        toast.error(`Failed to import printing data: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useCreatePrintingManyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-printing-many"],
    mutationFn: printingApi.createPrintingMany,
    onSuccess: (data) => {
      toast.success(data.message || "Printings created successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-orders"] });
      queryClient.invalidateQueries({ queryKey: ["get-all-printing"] });
      queryClient.invalidateQueries({ queryKey: ["get-printing-ready"] });
      queryClient.invalidateQueries({ queryKey: ["get-packing-ready"] });
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

        toast.error(`Failed to create printings: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useExportSelectedPrintingMutation = () => {
  return useMutation({
    mutationKey: ["export-selected-printing"],
    mutationFn: printingApi.exportSelectedPrinting,
    onSuccess: (response) => {
      const excelBlob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(excelBlob);
      link.download = "selected_printing.xlsx";
      link.click();

      toast.success("Selected printing items exported successfully");
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

        toast.error(`Failed to export printing items: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sweepingOrderApi } from "./api";

export const useImportSweepingOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["import-sweeping-order"],
    mutationFn: sweepingOrderApi.importSweepingOrder,
    onSuccess: (data) => {
      toast.success(
        data.message || "Sweeping order data imported successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["get-all-sweeping-orders"] });
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

        toast.error(`Failed to import sweeping order data: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useExportFilteredSweepingOrdersMutation = () => {
  return useMutation({
    mutationKey: ["export-filtered-sweeping-orders"],
    mutationFn: sweepingOrderApi.exportFilteredSweepingOrders,
    onSuccess: (response) => {
      const excelBlob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(excelBlob);
      link.download = "filtered_sweeping_orders.xlsx";
      link.click();

      toast.success("Sweeping orders exported successfully");
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

        toast.error(`Failed to export sweeping orders: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useCreateSweepingOrderManyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-sweeping-order-many"],
    mutationFn: sweepingOrderApi.createSweepingOrderMany,
    onSuccess: (data) => {
      toast.success(data.message || "Sweeping orders created successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-sweeping-orders"] });
      queryClient.invalidateQueries({ queryKey: ["get-all-orders"] });
      queryClient.invalidateQueries({ queryKey: ["get-sweeping-ready"] });
      queryClient.invalidateQueries({ queryKey: ["get-printing-ready"] });
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

        toast.error(`Failed to create sweeping orders: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orderApi } from "./api";

export const useGenerateOrdersMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["generate-orders"],
    mutationFn: orderApi.generateOrders,
    onSuccess: () => {
      toast.success(`Orders generated successfully`);
      queryClient.invalidateQueries({ queryKey: ["get-all-orders"] });
      queryClient.invalidateQueries({
        queryKey: ["get-last-five-minutes-orders"],
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

        toast.error(`Failed to generate orders: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useExportOrdersMutation = () => {
  return useMutation({
    mutationKey: ["export-orders"],
    mutationFn: orderApi.getExportLastFiveMinutesOrders,
    onSuccess: (response) => {
      const excelBlob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(excelBlob);
      link.download = "pesanan_last_five_minutes.xlsx";
      link.click();

      toast.success("Orders exported successfully");
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

        toast.error(`Failed to export orders: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const useExportFilteredOrdersMutation = () => {
  return useMutation({
    mutationKey: ["export-filtered-orders"],
    mutationFn: orderApi.exportFilteredOrders,
    onSuccess: (response) => {
      const excelBlob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(excelBlob);
      link.download = "filtered_orders.xlsx";
      link.click();

      toast.success("Filtered orders exported successfully");
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

        toast.error(`Failed to export orders: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

export const usePatchStatusPesananMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["patch-status-pesanan"],
    mutationFn: ({ idPesanan, status }) =>
      orderApi.patchStatusPesanan(idPesanan, status),
    onSuccess: (data) => {
      toast.success("Order status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["get-all-orders"] });
      queryClient.invalidateQueries({
        queryKey: ["get-orders-by-id", data.data.id_pesanan],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-last-five-minutes-orders"],
      });
      queryClient.invalidateQueries({ queryKey: ["filter-orders"] });
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

        toast.error(`Failed to update order status: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Error: " + (error.message || "Please try again"));
      }
    },
  });
};

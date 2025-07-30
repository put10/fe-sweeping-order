import { useQuery } from "@tanstack/react-query";
import { sweepingOrderApi } from "./api";

export const useGetAllSweepingOrders = () => {
  return useQuery({
    queryKey: ["get-all-sweeping-orders"],
    queryFn: () => sweepingOrderApi.getAllSweepingOrders(),
  });
};

export const useGetSweepingOrderById = (id_proses) => {
  return useQuery({
    queryKey: ["get-sweeping-order", id_proses],
    queryFn: () => sweepingOrderApi.getSweepingOrderById(id_proses),
    enabled: !!id_proses,
  });
};

export const useGetSweepingReady = () => {
  return useQuery({
    queryKey: ["get-sweeping-ready"],
    queryFn: () => sweepingOrderApi.getSweepingReady(),
  });
};

export const useSearchSweepingOrder = (params) => {
  return useQuery({
    queryKey: ["search-sweeping-order", params],
    queryFn: () => sweepingOrderApi.searchSweepingOrder(params),
    enabled: !!(params.id_proses || params.id_pesanan),
  });
};

export const useFilterSweepingOrder = (params) => {
  return useQuery({
    queryKey: ["filter-sweeping-order", params],
    queryFn: () => sweepingOrderApi.filterSweepingOrder(params),
    enabled: !!(
      params.status_proses ||
      params.status_pesanan ||
      params.start_date ||
      params.end_date
    ),
  });
};

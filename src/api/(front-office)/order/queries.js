import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/api/(front-office)/order/api";

export const useGetAllOrders = () => {
  return useQuery({
    queryKey: ["get-all-orders"],
    queryFn: () => orderApi.getAllOrders(),
  });
};

export const useGetSearchOrders = (search) => {
  return useQuery({
    queryKey: ["get-search-orders", search],
    queryFn: () => orderApi.getSearchOrders(search),
    enabled: !!search,
  });
};

export const useGetOrdersById = (id_pesanan) => {
  return useQuery({
    queryKey: ["get-orders-by-id", id_pesanan],
    queryFn: () => orderApi.getOrdersById(id_pesanan),
  });
};

export const useGetLastFiveMinutesOrders = () => {
  return useQuery({
    queryKey: ["get-last-five-minutes-orders"],
    queryFn: () => orderApi.getLastFiveMinutesOrders(),
  });
};

export const useFilterOrders = (params) => {
  return useQuery({
    queryKey: ["filter-orders", params],
    queryFn: () => orderApi.filterOrders(params),
    enabled: !!(
      params.id_brand ||
      params.id_marketplace ||
      params.id_jasa_pengiriman ||
      params.status_pesanan ||
      params.start_date ||
      params.end_date
    ),
  });
};

export const useGetOrdersSedangDikirim = (params = {}) => {
  return useQuery({
    queryKey: ["orders-sedang-dikirim", params],
    queryFn: () => orderApi.getOrdersSedangDikirim(params),
  });
};

export const useGetOrdersSedangDikirimByBrand = (id_brand) => {
  return useQuery({
    queryKey: ["orders-sedang-dikirim-by-brand", id_brand],
    queryFn: () => orderApi.getOrdersSedangDikirimByBrand(id_brand),
    enabled: !!id_brand,
  });
};

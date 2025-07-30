import { useQuery } from "@tanstack/react-query";
import { shippingApi } from "./api";

export const useGetAllShipping = () => {
  return useQuery({
    queryKey: ["get-all-shipping"],
    queryFn: () => shippingApi.getAllShipping(),
  });
};

export const useGetShippingById = (id_pengiriman) => {
  return useQuery({
    queryKey: ["get-shipping", id_pengiriman],
    queryFn: () => shippingApi.getShippingById(id_pengiriman),
    enabled: !!id_pengiriman,
  });
};

export const useGetShippingReady = () => {
  return useQuery({
    queryKey: ["get-shipping-ready"],
    queryFn: () => shippingApi.getShippingReady(),
  });
};

export const useSearchShipping = (search) => {
  return useQuery({
    queryKey: ["search-shipping", search],
    queryFn: () => shippingApi.searchShipping(search),
    enabled: !!search,
  });
};

export const useFilterShipping = (params) => {
  return useQuery({
    queryKey: ["filter-shipping", params],
    queryFn: () => shippingApi.filterShipping(params),
    enabled: !!(params.start_date && params.end_date) || !!params.brand,
  });
};

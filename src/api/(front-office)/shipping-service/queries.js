import { useQuery } from "@tanstack/react-query";
import { shippingApi } from "./api";

export const useGetAllShippingServices = () => {
  return useQuery({
    queryKey: ["get-all-shipping-services"],
    queryFn: () => shippingApi.getAllShippingServices(),
  });
};

export const useGetSearchShippingService = (search) => {
  return useQuery({
    queryKey: ["get-search-shipping-service", search],
    queryFn: () => shippingApi.getSearchShippingService(search),
    enabled: !!search,
  });
};

export const useGetShippingServiceById = (id_jasa) => {
  return useQuery({
    queryKey: ["get-shipping-service", id_jasa],
    queryFn: () => shippingApi.getShippingServiceById(id_jasa),
    enabled: !!id_jasa,
  });
};

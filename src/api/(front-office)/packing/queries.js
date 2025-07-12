import { useQuery } from "@tanstack/react-query";
import { packingApi } from "./api";

export const useGetAllPacking = () => {
  return useQuery({
    queryKey: ["get-all-packing"],
    queryFn: () => packingApi.getAllPacking(),
  });
};

export const useGetPackingById = (id_packing) => {
  return useQuery({
    queryKey: ["get-packing", id_packing],
    queryFn: () => packingApi.getPackingById(id_packing),
  });
};

export const useSearchPacking = (params) => {
  return useQuery({
    queryKey: ["search-packing", params],
    queryFn: () => packingApi.searchPacking(params),
    enabled: !!(params.id_packing || params.id_pencetakan || params.id_pesanan),
  });
};

export const useFilterPacking = (params) => {
  return useQuery({
    queryKey: ["filter-packing", params],
    queryFn: () => packingApi.filterPacking(params),
    enabled: !!(params.start_date && params.end_date),
  });
};

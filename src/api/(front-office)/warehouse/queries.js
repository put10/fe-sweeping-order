import { useQuery } from "@tanstack/react-query";
import { warehouseApi } from "./api";

export const useGetAllWarehouse = () => {
  return useQuery({
    queryKey: ["get-all-warehouse"],
    queryFn: () => warehouseApi.getAllWarehouses(),
  });
};

export const useGetSearchWarehouse = (search) => {
  return useQuery({
    queryKey: ["get-search-warehouse", search],
    queryFn: () => warehouseApi.getSearchWarehouse(search),
    enabled: !!search,
  });
};

export const useGetWarehouseById = (id_gudang) => {
  return useQuery({
    queryKey: ["get-warehouse", id_gudang],
    queryFn: () => warehouseApi.getWarehouseById(id_gudang),
    enabled: !!id_gudang,
  });
};

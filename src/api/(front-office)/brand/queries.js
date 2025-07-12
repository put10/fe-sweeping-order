import { useQuery } from "@tanstack/react-query";
import { brandApi } from "@/api/(front-office)/brand/api";

export const useGetAllBrand = () => {
  return useQuery({
    queryKey: ["get-all-brand"],
    queryFn: () => brandApi.getAllBrand(),
  });
};

export const useGetSearchBrand = (search) => {
  return useQuery({
    queryKey: ["get-search-brand", search],
    queryFn: () => brandApi.getSearchBrand(search),
    enabled: !!search,
  });
};

export const useGetBrandById = (id_brand) => {
  return useQuery({
    queryKey: ["get-brand", id_brand],
    queryFn: () => brandApi.getBrandById(id_brand),
    enabled: !!id_brand,
  });
};

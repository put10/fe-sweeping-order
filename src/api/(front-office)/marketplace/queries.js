import { useQuery } from "@tanstack/react-query";
import { marketplaceApi } from "./api";

export const useGetAllMarketplaces = () => {
  return useQuery({
    queryKey: ["get-all-marketplaces"],
    queryFn: () => marketplaceApi.getAllMarketplaces(),
  });
};

export const useGetSearchMarketplace = (search) => {
  return useQuery({
    queryKey: ["get-search-marketplace", search],
    queryFn: () => marketplaceApi.getSearchMarketplace(search),
    enabled: !!search,
  });
};

export const useGetMarketplaceById = (id_marketplace) => {
  return useQuery({
    queryKey: ["get-marketplace", id_marketplace],
    queryFn: () => marketplaceApi.getMarketplaceById(id_marketplace),
    enabled: !!id_marketplace,
  });
};

import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/api/(front-office)/product/api";

export const useGetAllProduct = () => {
  return useQuery({
    queryKey: ["get-all-product"],
    queryFn: () => productApi.getAllProduct(),
  });
};

export const useGetSearchProduct = (search) => {
  return useQuery({
    queryKey: ["get-search-product", search],
    queryFn: () => productApi.getSearchProduct(search),
    enabled: !!search,
  });
};

export const useGetProductById = (id_produk) => {
  return useQuery({
    queryKey: ["get-product", id_produk],
    queryFn: () => productApi.getProductById(id_produk),
    enabled: !!id_produk,
  });
};

export const useFilterProductByBrand = (id_brand) => {
  return useQuery({
    queryKey: ["filter-product-by-brand", id_brand],
    queryFn: () => productApi.filterProductByBrand(id_brand),
    enabled: !!id_brand,
  });
};

export const useGetBestsellingProducts = (params) => {
  const { month, year, limit } = params || {};

  return useQuery({
    queryKey: ["get-bestselling-products", month, year, limit],
    queryFn: () => productApi.getBestsellingProducts({ month, year, limit }),
    enabled: !!month,
  });
};

export const useGetProductsByStock = (limit) => {
  return useQuery({
    queryKey: ["get-products-by-stock", limit],
    queryFn: () => productApi.getProductsByStock(limit),
  });
};

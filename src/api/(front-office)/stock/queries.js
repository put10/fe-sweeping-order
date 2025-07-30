import { useQuery } from "@tanstack/react-query";
import { stockApi } from "@/api/(front-office)/stock/api";

export const useGetStockByProduct = () => {
  return useQuery({
    queryKey: ["get-stock-by-product"],
    queryFn: stockApi.getStockByProduct,
  });
};

export const useGetStockByHistoryProduct = (id_produk) => {
  return useQuery({
    queryKey: ["get-stock-by-history-product", id_produk],
    queryFn: () => stockApi.getStockByHistoryProduct(id_produk),
    enabled: !!id_produk,
  });
};

export const useGetFilterStockByHistoryProduct = (id_produk) => {
  return useQuery({
    queryKey: ["get-filter-stock-by-history-product", id_produk],
    queryFn: () => stockApi.getFilterStockByHistoryProduct(id_produk),
    enabled: !!id_produk,
  });
};

export const useGetStockByHistory = () => {
  return useQuery({
    queryKey: ["get-stock-by-history"],
    queryFn: stockApi.getStockByHistory,
  });
};

export const useGetInStockHistory = () => {
  return useQuery({
    queryKey: ["get-in-stock-history"],
    queryFn: stockApi.getInStockHistory,
  });
};

export const useGetOutStockHistory = () => {
  return useQuery({
    queryKey: ["get-out-stock-history"],
    queryFn: stockApi.getOutStockHistory,
  });
};

export const useGetOutStockHistoryByOrder = () => {
  return useQuery({
    queryKey: ["get-out-stock-history-by-order"],
    queryFn: stockApi.getOutStockHistoryByOrder,
  });
};

export const useSearchStockByProduct = (search) => {
  return useQuery({
    queryKey: ["get-stock-by-search", search],
    queryFn: () => stockApi.getSearchStockByProduct(search),
    enabled: !!search,
  });
};

export const useSearchStockByHistoryProduct = (id_produk, tipe_transaksi) => {
  return useQuery({
    queryKey: ["get-stock-by-history-product", id_produk, tipe_transaksi],
    queryFn: () =>
      stockApi.getSearchStockByHistoryProduct(id_produk, tipe_transaksi),
    enabled: !!id_produk && !!tipe_transaksi,
  });
};

export const useNewestStock = () => {
  return useQuery({
    queryKey: ["get-newest-stock"],
    queryFn: stockApi.getNewestStock,
  });
};

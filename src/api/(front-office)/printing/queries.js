import { useQuery } from "@tanstack/react-query";
import { printingApi } from "./api";

export const useGetAllPrinting = () => {
  return useQuery({
    queryKey: ["get-all-printing"],
    queryFn: () => printingApi.getAllPrinting(),
  });
};

export const useGetPrintingById = (id_pencetakan) => {
  return useQuery({
    queryKey: ["get-printing", id_pencetakan],
    queryFn: () => printingApi.getPrintingById(id_pencetakan),
    enabled: !!id_pencetakan,
  });
};

export const useGetPrintingReady = () => {
  return useQuery({
    queryKey: ["get-printing-ready"],
    queryFn: () => printingApi.getPrintingReady(),
  });
};

export const useSearchPrinting = (params) => {
  return useQuery({
    queryKey: ["search-printing", params],
    queryFn: () => printingApi.searchPrinting(params),
    enabled: !!(params.id_pencetakan || params.id_pesanan),
  });
};

export const useFilterPrinting = (params) => {
  return useQuery({
    queryKey: ["filter-printing", params],
    queryFn: () => printingApi.filterPrinting(params),
    enabled: !!(params.start_date && params.end_date) || !!params.brand,
  });
};

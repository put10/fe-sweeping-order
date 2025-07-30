import { useQuery } from "@tanstack/react-query";
import { cooperationApi } from "./api";

export const useGetAllCooperation = () => {
  return useQuery({
    queryKey: ["get-all-cooperation"],
    queryFn: () => cooperationApi.getAllCooperation(),
  });
};

export const useGetCooperationById = (id_kerjasama) => {
  return useQuery({
    queryKey: ["get-cooperation", id_kerjasama],
    queryFn: () => cooperationApi.getCooperationById(id_kerjasama),
    enabled: !!id_kerjasama,
  });
};

export const useFilterCooperationByBrandAndDate = (
  id_brand,
  start_date,
  end_date,
) => {
  return useQuery({
    queryKey: [
      "filter-cooperation-by-brand-and-date",
      id_brand,
      start_date,
      end_date,
    ],
    queryFn: () =>
      cooperationApi.filterCooperationByBrandAndDate(
        id_brand,
        start_date,
        end_date,
      ),
    enabled: !!id_brand && !!start_date && !!end_date,
  });
};

export const useGetExpiringSoonCooperations = (months) => {
  return useQuery({
    queryKey: ["get-expiring-soon-cooperations", months],
    queryFn: () => cooperationApi.getExpiringSoonCooperations(months),
  });
};

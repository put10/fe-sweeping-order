import { useQuery } from "@tanstack/react-query";
import { customerApi } from "@/api/(front-office)/customer/api";

export const useGetAllCustomer = () => {
  return useQuery({
    queryKey: ["get-all-customer"],
    queryFn: () => customerApi.getAllCustomer(),
  });
};

export const useGetSearchCustomer = (search) => {
  return useQuery({
    queryKey: ["get-search-customer", search],
    queryFn: () => customerApi.getSearchCustomer(search),
    enabled: !!search,
  });
};

export const useGetCustomerById = (id_pembeli) => {
  return useQuery({
    queryKey: ["get-customer", id_pembeli],
    queryFn: () => customerApi.getCustomerById(id_pembeli),
    enabled: !!id_pembeli,
  });
};

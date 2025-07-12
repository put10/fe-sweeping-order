import { useQuery } from "@tanstack/react-query";
import { userApi } from "./api";

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["get-all-users"],
    queryFn: () => userApi.getAllUsers(),
  });
};

export const useGetUserById = (id_user) => {
  return useQuery({
    queryKey: ["get-user", id_user],
    queryFn: () => userApi.getUserById(id_user),
    enabled: !!id_user,
  });
};

export const useFilterUsers = (search, role) => {
  return useQuery({
    queryKey: ["filter-users", search, role],
    queryFn: () => userApi.filterUsers(search, role),
    enabled: true,
  });
};

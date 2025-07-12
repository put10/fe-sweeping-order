"use client";

import { useState, useEffect } from "react";
import { useGetAllUsers } from "@/api/(front-office)/user/queries";
import { UserFilter } from "./user-filter";
import { UserTableContent } from "./user-table-content";
import { UserDialog } from "./user-dialog";
import { useFilterUsers } from "@/api/(front-office)/user/queries";

export function UserTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterParams, setFilterParams] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: allUsers, isLoading: allUsersLoading } = useGetAllUsers();
  const { data: filteredUsers, isLoading: filteredUsersLoading } =
    useFilterUsers(debouncedSearch, filterParams.role);

  const hasActiveFilters = !!filterParams.role;
  const users = hasActiveFilters || debouncedSearch ? filteredUsers : allUsers;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterParams]);

  const handleFilterChange = (params) => {
    setFilterParams(params);
    setSearchTerm("");
  };

  const handleSearchChange = (search) => {
    setSearchTerm(search);
    if (hasActiveFilters) {
      setFilterParams({});
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <UserFilter
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          searchTerm={searchTerm}
          disabled={false}
        />
        <div className="flex items-center gap-2">
          <UserDialog />
        </div>
      </div>
      <div className="rounded-md border">
        <UserTableContent
          users={users}
          isLoading={
            hasActiveFilters || debouncedSearch
              ? filteredUsersLoading
              : allUsersLoading
          }
          caption="A list of users."
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}

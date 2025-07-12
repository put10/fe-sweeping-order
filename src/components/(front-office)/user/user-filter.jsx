"use client";

import { useState, useMemo } from "react";
import { FilterIcon, X, Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";

// Define the available roles
const roleOptions = [
  { value: "CEO", label: "CEO" },
  { value: "ADMIN_IT", label: "Admin IT" },
  { value: "ORDER_STAFF", label: "Order Staff" },
  { value: "WAREHOUSE_STAFF", label: "Warehouse Staff" },
  { value: "SHIPPING_STAFF", label: "Shipping Staff" },
  { value: "MANAGER", label: "Manager" },
];

export function UserFilter({
  onFilterChange,
  onSearchChange,
  searchTerm,
  disabled,
}) {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [roleFilterOpen, setRoleFilterOpen] = useState(false);

  const filterParams = useMemo(
    () => ({
      role: selectedRole || undefined,
    }),
    [selectedRole],
  );

  const hasActiveFilters = !!selectedRole;

  const applyFilters = () => {
    onFilterChange(filterParams);
    setFilterDialogOpen(false);
  };

  const clearAllFilters = () => {
    setSelectedRole("");
    onFilterChange({});
  };

  const activeFiltersCount = selectedRole ? 1 : 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by username or email"
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          onClick={() => setFilterDialogOpen(true)}
          className={cn(
            "whitespace-nowrap",
            hasActiveFilters && "border-primary text-primary",
          )}
          disabled={disabled}
          size="sm"
          title="Filter Users"
        >
          <FilterIcon />
          <span className="hidden xs:inline">Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedRole && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Role: {roleOptions.find((r) => r.value === selectedRole)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSelectedRole("");
                  onFilterChange({
                    ...filterParams,
                    role: undefined,
                  });
                }}
              />
            </Badge>
          )}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-6 px-2 text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      )}

      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-[475px]">
          <DialogHeader>
            <DialogTitle>Filter Users</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Role</Label>
              <Popover open={roleFilterOpen} onOpenChange={setRoleFilterOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={roleFilterOpen}
                    className="w-full justify-between"
                  >
                    {selectedRole
                      ? roleOptions.find((role) => role.value === selectedRole)
                          ?.label || "Select role..."
                      : "All roles"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search role..." />
                    <CommandList>
                      <CommandEmpty>No role found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setSelectedRole("");
                            setRoleFilterOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              selectedRole === "" ? "opacity-100" : "opacity-0",
                            )}
                          />
                          All roles
                        </CommandItem>
                        {roleOptions.map((role) => (
                          <CommandItem
                            key={role.value}
                            value={role.value}
                            onSelect={() => {
                              setSelectedRole(role.value);
                              setRoleFilterOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                selectedRole === role.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {role.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={clearAllFilters}>
              Reset Filters
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

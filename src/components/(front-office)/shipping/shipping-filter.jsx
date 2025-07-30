"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  FilterIcon,
  X,
  CalendarIcon,
  Search,
  ChevronsUpDown,
  Check,
} from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

export function ShippingFilter({
  brandOptions = [],
  onFilterChange,
  onSearchChange,
  searchTerm,
  disabled,
  isShippingReady = false,
}) {
  // Filter states
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [brandFilterOpen, setBrandFilterOpen] = useState(false);

  // Build filter params object
  const filterParams = useMemo(
    () => ({
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : "",
      end_date: endDate ? format(endDate, "yyyy-MM-dd") : "",
      brand: selectedBrandId || "",
    }),
    [startDate, endDate, selectedBrandId],
  );

  // Track if any filters are active
  const hasActiveFilters = !!(startDate || endDate || selectedBrandId);

  // Apply filters and close dialog
  const applyFilters = () => {
    onFilterChange(filterParams);
    setFilterDialogOpen(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedBrandId("");

    // Notify parent component
    onFilterChange({ start_date: "", end_date: "", brand: "" });
  };

  // Count active filters for badge
  const activeFiltersCount = [startDate, endDate, selectedBrandId].filter(
    Boolean,
  ).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shipping by ID or Tracking Number"
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Only show filter button if NOT in shipping ready tab */}
        {!isShippingReady && (
          <Button
            variant="outline"
            onClick={() => setFilterDialogOpen(true)}
            className={cn(
              "whitespace-nowrap",
              hasActiveFilters && "border-primary text-primary",
            )}
            disabled={disabled}
            size="sm"
            title="Filter Shipping"
          >
            <FilterIcon />
            <span className="hidden xs:inline">Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedBrandId && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Brand: {selectedBrandId}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSelectedBrandId("");
                  onFilterChange({
                    ...filterParams,
                    brand: "",
                  });
                }}
              />
            </Badge>
          )}
          {startDate && (
            <Badge variant="secondary" className="flex items-center gap-1">
              From: {format(startDate, "yyyy-MM-dd")}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setStartDate(undefined);
                  if (endDate || selectedBrandId) {
                    onFilterChange({
                      ...filterParams,
                      start_date: "",
                    });
                  } else {
                    onFilterChange({
                      start_date: "",
                      end_date: "",
                      brand: "",
                    });
                  }
                }}
              />
            </Badge>
          )}
          {endDate && (
            <Badge variant="secondary" className="flex items-center gap-1">
              To: {format(endDate, "yyyy-MM-dd")}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setEndDate(undefined);
                  if (startDate || selectedBrandId) {
                    onFilterChange({
                      ...filterParams,
                      end_date: "",
                    });
                  } else {
                    onFilterChange({
                      start_date: "",
                      end_date: "",
                      brand: "",
                    });
                  }
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

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-[475px]">
          <DialogHeader>
            <DialogTitle>Filter Shipping</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Brand Filter */}
            <div className="grid gap-2">
              <Label>Brand/Client</Label>
              <Popover open={brandFilterOpen} onOpenChange={setBrandFilterOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={brandFilterOpen}
                    className="w-full justify-between"
                  >
                    {selectedBrandId
                      ? brandOptions.find(
                          (brand) => brand.value === selectedBrandId,
                        )?.label || "Select brand..."
                      : "All brands/clients"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search brand..." />
                    <CommandList>
                      <CommandEmpty>No brand found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setSelectedBrandId("");
                            setBrandFilterOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              selectedBrandId === ""
                                ? "opacity-100"
                                : "opacity-0",
                              "mr-2 h-4 w-4",
                            )}
                          />
                          All brands
                        </CommandItem>
                        {brandOptions.map((brand) => (
                          <CommandItem
                            key={brand.value}
                            value={brand.value}
                            onSelect={() => {
                              setSelectedBrandId(brand.value);
                              setBrandFilterOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                selectedBrandId === brand.value
                                  ? "opacity-100"
                                  : "opacity-0",
                                "mr-2 h-4 w-4",
                              )}
                            />
                            {brand.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Date Range Filter */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "yyyy-MM-dd")
                      ) : (
                        <span>From date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? (
                        format(endDate, "yyyy-MM-dd")
                      ) : (
                        <span>To date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
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

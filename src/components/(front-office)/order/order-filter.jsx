"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  FilterIcon,
  X,
  Check,
  ChevronsUpDown,
  CalendarIcon,
  Search,
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

export function OrderFilter({
  brandOptions,
  marketplaceOptions,
  shippingOptions,
  statusOptions,
  onFilterChange,
  onSearchChange,
  searchTerm,
  disabled,
}) {
  // Filter states
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [brandFilterOpen, setBrandFilterOpen] = useState(false);
  const [selectedMarketplaceId, setSelectedMarketplaceId] = useState("");
  const [marketplaceFilterOpen, setMarketplaceFilterOpen] = useState(false);
  const [selectedShippingId, setSelectedShippingId] = useState("");
  const [shippingFilterOpen, setShippingFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);

  // Build filter params object
  const filterParams = useMemo(
    () => ({
      id_brand: selectedBrandId || undefined,
      id_marketplace: selectedMarketplaceId || undefined,
      id_jasa_pengiriman: selectedShippingId || undefined,
      status_pesanan: selectedStatus || undefined,
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
      end_date: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
    }),
    [
      selectedBrandId,
      selectedMarketplaceId,
      selectedShippingId,
      selectedStatus,
      startDate,
      endDate,
    ],
  );

  // Track if any filters are active
  const hasActiveFilters = !!(
    selectedBrandId ||
    selectedMarketplaceId ||
    selectedShippingId ||
    selectedStatus ||
    startDate ||
    endDate
  );

  // Apply filters and close dialog
  const applyFilters = () => {
    onFilterChange(filterParams);
    setFilterDialogOpen(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedBrandId("");
    setSelectedMarketplaceId("");
    setSelectedShippingId("");
    setSelectedStatus("");
    setStartDate(undefined);
    setEndDate(undefined);

    // Notify parent component
    onFilterChange({});
  };

  // Count active filters for badge
  const activeFiltersCount = [
    selectedBrandId,
    selectedMarketplaceId,
    selectedShippingId,
    selectedStatus,
    startDate,
    endDate,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by Order ID"
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
          title="Filter Orders"
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

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedBrandId && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Brand:{" "}
              {brandOptions.find((b) => b.value === selectedBrandId)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSelectedBrandId("");
                  onFilterChange({
                    ...filterParams,
                    id_brand: undefined,
                  });
                }}
              />
            </Badge>
          )}
          {selectedMarketplaceId && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Marketplace:{" "}
              {
                marketplaceOptions.find(
                  (m) => m.value === selectedMarketplaceId,
                )?.label
              }
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSelectedMarketplaceId("");
                  onFilterChange({
                    ...filterParams,
                    id_marketplace: undefined,
                  });
                }}
              />
            </Badge>
          )}
          {selectedShippingId && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Shipping:{" "}
              {
                shippingOptions.find((s) => s.value === selectedShippingId)
                  ?.label
              }
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSelectedShippingId("");
                  onFilterChange({
                    ...filterParams,
                    id_jasa_pengiriman: undefined,
                  });
                }}
              />
            </Badge>
          )}
          {selectedStatus && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status:{" "}
              {statusOptions.find((s) => s.value === selectedStatus)?.label ||
                selectedStatus}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSelectedStatus("");
                  onFilterChange({
                    ...filterParams,
                    status_pesanan: undefined,
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
                  onFilterChange({
                    ...filterParams,
                    start_date: undefined,
                  });
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
                  onFilterChange({
                    ...filterParams,
                    end_date: undefined,
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

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-[475px]">
          <DialogHeader>
            <DialogTitle>Filter Orders</DialogTitle>
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

            {/* Marketplace Filter */}
            <div className="grid gap-2">
              <Label>Marketplace</Label>
              <Popover
                open={marketplaceFilterOpen}
                onOpenChange={setMarketplaceFilterOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedMarketplaceId
                      ? marketplaceOptions.find(
                          (mp) => mp.value === selectedMarketplaceId,
                        )?.label || "Select marketplace..."
                      : "All marketplaces"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search marketplace..." />
                    <CommandList>
                      <CommandEmpty>No marketplace found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setSelectedMarketplaceId("");
                            setMarketplaceFilterOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              selectedMarketplaceId === ""
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          All marketplaces
                        </CommandItem>
                        {marketplaceOptions.map((mp) => (
                          <CommandItem
                            key={mp.value}
                            value={mp.value}
                            onSelect={() => {
                              setSelectedMarketplaceId(mp.value);
                              setMarketplaceFilterOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                selectedMarketplaceId === mp.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {mp.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Shipping Service Filter */}
            <div className="grid gap-2">
              <Label>Shipping Service</Label>
              <Popover
                open={shippingFilterOpen}
                onOpenChange={setShippingFilterOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedShippingId
                      ? shippingOptions.find(
                          (s) => s.value === selectedShippingId,
                        )?.label || "Select shipping..."
                      : "All shipping services"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search shipping service..." />
                    <CommandList>
                      <CommandEmpty>No shipping service found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setSelectedShippingId("");
                            setShippingFilterOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              selectedShippingId === ""
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          All shipping services
                        </CommandItem>
                        {shippingOptions.map((shipping) => (
                          <CommandItem
                            key={shipping.value}
                            value={shipping.value}
                            onSelect={() => {
                              setSelectedShippingId(shipping.value);
                              setShippingFilterOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                selectedShippingId === shipping.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {shipping.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Status Filter */}
            <div className="grid gap-2">
              <Label>Status</Label>
              <Popover
                open={statusFilterOpen}
                onOpenChange={setStatusFilterOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedStatus
                      ? statusOptions.find((s) => s.value === selectedStatus)
                          ?.label || "Select status..."
                      : "All statuses"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search status..." />
                    <CommandList>
                      <CommandEmpty>No status found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setSelectedStatus("");
                            setStatusFilterOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              selectedStatus === ""
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          All statuses
                        </CommandItem>
                        {statusOptions.map((status) => (
                          <CommandItem
                            key={status.value}
                            value={status.value}
                            onSelect={() => {
                              setSelectedStatus(status.value);
                              setStatusFilterOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                selectedStatus === status.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {status.label}
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
                      <CalendarIcon />
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
                      <CalendarIcon />
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

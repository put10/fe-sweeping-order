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
import { PREDEFINED_STATUS_OPTIONS } from "@/utils/status-formatter";

const PROCESS_STATUS_OPTIONS = [
  { value: "done_interface", label: "Done Interface" },
  { value: "not_interface", label: "Not Interface" },
];

export function SweepingFilter({
  onFilterChange,
  onSearchChange,
  searchTerm,
  disabled,
}) {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedProcessStatus, setSelectedProcessStatus] = useState("");
  const [processStatusFilterOpen, setProcessStatusFilterOpen] = useState(false);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("");
  const [orderStatusFilterOpen, setOrderStatusFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);

  const filterParams = useMemo(
    () => ({
      status_proses: selectedProcessStatus || "",
      status_pesanan: selectedOrderStatus || "",
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : "",
      end_date: endDate ? format(endDate, "yyyy-MM-dd") : "",
    }),
    [selectedProcessStatus, selectedOrderStatus, startDate, endDate],
  );

  const hasActiveFilters = !!(
    selectedProcessStatus ||
    selectedOrderStatus ||
    startDate ||
    endDate
  );

  const applyFilters = () => {
    onFilterChange(filterParams);
    setFilterDialogOpen(false);
  };

  const clearAllFilters = () => {
    setSelectedProcessStatus("");
    setSelectedOrderStatus("");
    setStartDate(undefined);
    setEndDate(undefined);

    onFilterChange({ status_proses: "" });
  };

  const activeFiltersCount = [
    selectedProcessStatus,
    selectedOrderStatus,
    startDate,
    endDate,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sweeping by ID or Order ID"
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
          title="Filter Sweeping Orders"
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
          {selectedProcessStatus && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Process Status:{" "}
              {PROCESS_STATUS_OPTIONS.find(
                (s) => s.value === selectedProcessStatus,
              )?.label || selectedProcessStatus}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSelectedProcessStatus("");
                  onFilterChange({
                    ...filterParams,
                    status_proses: "",
                  });
                }}
              />
            </Badge>
          )}
          {selectedOrderStatus && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Order Status:{" "}
              {PREDEFINED_STATUS_OPTIONS.find(
                (s) => s.value === selectedOrderStatus,
              )?.label || selectedOrderStatus}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSelectedOrderStatus("");
                  onFilterChange({
                    ...filterParams,
                    status_pesanan: "",
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
                  if (endDate || selectedProcessStatus || selectedOrderStatus) {
                    onFilterChange({
                      ...filterParams,
                      start_date: "",
                    });
                  } else {
                    onFilterChange({ status_proses: "" });
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
                  if (
                    startDate ||
                    selectedProcessStatus ||
                    selectedOrderStatus
                  ) {
                    onFilterChange({
                      ...filterParams,
                      end_date: "",
                    });
                  } else {
                    onFilterChange({ status_proses: "" });
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

      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-[475px]">
          <DialogHeader>
            <DialogTitle>Filter Sweeping Orders</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Process Status Filter */}
            <div className="grid gap-2">
              <Label>Process Status</Label>
              <Popover
                open={processStatusFilterOpen}
                onOpenChange={setProcessStatusFilterOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedProcessStatus
                      ? PROCESS_STATUS_OPTIONS.find(
                          (s) => s.value === selectedProcessStatus,
                        )?.label || "Select status..."
                      : "All process statuses"}
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
                            setSelectedProcessStatus("");
                            setProcessStatusFilterOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              selectedProcessStatus === ""
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          All process statuses
                        </CommandItem>
                        {PROCESS_STATUS_OPTIONS.map((status) => (
                          <CommandItem
                            key={status.value}
                            value={status.value}
                            onSelect={() => {
                              setSelectedProcessStatus(status.value);
                              setProcessStatusFilterOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                selectedProcessStatus === status.value
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

            <div className="grid gap-2">
              <Label>Order Status</Label>
              <Popover
                open={orderStatusFilterOpen}
                onOpenChange={setOrderStatusFilterOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedOrderStatus
                      ? PREDEFINED_STATUS_OPTIONS.find(
                          (s) => s.value === selectedOrderStatus,
                        )?.label || "Select status..."
                      : "All order statuses"}
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
                            setSelectedOrderStatus("");
                            setOrderStatusFilterOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              selectedOrderStatus === ""
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          All order statuses
                        </CommandItem>
                        {PREDEFINED_STATUS_OPTIONS.map((status) => (
                          <CommandItem
                            key={status.value}
                            value={status.value}
                            onSelect={() => {
                              setSelectedOrderStatus(status.value);
                              setOrderStatusFilterOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                selectedOrderStatus === status.value
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

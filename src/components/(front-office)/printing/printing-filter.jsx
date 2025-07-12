"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { FilterIcon, X, CalendarIcon, Search } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

export function PrintingFilter({
  onFilterChange,
  onSearchChange,
  searchTerm,
  disabled,
}) {
  // Filter states
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);

  // Build filter params object
  const filterParams = useMemo(
    () => ({
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : "",
      end_date: endDate ? format(endDate, "yyyy-MM-dd") : "",
    }),
    [startDate, endDate],
  );

  // Track if any filters are active
  const hasActiveFilters = !!(startDate || endDate);

  // Apply filters and close dialog
  const applyFilters = () => {
    if (startDate && endDate) {
      onFilterChange(filterParams);
      setFilterDialogOpen(false);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);

    // Notify parent component
    onFilterChange({ start_date: "", end_date: "" });
  };

  // Count active filters for badge
  const activeFiltersCount = [startDate, endDate].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search printing by ID or Order ID"
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
          title="Filter Printing"
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
          {startDate && (
            <Badge variant="secondary" className="flex items-center gap-1">
              From: {format(startDate, "yyyy-MM-dd")}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setStartDate(undefined);
                  if (endDate) {
                    onFilterChange({
                      ...filterParams,
                      start_date: "",
                    });
                  } else {
                    onFilterChange({ start_date: "", end_date: "" });
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
                  if (startDate) {
                    onFilterChange({
                      ...filterParams,
                      end_date: "",
                    });
                  } else {
                    onFilterChange({ start_date: "", end_date: "" });
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
            <DialogTitle>Filter Printing</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
            <Button onClick={applyFilters} disabled={!startDate || !endDate}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

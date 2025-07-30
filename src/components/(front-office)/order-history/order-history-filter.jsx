"use client";

import { useState } from "react";
import { FilterIcon, X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

export default function OrderHistoryFilter({
  brandOptions = [],
  onFilterChange,
  disabled = false,
}) {
  // Filter states
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [brandFilterOpen, setBrandFilterOpen] = useState(false);

  // Apply filters and close dialog
  const applyFilters = () => {
    onFilterChange(selectedBrandId);
    setFilterDialogOpen(false);
  };

  // Clear filter
  const clearFilter = () => {
    setSelectedBrandId("");
    onFilterChange("");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 w-full">
        <Button
          variant="outline"
          onClick={() => setFilterDialogOpen(true)}
          className={cn(
            "whitespace-nowrap",
            selectedBrandId && "border-primary text-primary",
          )}
          disabled={disabled}
          size="sm"
          title="Filter by Client"
        >
          <FilterIcon className="mr-2 h-4 w-4" />
          <span>Filter by Client</span>
          {selectedBrandId && (
            <Badge variant="secondary" className="ml-1">
              1
            </Badge>
          )}
        </Button>
      </div>

      {/* Active Filter Badge */}
      {selectedBrandId && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            Client:{" "}
            {brandOptions.find((b) => b.value === selectedBrandId)?.label}
            <X className="h-3 w-3 cursor-pointer" onClick={clearFilter} />
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilter}
            className="h-6 px-2 text-xs"
          >
            Clear
          </Button>
        </div>
      )}

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Filter by Client</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Client Filter */}
            <div className="grid gap-2">
              <Label>Client</Label>
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
                        )?.label || "Select client..."
                      : "All clients"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search client..." />
                    <CommandList>
                      <CommandEmpty>No client found.</CommandEmpty>
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
                              "mr-2 h-4 w-4",
                              selectedBrandId === ""
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          All clients
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
                                "mr-2 h-4 w-4",
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={clearFilter}>
              Reset
            </Button>
            <Button onClick={applyFilters}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

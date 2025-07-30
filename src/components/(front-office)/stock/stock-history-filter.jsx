"use client";

import { useState } from "react";
import { FilterIcon, X, ChevronsUpDown, Check } from "lucide-react";
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
import { useGetAllProduct } from "@/api/(front-office)/product/queries";
import { useGetFilterStockByHistoryProduct } from "@/api/(front-office)/stock/queries";

export default function StockHistoryFilter({ onFilterChange }) {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [productFilterOpen, setProductFilterOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [appliedProductId, setAppliedProductId] = useState("");
  const hasActiveFilter = !!appliedProductId;

  const { data: products } = useGetAllProduct();
  useGetFilterStockByHistoryProduct(appliedProductId);

  const applyFilter = () => {
    setAppliedProductId(selectedProductId);
    setFilterDialogOpen(false);
    if (onFilterChange) onFilterChange(selectedProductId);
  };

  const clearFilter = () => {
    setSelectedProductId("");
    setAppliedProductId("");
    if (onFilterChange) onFilterChange("");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row items-center gap-3 w-full">
        <Button
          variant="outline"
          onClick={() => setFilterDialogOpen(true)}
          className={cn(
            "whitespace-nowrap",
            hasActiveFilter && "border-primary text-primary",
          )}
          size="sm"
          title="Filter Stock History"
        >
          <FilterIcon />
          <span className="hidden xs:inline">Filters</span>
          {hasActiveFilter && (
            <Badge variant="secondary" className="ml-1">
              1
            </Badge>
          )}
        </Button>
      </div>

      {hasActiveFilter && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            Product:{" "}
            {products?.data?.find((p) => p.id_produk === appliedProductId)
              ?.nama_produk || appliedProductId}
            <X className="h-3 w-3 cursor-pointer" onClick={clearFilter} />
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilter}
            className="h-6 px-2 text-xs"
          >
            Clear All
          </Button>
        </div>
      )}

      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Filter Stock History</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Product</Label>
              <Popover
                open={productFilterOpen}
                onOpenChange={setProductFilterOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedProductId
                      ? products?.data?.find(
                          (p) => p.id_produk === selectedProductId,
                        )?.nama_produk || "Select product..."
                      : "All products"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search product..." />
                    <CommandList>
                      <CommandEmpty>No product found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setSelectedProductId("");
                            setProductFilterOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              selectedProductId === ""
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          All products
                        </CommandItem>
                        {products?.data?.map((product) => (
                          <CommandItem
                            key={product.id_produk}
                            value={product.id_produk}
                            onSelect={() => {
                              setSelectedProductId(product.id_produk);
                              setProductFilterOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                selectedProductId === product.id_produk
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {product.nama_produk}
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
              Reset Filter
            </Button>
            <Button onClick={applyFilter} disabled={!selectedProductId}>
              Apply Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

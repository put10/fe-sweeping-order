"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EyeIcon, MoreHorizontal, Pencil, Trash2Icon } from "lucide-react";
import { PaginationLayout } from "@/components/template/pagination/pagination-layout";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MarketplaceEditForm } from "./marketplace-edit-form";

export function MarketplaceTableContent(props) {
  const totalPages = Math.max(
    1,
    Math.ceil(props.totalItems / props.itemsPerPage),
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMarketplace, setSelectedMarketplace] = useState(undefined);

  const handleEdit = (marketplace) => {
    setSelectedMarketplace(marketplace);
    setEditDialogOpen(true);
  };

  return (
    <>
      <div
        className={
          props.needsHorizontalScroll ? "relative overflow-x-auto" : ""
        }
      >
        <Table className={props.needsHorizontalScroll ? "min-w-full" : ""}>
          <TableHeader>
            <TableRow>
              <TableHead
                className={props.needsHorizontalScroll ? "w-[50px]" : ""}
              >
                No
              </TableHead>
              <TableHead
                className={props.needsHorizontalScroll ? "w-[180px]" : ""}
              >
                Marketplace ID
              </TableHead>
              <TableHead
                className={props.needsHorizontalScroll ? "w-[200px]" : ""}
              >
                Marketplace Name
              </TableHead>
              <TableHead
                className={`sticky right-0 z-20 bg-white ${
                  props.needsHorizontalScroll
                    ? "shadow-[-8px_0_15px_-6px_rgba(0,0,0,0.1)] w-[100px]"
                    : ""
                }`}
              >
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Loading marketplaces...
                </TableCell>
              </TableRow>
            ) : props.currentData.length > 0 ? (
              props.currentData.map((marketplace, index) => (
                <TableRow key={marketplace.id_marketplace}>
                  <TableCell>{props.startIndex + index + 1}</TableCell>
                  <TableCell
                    className={
                      props.needsHorizontalScroll
                        ? "overflow-hidden text-ellipsis"
                        : ""
                    }
                  >
                    {marketplace.id_marketplace}
                  </TableCell>
                  <TableCell>{marketplace.nama_marketplace}</TableCell>
                  <TableCell
                    className={`sticky right-0 z-10 bg-white ${
                      props.needsHorizontalScroll
                        ? "shadow-[-8px_0_15px_-6px_rgba(0,0,0,0.1)]"
                        : ""
                    }`}
                  >
                    {props.hasMarketplaceAccess ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <Link
                            href={`/dashboard/marketplaces/${marketplace.id_marketplace}`}
                          >
                            <DropdownMenuItem>
                              <EyeIcon className="mr-2 h-4 w-4" /> View
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            onClick={() => handleEdit(marketplace)}
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() =>
                              props.onDelete(marketplace.id_marketplace)
                            }
                          >
                            <Trash2Icon className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Link
                        href={`/dashboard/marketplaces/${marketplace.id_marketplace}`}
                      >
                        <Button variant="ghost" size="sm">
                          <EyeIcon className="mr-2 h-4 w-4" /> View
                        </Button>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  {props.noDataMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>
                Total Marketplaces: {props.totalItems}
              </TableCell>
              <TableCell
                className={`sticky right-0 ${
                  props.needsHorizontalScroll
                    ? "shadow-[-8px_0_15px_-6px_rgba(0,0,0,0.1)]"
                    : ""
                }`}
              ></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <PaginationLayout
        currentPage={props.currentPage}
        totalPages={totalPages}
        setCurrentPage={props.setCurrentPage}
      />

      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            document.body.style.removeProperty("pointer-events");
          }
          setEditDialogOpen(open);
          if (!open) {
            setTimeout(() => {
              setSelectedMarketplace(undefined);
            }, 100);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Marketplace</DialogTitle>
            <DialogDescription>
              Edit the marketplace details below and click update to save
              changes.
            </DialogDescription>
          </DialogHeader>
          <MarketplaceEditForm
            marketplaceData={selectedMarketplace}
            onDialogClose={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

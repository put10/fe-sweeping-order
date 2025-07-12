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
import { useEffect, useState } from "react";
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
import { format, parseISO } from "date-fns";
import { CooperationEditForm } from "./cooperation-edit-form";

export function CooperationTableContent(props) {
  const totalPages = Math.max(
    1,
    Math.ceil(props.totalItems / props.itemsPerPage),
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCooperation, setSelectedCooperation] = useState(undefined);

  const handleEdit = (cooperation) => {
    setSelectedCooperation(cooperation);
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
                Client
              </TableHead>
              <TableHead
                className={props.needsHorizontalScroll ? "w-[150px]" : ""}
              >
                Brand
              </TableHead>
              <TableHead
                className={props.needsHorizontalScroll ? "w-[150px]" : ""}
              >
                Start Date
              </TableHead>
              <TableHead
                className={props.needsHorizontalScroll ? "w-[150px]" : ""}
              >
                End Date
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
                <TableCell colSpan={6} className="text-center py-4">
                  Loading cooperations...
                </TableCell>
              </TableRow>
            ) : props.currentData.length > 0 ? (
              props.currentData.map((cooperation, index) => (
                <TableRow key={cooperation.id_kerjasama}>
                  <TableCell>{props.startIndex + index + 1}</TableCell>
                  <TableCell>{cooperation.nama_client}</TableCell>
                  <TableCell>{cooperation.brand?.nama_brand || "-"}</TableCell>
                  <TableCell>
                    {format(
                      parseISO(cooperation.tgl_mulai_kerjasama),
                      "dd MMM yyyy",
                    )}
                  </TableCell>
                  <TableCell>
                    {format(
                      parseISO(cooperation.tgl_akhir_kerjasama),
                      "dd MMM yyyy",
                    )}
                  </TableCell>
                  <TableCell
                    className={`sticky right-0 z-10 bg-white ${
                      props.needsHorizontalScroll
                        ? "shadow-[-8px_0_15px_-6px_rgba(0,0,0,0.1)]"
                        : ""
                    }`}
                  >
                    {props.hasAdminPrivileges ? (
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
                            href={`/dashboard/cooperations/${cooperation.id_kerjasama}`}
                          >
                            <DropdownMenuItem>
                              <EyeIcon className="mr-2 h-4 w-4" /> View
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            onClick={() => handleEdit(cooperation)}
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() =>
                              props.onDelete(cooperation.id_kerjasama)
                            }
                          >
                            <Trash2Icon className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Link
                        href={`/dashboard/cooperations/${cooperation.id_kerjasama}`}
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
                <TableCell colSpan={6} className="text-center py-4">
                  {props.noDataMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>
                Total Cooperations: {props.totalItems}
              </TableCell>
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
              setSelectedCooperation(undefined);
            }, 100);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Cooperation</DialogTitle>
            <DialogDescription>
              Edit the cooperation details below and click update to save
              changes.
            </DialogDescription>
          </DialogHeader>
          <CooperationEditForm
            cooperationData={selectedCooperation}
            onDialogClose={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

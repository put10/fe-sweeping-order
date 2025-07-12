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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserEditForm } from "./user-edit-form";
import { useDeleteUserMutation } from "@/api/(front-office)/user/mutation";

export function UserTableContent(props) {
  const totalItems = props.users?.data?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / props.itemsPerPage));
  const startIndex = (props.currentPage - 1) * props.itemsPerPage;
  const endIndex = Math.min(startIndex + props.itemsPerPage, totalItems);
  const currentData = props.users?.data?.slice(startIndex, endIndex) || [];
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState("");
  const [selectedUser, setSelectedUser] = useState(undefined);
  const deleteMutation = useDeleteUserMutation();

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (id_user) => {
    setUserToDelete(id_user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteMutation.mutate(
        { id_user: userToDelete },
        {
          onSuccess: () => {
            setUserToDelete("");
            setDeleteDialogOpen(false);
          },
          onError: (error) => {
            console.error("Failed to delete user:", error);
          },
        },
      );
    }
  };

  useEffect(() => {
    if (props.users?.data) {
      const hasManyItems = props.users.data.length > 10;
      const hasLongContent = props.users.data.some(
        (user) =>
          (user.username && user.username.length > 20) ||
          (user.email && user.email.length > 30),
      );
      setNeedsHorizontalScroll(hasManyItems || hasLongContent);
    }
  }, [props.users]);

  function formatRole(role) {
    if (role === "CEO") return "CEO";
    if (role === "ADMIN_IT") return "Admin IT";
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  return (
    <>
      <div className={needsHorizontalScroll ? "relative overflow-x-auto" : ""}>
        <Table className={needsHorizontalScroll ? "min-w-full" : ""}>
          <TableHeader>
            <TableRow>
              <TableHead className={needsHorizontalScroll ? "w-[50px]" : ""}>
                No
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[150px]" : ""}>
                Username
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[200px]" : ""}>
                Email
              </TableHead>
              <TableHead className={needsHorizontalScroll ? "w-[120px]" : ""}>
                Role
              </TableHead>
              <TableHead
                className={`sticky right-0 z-20 bg-white ${
                  needsHorizontalScroll
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
                <TableCell colSpan={5} className="text-center py-4">
                  Loading user data...
                </TableCell>
              </TableRow>
            ) : currentData.length ? (
              currentData.map((user, index) => (
                <TableRow key={user.id_user}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatRole(user.role)}</TableCell>
                  <TableCell
                    className={`sticky right-0 z-10 bg-white ${
                      needsHorizontalScroll
                        ? "shadow-[-8px_0_15px_-6px_rgba(0,0,0,0.1)]"
                        : ""
                    }`}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/dashboard/users/${user.id_user}`}>
                          <DropdownMenuItem>
                            <EyeIcon className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(user.id_user)}
                        >
                          <Trash2Icon className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total Records: {totalItems}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <PaginationLayout
        currentPage={props.currentPage}
        totalPages={totalPages}
        setCurrentPage={props.setCurrentPage}
      />

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            document.body.style.removeProperty("pointer-events");
          }
          setEditDialogOpen(open);
          if (!open) {
            setTimeout(() => {
              setSelectedUser(undefined);
            }, 100);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Edit the user details below and click update to save changes.
            </DialogDescription>
          </DialogHeader>
          <UserEditForm
            userData={selectedUser}
            onDialogClose={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user{" "}
              <strong>
                &quot;
                {currentData.find((user) => user.id_user === userToDelete)
                  ?.username || "selected user"}
                &quot;
              </strong>{" "}
              from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

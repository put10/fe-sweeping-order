"use client";

import { useGetUserById } from "@/api/(front-office)/user/queries";
import { useParams } from "next/navigation";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatDateToIndonesian } from "@/utils/date-formatter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UserViewDetail() {
  const params = useParams();
  const userId = params.id;
  const { data: userResponse, isLoading } = useGetUserById(userId);
  const user = userResponse?.data;

  return (
    <section className={"mb-6"}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/users">
          <Button variant="outline" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold">User Details</h2>
          <p className="text-muted-foreground text-sm">
            Viewing details for user ID: {userId}
          </p>
        </div>
      </div>

      {isLoading && <p>Loading user details...</p>}

      {!isLoading && user && (
        <div className="space-y-6">
          <div className="rounded-md border">
            <h3 className="text-lg font-medium p-4 border-b">
              User Information
            </h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-1/4">User ID</TableCell>
                  <TableCell>{user.id_user}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Username</TableCell>
                  <TableCell>{user.username}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Email</TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Role</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Created At</TableCell>
                  <TableCell>
                    {formatDateToIndonesian(user.created_at)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Updated At</TableCell>
                  <TableCell>
                    {formatDateToIndonesian(user.updated_at)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {!isLoading && !user && (
        <div className="p-4 border border-red-300 rounded-md bg-red-50">
          <p className="text-red-500">User not found</p>
        </div>
      )}
    </section>
  );
}

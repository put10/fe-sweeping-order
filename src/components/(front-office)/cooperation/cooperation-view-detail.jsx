"use client";

import { useGetCooperationById } from "@/api/(front-office)/cooperation/queries";
import { useParams } from "next/navigation";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatDateToIndonesian } from "@/utils/date-formatter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CooperationViewDetail() {
  const params = useParams();
  const cooperationId = params.id;
  const { data: cooperationResponse, isLoading } =
    useGetCooperationById(cooperationId);
  const cooperation = cooperationResponse?.data;

  return (
    <section className={"mb-6"}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/cooperations">
          <Button variant="outline" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold">Cooperation Details</h2>
          <p className="text-muted-foreground text-sm">
            Viewing details for cooperation ID: {cooperationId}
          </p>
        </div>
      </div>

      {isLoading && <p>Loading cooperation details...</p>}

      {!isLoading && cooperation && (
        <div className="space-y-6">
          {/* Cooperation Information */}
          <div className="rounded-md border">
            <h3 className="text-lg font-medium p-4 border-b">
              Cooperation Information
            </h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-1/4">
                    Cooperation ID
                  </TableCell>
                  <TableCell>{cooperation.id_kerjasama}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Client Name</TableCell>
                  <TableCell>{cooperation.nama_client}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Start Date</TableCell>
                  <TableCell>
                    {formatDateToIndonesian(cooperation.tgl_mulai_kerjasama)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">End Date</TableCell>
                  <TableCell>
                    {formatDateToIndonesian(cooperation.tgl_akhir_kerjasama)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Date Added</TableCell>
                  <TableCell>
                    {formatDateToIndonesian(cooperation.created_at)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Last Modified</TableCell>
                  <TableCell>
                    {formatDateToIndonesian(cooperation.updated_at)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Brand Information */}
          {cooperation.brand && (
            <div className="rounded-md border">
              <h3 className="text-lg font-medium p-4 border-b">
                Brand Information
              </h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/4">
                      Brand ID
                    </TableCell>
                    <TableCell>{cooperation.brand.id_brand}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Name</TableCell>
                    <TableCell>{cooperation.brand.nama_brand}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Date Added</TableCell>
                    <TableCell>
                      {formatDateToIndonesian(cooperation.brand.created_at)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Last Modified</TableCell>
                    <TableCell>
                      {formatDateToIndonesian(cooperation.brand.updated_at)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {!isLoading && !cooperation && (
        <div className="p-4 border border-red-300 rounded-md bg-red-50">
          <p className="text-red-500">Cooperation not found</p>
        </div>
      )}
    </section>
  );
}

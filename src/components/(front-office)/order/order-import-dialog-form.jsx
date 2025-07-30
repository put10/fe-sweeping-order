"use client";

import { useState, useRef } from "react";
import {
  Upload,
  FileUp,
  AlertCircle,
  CheckCircle2,
  FileDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  useImportOrdersMutation,
  useDownloadTemplateImportMutation,
} from "@/api/(front-office)/order/mutation";

export function OrderImportDialogForm({ disabled }) {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);

  const importOrdersMutation = useImportOrdersMutation();
  const downloadTemplateImport = useDownloadTemplateImportMutation();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Check file type
    const isExcel =
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel" ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls");

    if (!isExcel) {
      setFileError("Please select an Excel file (.xlsx or .xls)");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleImportSubmit = () => {
    if (!selectedFile) {
      setFileError("Please select a file to import");
      return;
    }

    importOrdersMutation.mutate(selectedFile);
  };

  const handleDownloadTemplate = () => {
    downloadTemplateImport.mutate();
  };

  const resetForm = () => {
    setSelectedFile(null);
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDialogClose = (open) => {
    if (!open) {
      // Reset form when dialog is closed
      resetForm();
      importOrdersMutation.reset();
    }
    setImportDialogOpen(open);
  };

  return (
    <>
      <Button
        onClick={() => setImportDialogOpen(true)}
        disabled={disabled}
        variant="outline"
        className="flex items-center gap-2 text-xs sm:text-sm"
        size="sm"
        title="Import Orders"
      >
        <Upload />
        <span className="hidden sm:inline">Import Orders</span>
        <span className="sm:hidden">Import</span>
      </Button>

      <Dialog open={importDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Orders</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {importOrdersMutation.isSuccess ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">
                  Import Successful
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  Successfully imported{" "}
                  {importOrdersMutation.data?.data?.success_count || 0} orders.
                  {importOrdersMutation.data?.data?.failed_count > 0 && (
                    <div className="mt-2">
                      <p>
                        Failed: {importOrdersMutation.data?.data?.failed_count}{" "}
                        orders
                      </p>
                      {importOrdersMutation.data?.data?.errors?.length > 0 && (
                        <ul className="list-disc pl-5 mt-1 text-sm">
                          {importOrdersMutation.data.data.errors.map(
                            (error, index) => (
                              <li key={index}>{error}</li>
                            ),
                          )}
                        </ul>
                      )}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="border rounded-md p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">
                    Before importing orders, you need a properly formatted Excel
                    template. Download our template to ensure your data is
                    correctly structured.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleDownloadTemplate}
                    disabled={downloadTemplateImport.isPending}
                    className="w-full"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    {downloadTemplateImport.isPending
                      ? "Downloading Template..."
                      : "Download Import Template"}
                  </Button>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="import-file">Upload Excel File</Label>
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2",
                      fileError
                        ? "border-red-300 bg-red-50"
                        : selectedFile
                          ? "border-green-300 bg-green-50"
                          : "border-gray-300 hover:border-primary hover:bg-gray-50",
                      "transition-colors cursor-pointer",
                    )}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      id="import-file"
                      className="hidden"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                    <FileUp
                      className={cn(
                        "h-10 w-10",
                        fileError
                          ? "text-red-400"
                          : selectedFile
                            ? "text-green-400"
                            : "text-gray-400",
                      )}
                    />
                    {selectedFile ? (
                      <div className="text-center">
                        <p className="font-medium text-green-600">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="font-medium">
                          Click to select or drop Excel file
                        </p>
                        <p className="text-sm text-gray-500">
                          Only .xlsx or .xls files are supported
                        </p>
                      </div>
                    )}
                  </div>

                  {fileError && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{fileError}</AlertDescription>
                    </Alert>
                  )}

                  {importOrdersMutation.isError && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Import Failed</AlertTitle>
                      <AlertDescription>
                        {importOrdersMutation.error?.message ||
                          "An error occurred during import"}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            {importOrdersMutation.isSuccess ? (
              <Button onClick={() => handleDialogClose(false)}>Close</Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleDialogClose(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImportSubmit}
                  disabled={!selectedFile || importOrdersMutation.isPending}
                >
                  {importOrdersMutation.isPending
                    ? "Importing..."
                    : "Import Orders"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

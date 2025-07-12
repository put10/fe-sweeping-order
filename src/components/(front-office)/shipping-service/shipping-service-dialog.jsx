"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShippingServiceCreateForm } from "@/components/(front-office)/shipping-service/shipping-service-create-form";
import { PlusIcon } from "lucide-react";

export function ShippingServiceDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon />
          Create Shipping Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Shipping Service</DialogTitle>
          <DialogDescription>
            Create a new shipping service by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ShippingServiceCreateForm onDialogClose={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

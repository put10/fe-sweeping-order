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
import { CooperationCreateForm } from "@/components/(front-office)/cooperation/cooperation-create-form";
import { PlusIcon } from "lucide-react";

export function CooperationDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={"sm:w-max w-full"}>
          <PlusIcon />
          Create Cooperation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-full">
        <DialogHeader>
          <DialogTitle>Create Cooperation</DialogTitle>
          <DialogDescription>
            Create a new cooperation by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <CooperationCreateForm onDialogClose={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

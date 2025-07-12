"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useImportSweepingOrderMutation } from "@/api/(front-office)/sweeping-order/mutation";
import { useEffect, useState } from "react";

// Define the form schema without FileList for server compatibility
const formSchema = z.object({
  file: z.any().refine((val) => val !== null, {
    message: "Excel file is required",
  }),
});

export function SweepingImportForm({ onDialogClose }) {
  const mutation = useImportSweepingOrderMutation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: null,
    },
  });

  function onSubmit(values) {
    if (values.file?.[0]) {
      mutation.mutate(values.file[0], {
        onSuccess: () => {
          form.reset();
          onDialogClose?.();
        },
      });
    }
  }

  const validateFile = (files) => {
    if (!files || files.length === 0) {
      return false;
    }
    return true;
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="file"
          render={({ field: { onChange, value, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Excel File</FormLabel>
              <FormControl>
                <Input
                  id="file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => {
                    if (validateFile(e.target.files)) {
                      onChange(e.target.files);
                    }
                  }}
                  {...fieldProps}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Importing..." : "Import"}
        </Button>
      </form>
    </Form>
  );
}

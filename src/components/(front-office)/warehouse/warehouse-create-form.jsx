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
import { Textarea } from "@/components/ui/textarea";
import { useWarehouseMutation } from "@/api/(front-office)/warehouse/mutation";

const formSchema = z.object({
  nama_gudang: z.string().min(2, {
    message: "Warehouse name must be at least 2 characters.",
  }),
  keterangan: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
});

export function WarehouseCreateForm({ onDialogClose }) {
  const mutation = useWarehouseMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_gudang: "",
      keterangan: "",
    },
  });

  function onSubmit(values) {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        onDialogClose?.();
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nama_gudang"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Gudang</FormLabel>
              <FormControl>
                <Input id="nama_gudang" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="keterangan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keterangan</FormLabel>
              <FormControl>
                <Textarea id="keterangan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";

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
import { useUpdateCustomerMutation } from "@/api/(front-office)/customer/mutation";
import { toast } from "sonner";

const formSchema = z.object({
  nama_pembeli: z.string().min(2, {
    message: "Customer name must be at least 2 characters.",
  }),
  alamat: z.string().min(2, {
    message: "Customer address must be at least 2 characters.",
  }),
  kontak: z
    .string()
    .min(9, {
      message: "Phone number must be at least 9 digits.",
    })
    .regex(/^[0-9]+$/, {
      message: "Phone number must contain only numbers.",
    }),
});

export function CustomerEditForm({ onDialogClose, customerData }) {
  const mutation = useUpdateCustomerMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_pembeli: "",
      alamat: "",
      kontak: "",
    },
  });

  useEffect(() => {
    if (customerData) {
      form.setValue("nama_pembeli", customerData.nama_pembeli);
      form.setValue("alamat", customerData.alamat);

      const contactValue = customerData.kontak.startsWith("+62")
        ? customerData.kontak.substring(3)
        : customerData.kontak;

      form.setValue("kontak", contactValue);
    }
  }, [customerData, form]);

  function onSubmit(values) {
    if (!customerData?.id_pembeli) {
      toast.error("No customer ID provided for update");
      return;
    }

    const formattedValues = {
      ...values,
      kontak: `+62${values.kontak}`,
    };

    mutation.mutate(
      {
        id_pembeli: customerData.id_pembeli,
        ...formattedValues,
      },
      {
        onSuccess: () => {
          document.body.style.removeProperty("pointer-events");
          form.reset();
          onDialogClose?.();
        },
      },
    );
  }

  useEffect(() => {
    return () => {
      document.body.style.removeProperty("pointer-events");
      form.reset();
    };
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nama_pembeli"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Pembeli</FormLabel>
              <FormControl>
                <Input id="nama_pembeli" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="alamat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Input id="alamat" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="kontak"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kontak</FormLabel>
              <FormControl>
                <div className="flex rounded-md border border-input overflow-hidden focus-within:ring-1 focus-within:ring-ring focus-within:border-primary">
                  <div className="flex items-center px-3 bg-muted text-muted-foreground text-sm">
                    +62
                  </div>
                  <Input
                    id="kontak"
                    type="tel"
                    value={field.value}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, "");
                      field.onChange(digitsOnly);
                    }}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="8123456789"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Updating..." : "Update"}
        </Button>
      </form>
    </Form>
  );
}

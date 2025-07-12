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
import { useBrandMutation } from "@/api/(front-office)/brand/mutation";

const formSchema = z.object({
  nama_brand: z.string().min(2, {
    message: "Brand name must be at least 2 characters.",
  }),
});

export function BrandCreateForm({ onDialogClose }) {
  const mutation = useBrandMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_brand: "",
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
          name="nama_brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Brand</FormLabel>
              <FormControl>
                <Input id="nama_brand" type="text" {...field} />
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

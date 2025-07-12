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
import { useMarketplaceMutation } from "@/api/(front-office)/marketplace/mutation";

const formSchema = z.object({
  nama_marketplace: z.string().min(2, {
    message: "Marketplace name must be at least 2 characters.",
  }),
});

export function MarketplaceCreateForm({ onDialogClose }) {
  const mutation = useMarketplaceMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_marketplace: "",
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
          name="nama_marketplace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Marketplace</FormLabel>
              <FormControl>
                <Input id="nama_marketplace" type="text" {...field} />
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

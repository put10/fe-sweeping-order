"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { useEffect, useState } from "react";

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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCooperationMutation } from "@/api/(front-office)/cooperation/mutation";
import { useGetAllBrand } from "@/api/(front-office)/brand/queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z
  .object({
    nama_client: z.string({
      required_error: "Client name is required.",
    }),
    id_brand: z.string({
      required_error: "Please select a brand.",
    }),
    tgl_mulai_kerjasama: z.date({
      required_error: "Tanggal mulai kerjasama is required.",
    }),
    tgl_akhir_kerjasama: z.date({
      required_error: "Tanggal akhir kerjasama is required.",
    }),
  })
  .refine((data) => data.tgl_akhir_kerjasama > data.tgl_mulai_kerjasama, {
    message: "Tanggal akhir kerjasama harus setelah Tanggal mulai kerjasama",
    path: ["tgl_akhir_kerjasama"],
  });

export function CooperationCreateForm({ onDialogClose }) {
  const mutation = useCooperationMutation();
  const { data: brandsResponse } = useGetAllBrand();
  const brands = brandsResponse?.data || [];
  const [automaticEndDate, setAutomaticEndDate] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_client: "",
      id_brand: "",
      tgl_mulai_kerjasama: new Date(),
      tgl_akhir_kerjasama: new Date(
        new Date().setDate(new Date().getDate() + 30),
      ),
    },
  });

  const watchedStartDate = form.watch("tgl_mulai_kerjasama");

  useEffect(() => {
    if (automaticEndDate && watchedStartDate) {
      const endDate = new Date(watchedStartDate);
      endDate.setDate(endDate.getDate() + 30); // Default 30 days
      form.setValue("tgl_akhir_kerjasama", endDate);
    }
  }, [watchedStartDate, automaticEndDate, form]);

  function onSubmit(values) {
    const formattedData = {
      ...values,
      tgl_mulai_kerjasama: format(values.tgl_mulai_kerjasama, "yyyy-MM-dd"),
      tgl_akhir_kerjasama: format(values.tgl_akhir_kerjasama, "yyyy-MM-dd"),
    };

    mutation.mutate(formattedData, {
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
          name="nama_client"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter client name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="id_brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className={"w-full"}>
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id_brand} value={brand.id_brand}>
                      {brand.nama_brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tgl_mulai_kerjasama"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tgl_akhir_kerjasama"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex justify-between items-center">
                <FormLabel>End Date</FormLabel>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setAutomaticEndDate(!automaticEndDate)}
                  className="h-auto py-0"
                >
                  {automaticEndDate ? "Set manually" : "Use default (30 days)"}
                </Button>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                      disabled={automaticEndDate}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setAutomaticEndDate(false);
                    }}
                    disabled={(date) => {
                      const startDate = form.getValues("tgl_mulai_kerjasama");
                      return startDate && date < startDate;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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

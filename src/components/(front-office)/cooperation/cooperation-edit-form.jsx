"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, parseISO } from "date-fns";
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
import { useUpdateCooperationMutation } from "@/api/(front-office)/cooperation/mutation";
import { useGetAllBrand } from "@/api/(front-office)/brand/queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const formSchema = z
  .object({
    nama_client: z.string().min(2, {
      message: "Client name must be at least 2 characters.",
    }),
    id_brand: z.string({
      required_error: "Please select a brand.",
    }),
    tgl_mulai_kerjasama: z.date({
      required_error: "Start date is required.",
    }),
    tgl_akhir_kerjasama: z.date({
      required_error: "End date is required.",
    }),
  })
  .refine((data) => data.tgl_akhir_kerjasama > data.tgl_mulai_kerjasama, {
    message: "End date must be after start date",
    path: ["tgl_akhir_kerjasama"],
  });

export function CooperationEditForm({ onDialogClose, cooperationData }) {
  const mutation = useUpdateCooperationMutation();
  const { data: brandsResponse } = useGetAllBrand();
  const [automaticEndDate, setAutomaticEndDate] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);

  const brandOptions =
    brandsResponse?.data?.map((brand) => ({
      value: brand.id_brand,
      label: brand.nama_brand,
    })) || [];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_client: "",
      id_brand: "",
      tgl_mulai_kerjasama: new Date(),
      tgl_akhir_kerjasama: new Date(),
    },
  });

  const watchedBrandId = form.watch("id_brand");

  useEffect(() => {
    if (cooperationData && brandsResponse?.data) {
      form.setValue("nama_client", cooperationData.nama_client);
      form.setValue("id_brand", cooperationData.id_brand);

      if (cooperationData.tgl_mulai_kerjasama) {
        const startDate = parseISO(
          cooperationData.tgl_mulai_kerjasama.toString(),
        );
        form.setValue("tgl_mulai_kerjasama", startDate);
      }

      if (cooperationData.tgl_akhir_kerjasama) {
        const endDate = parseISO(
          cooperationData.tgl_akhir_kerjasama.toString(),
        );
        form.setValue("tgl_akhir_kerjasama", endDate);
      }
      setIsFormReady(true);
    }
  }, [cooperationData, brandsResponse, form]);

  const watchedStartDate = form.watch("tgl_mulai_kerjasama");

  useEffect(() => {
    if (automaticEndDate && watchedStartDate) {
      const endDate = new Date(watchedStartDate);
      endDate.setDate(endDate.getDate() + 30); // Default 30 days
      form.setValue("tgl_akhir_kerjasama", endDate);
    }
  }, [watchedStartDate, automaticEndDate, form]);

  function onSubmit(values) {
    if (!cooperationData?.id_kerjasama) {
      toast.error("No cooperation ID provided for update");
      return;
    }

    const formattedData = {
      id_kerjasama: cooperationData.id_kerjasama,
      ...values,
      tgl_mulai_kerjasama: format(values.tgl_mulai_kerjasama, "yyyy-MM-dd"),
      tgl_akhir_kerjasama: format(values.tgl_akhir_kerjasama, "yyyy-MM-dd"),
    };

    mutation.mutate(formattedData, {
      onSuccess: () => {
        document.body.style.removeProperty("pointer-events");
        form.reset();
        onDialogClose?.();
      },
    });
  }

  useEffect(() => {
    return () => {
      document.body.style.removeProperty("pointer-events");
      form.reset();
    };
  }, [form]);

  const selectedBrandName =
    brandOptions?.find((option) => option.value === watchedBrandId)?.label ||
    "Select a brand";

  if (!isFormReady && cooperationData) {
    return <div>Loading form data...</div>;
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
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue>{selectedBrandName}</SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brandOptions?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
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
          {mutation.isPending ? "Updating..." : "Update"}
        </Button>
      </form>
    </Form>
  );
}

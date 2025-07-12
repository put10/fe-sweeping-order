"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUserMutation } from "@/api/(front-office)/user/mutation";
import { toast } from "sonner";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.enum(
    [
      "CEO",
      "ADMIN_IT",
      "ORDER_STAFF",
      "WAREHOUSE_STAFF",
      "SHIPPING_STAFF",
      "MANAGER",
    ],
    {
      required_error: "Role is required",
    },
  ),
  password: z.string().optional(),
});

export function UserEditForm({ onDialogClose, userData }) {
  const mutation = useUpdateUserMutation();
  const [isFormReady, setIsFormReady] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      role: undefined,
      password: "",
    },
  });

  useEffect(() => {
    if (userData) {
      form.setValue("username", userData.username);
      form.setValue("email", userData.email);
      form.setValue("role", userData.role);
      setIsFormReady(true);
    }
  }, [userData, form]);

  function onSubmit(values) {
    if (!userData?.id_user) {
      toast.error("No user ID provided for update");
      return;
    }

    const updateData = {
      ...values,
      id_user: userData.id_user,
    };

    if (!updateData.password) {
      delete updateData.password;
    }

    mutation.mutate(updateData, {
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

  if (!isFormReady && userData) {
    return <div>Loading form data...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input id="username" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input id="email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CEO">CEO</SelectItem>
                    <SelectItem value="ADMIN_IT">Admin IT</SelectItem>
                    <SelectItem value="ORDER_STAFF">Order Staff</SelectItem>
                    <SelectItem value="WAREHOUSE_STAFF">
                      Warehouse Staff
                    </SelectItem>
                    <SelectItem value="SHIPPING_STAFF">
                      Shipping Staff
                    </SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password (leave empty to keep current)</FormLabel>
              <FormControl>
                <Input id="password" type="password" {...field} />
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

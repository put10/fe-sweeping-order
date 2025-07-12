import { createApiRequest } from "@/api/base/api-factory";
import { redirect } from "next/navigation";

export const authApi = {
  login: createApiRequest({
    endpoint: "/auth/signin",
    method: "POST",
  }),
};

export const handleLogout = () => {
  document.cookie = "username=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
  redirect("/login");
};

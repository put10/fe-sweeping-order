import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authApi } from "./api";

export const useAuthMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["auth-login"],
    mutationFn: authApi.login,
    onSuccess: (data) => {
      toast.success(data.message);
      const token = data.data.token;
      const username = data.data.user.username;
      const role = data.data.user.role;
      Cookies.set("token", token);
      Cookies.set("username", username);
      Cookies.set("role", role);
      router.push("/dashboard");
    },
    onError: (error) => {
      if (error.response) {
        const responseData = error.response.data;

        const errorMessage =
          typeof responseData.message === "object" && responseData.message.error
            ? responseData.message.error
            : typeof responseData.message === "string"
              ? responseData.message
              : "Please try again";

        toast.error(`Login failed: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("Login failed: " + (error.message || "Please try again"));
      }
    },
  });
};

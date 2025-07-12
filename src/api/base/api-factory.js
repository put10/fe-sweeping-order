import { AxiosInstance } from "./axios-instance";
import Cookies from "js-cookie";

export function createApiRequest(options) {
  return async (data) => {
    const {
      endpoint,
      method,
      withAuth = true,
      transformResponse,
      extraConfig = {},
    } = options;

    const config = {
      ...(withAuth && {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }),
      ...extraConfig,
    };

    let response;
    switch (method) {
      case "GET":
        response = await AxiosInstance.get(endpoint, config);
        break;
      case "POST":
        response = await AxiosInstance.post(endpoint, data, config);
        break;
      case "PUT":
        response = await AxiosInstance.put(endpoint, data, config);
        break;
      case "PATCH":
        response = await AxiosInstance.patch(endpoint, data, config);
        break;
      case "DELETE":
        response = await AxiosInstance.delete(endpoint, config);
        break;
      default:
        throw new Error("Invalid method");
    }

    return transformResponse ? transformResponse(response.data) : response.data;
  };
}

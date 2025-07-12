import { createApiRequest } from "@/api/base/api-factory";

export const shippingApi = {
  createShipping: createApiRequest({
    endpoint: "/pengiriman",
    method: "POST",
  }),

  getAllShipping: createApiRequest({
    endpoint: "/pengiriman",
    method: "GET",
  }),

  getShippingById: (id_pengiriman) => {
    return createApiRequest({
      endpoint: `/pengiriman/${id_pengiriman}`,
      method: "GET",
    })();
  },

  searchShipping: (search) => {
    return createApiRequest({
      endpoint: `/pengiriman?search=${search}`,
      method: "GET",
    })();
  },

  filterShipping: (params) => {
    const queryParams = new URLSearchParams();

    if (params.start_date) {
      queryParams.append("start_date", params.start_date);
    }
    if (params.end_date) {
      queryParams.append("end_date", params.end_date);
    }

    return createApiRequest({
      endpoint: `/pengiriman/filter?${queryParams.toString()}`,
      method: "GET",
    })();
  },

  exportFilteredShipping: (params) => {
    const queryParams = new URLSearchParams();

    if (params.start_date) {
      queryParams.append("start_date", params.start_date);
    }
    if (params.end_date) {
      queryParams.append("end_date", params.end_date);
    }

    return createApiRequest({
      endpoint: `/pengiriman/export-filter?${queryParams.toString()}`,
      method: "GET",
      extraConfig: {
        responseType: "blob",
      },
      transformResponse: (data) => data,
    })();
  },

  importShipping: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return createApiRequest({
      endpoint: "/pengiriman/import",
      method: "POST",
    })(formData);
  },
};

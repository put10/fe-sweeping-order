import { createApiRequest } from "@/api/base/api-factory";

export const shippingApi = {
  createShippingService: createApiRequest({
    endpoint: "/jasa-pengiriman",
    method: "POST",
  }),

  getAllShippingServices: createApiRequest({
    endpoint: "/jasa-pengiriman",
    method: "GET",
  }),

  getSearchShippingService: (search) => {
    return createApiRequest({
      endpoint: `/jasa-pengiriman?search=${search}`,
      method: "GET",
    })();
  },

  getShippingServiceById: (id_jasa) => {
    return createApiRequest({
      endpoint: `/jasa-pengiriman/${id_jasa}`,
      method: "GET",
    })();
  },

  updateShippingService: (data) => {
    const { id_jasa, ...updateData } = data;
    return createApiRequest({
      endpoint: `/jasa-pengiriman/${id_jasa}`,
      method: "PUT",
    })(updateData);
  },

  deleteShippingService: (id_jasa) => {
    return createApiRequest({
      endpoint: `/jasa-pengiriman/${id_jasa}`,
      method: "DELETE",
    })();
  },
};

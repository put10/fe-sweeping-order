import { createApiRequest } from "@/api/base/api-factory";

export const customerApi = {
  createCustomer: createApiRequest({
    endpoint: "/pembeli",
    method: "POST",
  }),

  getAllCustomer: createApiRequest({
    endpoint: "/pembeli",
    method: "GET",
  }),

  getSearchCustomer: (search) => {
    return createApiRequest({
      endpoint: `/pembeli?search=${search}`,
      method: "GET",
    })();
  },

  getCustomerById: (id_pembeli) => {
    return createApiRequest({
      endpoint: `/pembeli/${id_pembeli}`,
      method: "GET",
    })();
  },

  updateCustomer: (data) => {
    const { id_pembeli, ...updateData } = data;
    return createApiRequest({
      endpoint: `/pembeli/${id_pembeli}`,
      method: "PUT",
    })(updateData);
  },

  deleteCustomer: (id_pembeli) => {
    return createApiRequest({
      endpoint: `/pembeli/${id_pembeli}`,
      method: "DELETE",
    })();
  },
};

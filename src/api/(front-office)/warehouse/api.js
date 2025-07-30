import { createApiRequest } from "@/api/base/api-factory";

export const warehouseApi = {
  createWarehouse: createApiRequest({
    endpoint: "/gudang",
    method: "POST",
  }),

  getAllWarehouses: createApiRequest({
    endpoint: "/gudang",
    method: "GET",
  }),

  getSearchWarehouse: (search) => {
    return createApiRequest({
      endpoint: `/gudang?search=${search}`,
      method: "GET",
    })();
  },

  getWarehouseById: (id_gudang) => {
    return createApiRequest({
      endpoint: `/gudang/${id_gudang}`,
      method: "GET",
    })();
  },

  updateWarehouse: (data) => {
    const { id_gudang, ...updateData } = data;
    return createApiRequest({
      endpoint: `/gudang/${id_gudang}`,
      method: "PUT",
    })(updateData);
  },

  deleteWarehouse: (id_gudang) => {
    return createApiRequest({
      endpoint: `/gudang/${id_gudang}`,
      method: "DELETE",
    })();
  },
};

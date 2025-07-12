import { createApiRequest } from "@/api/base/api-factory";

export const brandApi = {
  createBrand: createApiRequest({
    endpoint: "/brands",
    method: "POST",
  }),

  getAllBrand: createApiRequest({
    endpoint: "/brands",
    method: "GET",
  }),

  getSearchBrand: (search) => {
    return createApiRequest({
      endpoint: `/brands?search=${search}`,
      method: "GET",
    })();
  },

  getBrandById: (id_brand) => {
    return createApiRequest({
      endpoint: `/brands/${id_brand}`,
      method: "GET",
    })();
  },

  updateBrand: (data) => {
    const { id_brand, ...updateData } = data;
    return createApiRequest({
      endpoint: `/brands/${id_brand}`,
      method: "PUT",
    })(updateData);
  },

  deleteBrand: (id_brand) => {
    return createApiRequest({
      endpoint: `/brands/${id_brand}`,
      method: "DELETE",
    })();
  },
};

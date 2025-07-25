import { createApiRequest } from "@/api/base/api-factory";

export const productApi = {
  createProduct: createApiRequest({
    endpoint: "/produk",
    method: "POST",
  }),

  getAllProduct: createApiRequest({
    endpoint: "/produk",
    method: "GET",
  }),

  getSearchProduct: (search) => {
    return createApiRequest({
      endpoint: `/produk?search=${search}`,
      method: "GET",
    })();
  },

  getProductById: (id_produk) => {
    return createApiRequest({
      endpoint: `/produk/${id_produk}`,
      method: "GET",
    })();
  },

  updateProduct: (data) => {
    const { id_produk, ...updateData } = data;
    return createApiRequest({
      endpoint: `/produk/${id_produk}`,
      method: "PUT",
    })(updateData);
  },

  deleteProduct: (id_produk) => {
    return createApiRequest({
      endpoint: `/produk/${id_produk}`,
      method: "DELETE",
    })();
  },

  filterProductByBrand: (id_brand) => {
    return createApiRequest({
      endpoint: `/produk/filter?id_brand=${id_brand}`,
      method: "GET",
    })();
  },
};

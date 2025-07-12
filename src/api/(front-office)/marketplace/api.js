import { createApiRequest } from "@/api/base/api-factory";

export const marketplaceApi = {
  createMarketplace: createApiRequest({
    endpoint: "/marketplaces",
    method: "POST",
  }),

  getAllMarketplaces: createApiRequest({
    endpoint: "/marketplaces",
    method: "GET",
  }),

  getSearchMarketplace: (search) => {
    return createApiRequest({
      endpoint: `/marketplaces?search=${search}`,
      method: "GET",
    })();
  },

  getMarketplaceById: (id_marketplace) => {
    return createApiRequest({
      endpoint: `/marketplaces/${id_marketplace}`,
      method: "GET",
    })();
  },

  updateMarketplace: (data) => {
    const { id_marketplace, ...updateData } = data;
    return createApiRequest({
      endpoint: `/marketplaces/${id_marketplace}`,
      method: "PUT",
    })(updateData);
  },

  deleteMarketplace: (id_marketplace) => {
    return createApiRequest({
      endpoint: `/marketplaces/${id_marketplace}`,
      method: "DELETE",
    })();
  },
};

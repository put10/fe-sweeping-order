import { createApiRequest } from "@/api/base/api-factory";

export const cooperationApi = {
  createCooperation: createApiRequest({
    endpoint: "/kerjasama",
    method: "POST",
  }),

  getAllCooperation: createApiRequest({
    endpoint: "/kerjasama",
    method: "GET",
  }),

  getCooperationById: (id_kerjasama) => {
    return createApiRequest({
      endpoint: `/kerjasama/${id_kerjasama}`,
      method: "GET",
    })();
  },

  updateCooperation: (data) => {
    const { id_kerjasama, ...updateData } = data;
    return createApiRequest({
      endpoint: `/kerjasama/${id_kerjasama}`,
      method: "PUT",
    })(updateData);
  },

  deleteCooperation: (id_kerjasama) => {
    return createApiRequest({
      endpoint: `/kerjasama/${id_kerjasama}`,
      method: "DELETE",
    })();
  },

  filterCooperationByBrandAndDate: (id_brand, start_date, end_date) => {
    return createApiRequest({
      endpoint: `/kerjasama/filter?id_brand=${id_brand}&start_date=${start_date}&end_date=${end_date}`,
      method: "GET",
    })();
  },
};

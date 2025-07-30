import { createApiRequest } from "@/api/base/api-factory";

export const orderApi = {
  generateOrders: createApiRequest({
    endpoint: "/pesanan/generate",
    method: "POST",
  }),

  getAllOrders: createApiRequest({
    endpoint: "/pesanan",
    method: "GET",
  }),

  getSearchOrders: (search) => {
    return createApiRequest({
      endpoint: `/pesanan?search=${search}`,
      method: "GET",
    })();
  },

  getOrdersById: (id_pesanan) => {
    return createApiRequest({
      endpoint: `/pesanan/${id_pesanan}`,
      method: "GET",
    })();
  },

  getLastFiveMinutesOrders: createApiRequest({
    endpoint: "/pesanan/last-five-minutes",
    method: "GET",
  }),

  getExportLastFiveMinutesOrders: createApiRequest({
    endpoint: "/pesanan/export-last-five-minutes",
    method: "GET",
    extraConfig: {
      responseType: "blob",
    },
    transformResponse: (data) => data,
  }),

  filterOrders: (params) => {
    const queryParams = new URLSearchParams();

    if (params.id_brand) {
      queryParams.append("id_brand", params.id_brand);
    }
    if (params.id_marketplace) {
      queryParams.append("id_marketplace", params.id_marketplace);
    }
    if (params.id_jasa_pengiriman) {
      queryParams.append("id_jasa_pengiriman", params.id_jasa_pengiriman);
    }
    if (params.status_pesanan) {
      queryParams.append("status_pesanan", params.status_pesanan);
    }
    if (params.start_date) {
      queryParams.append("start_date", params.start_date);
    }
    if (params.end_date) {
      queryParams.append("end_date", params.end_date);
    }

    return createApiRequest({
      endpoint: `/pesanan/filter?${queryParams.toString()}`,
      method: "GET",
    })();
  },

  exportFilteredOrders: (params) => {
    const queryParams = new URLSearchParams();

    if (params.id_brand) {
      queryParams.append("id_brand", params.id_brand);
    }
    if (params.id_marketplace) {
      queryParams.append("id_marketplace", params.id_marketplace);
    }
    if (params.id_jasa_pengiriman) {
      queryParams.append("id_jasa_pengiriman", params.id_jasa_pengiriman);
    }
    if (params.status_pesanan) {
      queryParams.append("status_pesanan", params.status_pesanan);
    }
    if (params.start_date) {
      queryParams.append("start_date", params.start_date);
    }
    if (params.end_date) {
      queryParams.append("end_date", params.end_date);
    }

    return createApiRequest({
      endpoint: `/pesanan/export-filter?${queryParams.toString()}`,
      method: "GET",
      extraConfig: {
        responseType: "blob",
      },
      transformResponse: (data) => data,
    })();
  },

  patchStatusPesanan: (idPesanan, status) => {
    return createApiRequest({
      endpoint: `/pesanan/${idPesanan}/status`,
      method: "PATCH",
    })({ status_pesanan: status });
  },

  getOrdersSedangDikirim: (params = {}) => {
    return orderApi.filterOrders({
      ...params,
      status_pesanan: "sedang_dikirim",
    });
  },

  getOrdersSedangDikirimByBrand: (id_brand) => {
    return orderApi.filterOrders({
      status_pesanan: "sedang_dikirim",
      id_brand: id_brand,
    });
  },

  getDownloadTemplateImport: createApiRequest({
    endpoint: "/pesanan/download-template",
    method: "GET",
    extraConfig: {
      responseType: "blob",
    },
    transformResponse: (data) => data,
  }),

  createOrderImport: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return createApiRequest({
      endpoint: "/pesanan/import",
      method: "POST",
    })(formData);
  },

  exportSelectedOrders: (selectedIds) => {
    return createApiRequest({
      endpoint: "/pesanan/export-selected",
      method: "POST",
      extraConfig: {
        responseType: "blob",
      },
      transformResponse: (data) => data,
    })({ selectedIds });
  },
};

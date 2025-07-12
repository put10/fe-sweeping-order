import { createApiRequest } from "@/api/base/api-factory";

export const sweepingOrderApi = {
  getAllSweepingOrders: createApiRequest({
    endpoint: "/sweeping-order",
    method: "GET",
  }),

  getSweepingOrderById: (id_proses) => {
    return createApiRequest({
      endpoint: `/sweeping-order/${id_proses}`,
      method: "GET",
    })();
  },

  searchSweepingOrder: (params) => {
    const searchTerm = params.id_proses || params.id_pesanan;

    if (!searchTerm) {
      return createApiRequest({
        endpoint: "/sweeping-order",
        method: "GET",
      })();
    }

    // Get all sweeping orders first, then filter client-side
    return createApiRequest({
      endpoint: "/sweeping-order",
      method: "GET",
    })().then((response) => {
      if (!response.data) return response;

      // Filter data that contains the search term in any of the ID fields
      const filteredData = response.data.filter(
        (order) =>
          (order.id_proses && order.id_proses.includes(searchTerm)) ||
          (order.id_pesanan && order.id_pesanan.includes(searchTerm)),
      );

      return { ...response, data: filteredData };
    });
  },

  filterSweepingOrder: (params) => {
    const queryParams = new URLSearchParams();

    if (params.status_proses) {
      queryParams.append("status_proses", params.status_proses);
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
      endpoint: `/sweeping-order/filter?${queryParams.toString()}`,
      method: "GET",
    })();
  },

  importSweepingOrder: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return createApiRequest({
      endpoint: "/sweeping-order",
      method: "POST",
    })(formData);
  },

  exportFilteredSweepingOrders: (params) => {
    const queryParams = new URLSearchParams();

    if (params.status_proses) {
      queryParams.append("status_proses", params.status_proses);
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
      endpoint: `/sweeping-order/export-filter?${queryParams.toString()}`,
      method: "GET",
      extraConfig: {
        responseType: "blob",
      },
    })();
  },
};

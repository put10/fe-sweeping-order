import { createApiRequest } from "@/api/base/api-factory";

export const packingApi = {
  createPacking: createApiRequest({
    endpoint: "/packing",
    method: "POST",
  }),

  getAllPacking: createApiRequest({
    endpoint: "/packing",
    method: "GET",
  }),

  getPackingById: (id_packing) => {
    return createApiRequest({
      endpoint: `/packing/${id_packing}`,
      method: "GET",
    })();
  },

  searchPacking: (params) => {
    const searchTerm =
      params.id_packing || params.id_pencetakan || params.id_pesanan;

    if (!searchTerm) {
      return createApiRequest({
        endpoint: "/packing",
        method: "GET",
      })();
    }

    // Get all packings first, then filter client-side
    return createApiRequest({
      endpoint: "/packing",
      method: "GET",
    })().then((response) => {
      if (!response.data) return response;

      // Filter data that contains the search term in any of the ID fields
      const filteredData = response.data.filter(
        (packing) =>
          (packing.id_packing && packing.id_packing.includes(searchTerm)) ||
          (packing.id_pencetakan &&
            packing.id_pencetakan.includes(searchTerm)) ||
          (packing.pencetakan_label?.id_pesanan &&
            packing.pencetakan_label.id_pesanan.includes(searchTerm)),
      );

      return { ...response, data: filteredData };
    });
  },

  filterPacking: (params) => {
    const queryParams = new URLSearchParams();

    if (params.start_date) {
      queryParams.append("start_date", params.start_date);
    }
    if (params.end_date) {
      queryParams.append("end_date", params.end_date);
    }

    return createApiRequest({
      endpoint: `/packing/filter?${queryParams.toString()}`,
      method: "GET",
    })();
  },

  exportFilteredPacking: (params) => {
    const queryParams = new URLSearchParams();

    if (params.start_date) {
      queryParams.append("start_date", params.start_date);
    }
    if (params.end_date) {
      queryParams.append("end_date", params.end_date);
    }

    return createApiRequest({
      endpoint: `/packing/export-filter?${queryParams.toString()}`,
      method: "GET",
      extraConfig: {
        responseType: "blob",
      },
      transformResponse: (data) => data,
    })();
  },

  importPacking: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return createApiRequest({
      endpoint: "/packing/import",
      method: "POST",
    })(formData);
  },
};

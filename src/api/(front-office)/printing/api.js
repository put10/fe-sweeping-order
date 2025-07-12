import { createApiRequest } from "@/api/base/api-factory";

export const printingApi = {
  createPrinting: createApiRequest({
    endpoint: "/pencetakan",
    method: "POST",
  }),

  getAllPrinting: createApiRequest({
    endpoint: "/pencetakan",
    method: "GET",
  }),

  getPrintingById: (id_pencetakan) => {
    return createApiRequest({
      endpoint: `/pencetakan/${id_pencetakan}`,
      method: "GET",
    })();
  },

  searchPrinting: (params) => {
    const searchTerm = params.id_pencetakan || params.id_pesanan;

    if (!searchTerm) {
      return createApiRequest({
        endpoint: "/pencetakan",
        method: "GET",
      })();
    }

    // Get all printings first, then filter client-side
    return createApiRequest({
      endpoint: "/pencetakan",
      method: "GET",
    })().then((response) => {
      if (!response.data) return response;

      // Filter data that contains the search term in any of the ID fields
      const filteredData = response.data.filter(
        (printing) =>
          (printing.id_pencetakan &&
            printing.id_pencetakan.includes(searchTerm)) ||
          (printing.id_pesanan && printing.id_pesanan.includes(searchTerm)),
      );

      return { ...response, data: filteredData };
    });
  },

  filterPrinting: (params) => {
    const queryParams = new URLSearchParams();

    if (params.start_date) {
      queryParams.append("start_date", params.start_date);
    }
    if (params.end_date) {
      queryParams.append("end_date", params.end_date);
    }

    return createApiRequest({
      endpoint: `/pencetakan/filter?${queryParams.toString()}`,
      method: "GET",
    })();
  },

  exportFilteredPrinting: (params) => {
    const queryParams = new URLSearchParams();

    if (params.start_date) {
      queryParams.append("start_date", params.start_date);
    }
    if (params.end_date) {
      queryParams.append("end_date", params.end_date);
    }

    return createApiRequest({
      endpoint: `/pencetakan/export-filter?${queryParams.toString()}`,
      method: "GET",
      extraConfig: {
        responseType: "blob",
      },
      transformResponse: (data) => data,
    })();
  },

  importPrinting: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return createApiRequest({
      endpoint: "/pencetakan/import",
      method: "POST",
    })(formData);
  },
};

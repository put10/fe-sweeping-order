import { createApiRequest } from "@/api/base/api-factory";

export const stockApi = {
  addStock: createApiRequest({
    endpoint: "/stok/tambah",
    method: "POST",
  }),

  removeStock: createApiRequest({
    endpoint: "/stok/kurangi",
    method: "POST",
  }),

  getStockByProduct: createApiRequest({
    endpoint: "/stok/produk",
    method: "GET",
  }),

  getSearchStockByProduct: (search) => {
    return createApiRequest({
      endpoint: `/stok/produk?search=${search}`,
      method: "GET",
    })();
  },

  getStockByHistoryProduct: (id_produk) => {
    return createApiRequest({
      endpoint: `/stok/riwayat/${id_produk}`,
      method: "GET",
    })();
  },

  getFilterStockByHistoryProduct: (id_produk) => {
    return createApiRequest({
      endpoint: `/stok/riwayat/?id_produk=${id_produk}`,
      method: "GET",
    })();
  },

  getSearchStockByHistoryProduct: (id_produk, tipe_transaksi) => {
    return createApiRequest({
      endpoint: `/stok/riwayat/${id_produk}?tipe_transaksi=${tipe_transaksi}`,
      method: "GET",
    })();
  },

  getStockByHistory: createApiRequest({
    endpoint: "/stok/riwayat",
    method: "GET",
  }),

  getInStockHistory: createApiRequest({
    endpoint: "/stok/riwayat/masuk",
    method: "GET",
  }),

  getOutStockHistory: createApiRequest({
    endpoint: "/stok/riwayat/keluar-manual",
    method: "GET",
  }),

  getOutStockHistoryByOrder: createApiRequest({
    endpoint: "/stok/riwayat/keluar-pesanan",
    method: "GET",
  }),

  getNewestStock: createApiRequest({
    endpoint: "/stok/terbaru",
    method: "GET",
  }),
};

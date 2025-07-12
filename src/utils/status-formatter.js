export const PREDEFINED_STATUS_OPTIONS = [
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
  { value: "dibatalkan", label: "Dibatalkan" },
  { value: "perlu_dikirim", label: "Perlu Dikirim" },
  { value: "sedang_dikemas", label: "Pesanan Sedang Dikemas" },
  { value: "diproses", label: "Pesanan Diproses" },
  { value: "sedang_dikirim", label: "Sedang Dikirim" },
];

export function getStatusBadgeColorClass(status) {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "unpaid":
      return "bg-yellow-100 text-yellow-800";
    case "dibatalkan":
      return "bg-red-100 text-red-800";
    case "perlu_dikirim":
      return "bg-blue-100 text-blue-800";
    case "sedang_dikemas":
      return "bg-purple-100 text-purple-800";
    case "diproses":
      return "bg-teal-100 text-teal-800";
    case "sedang_dikirim":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getAllStatusOptions(statusesFromData) {
  const statusMap = new Map(
    PREDEFINED_STATUS_OPTIONS.map((option) => [option.value, option]),
  );

  if (statusesFromData && statusesFromData.length > 0) {
    statusesFromData.forEach((status) => {
      if (status && !statusMap.has(status)) {
        statusMap.set(status, {
          value: status,
          label:
            status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " "),
        });
      }
    });
  }

  return Array.from(statusMap.values());
}

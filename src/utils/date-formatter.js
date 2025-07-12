export function formatDateToIndonesian(dateString) {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return dateString;

    const wibOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Jakarta",
      hour12: false,
    };

    const formattedDate = new Intl.DateTimeFormat("id-ID", wibOptions).format(
      date,
    );

    return `${formattedDate} WIB`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString || "-";
  }
}

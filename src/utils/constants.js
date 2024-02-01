export const API_SERVER = "http://localhost:3000";
// API_SERVER = "http://192.168.1.77:3000";
export const colors = {
  background: "#f4f5f8",
  stroke: "#9b98a7",
};
export const primaryColor = "#272a37";
export function formatDateTime(dateTimeString, addTime) {
  const date = new Date(dateTimeString);
  const day = String(date.getDate()).padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()]?.toUpperCase();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const amPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  if (addTime === false) {
    return `${day}-${month}-${year}`;
  } else {
    return `${day}-${month}-${year}, ${formattedHours}:${minutes}${amPm}`;
  }
}

export function formatCurrency(amount) {
  return parseFloat(amount)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const formatDate = (date) => {
  return date?.toISOString()?.split("T")[0];
};

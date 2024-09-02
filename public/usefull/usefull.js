import dayjs from "dayjs"

export function formatDate(dateString) {
  
    const date = dayjs(dateString);
    return date.format("DD-MM-YYYY");
}
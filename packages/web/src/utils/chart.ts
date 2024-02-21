import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getLocalizeTime = (date: string | Date) => {
  const localTime = dayjs.utc(date).local();
  return localTime.format("YYYY-MM-DD HH:mm:ss");
};

export const handleXAxis = (dates: string[]) => {
    console.log("handle x axis in local", dates);
};

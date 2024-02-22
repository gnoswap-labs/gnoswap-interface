import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getLocalizeTime = (date: string | Date) => {
  const localTime = dayjs.utc(date).local();
  return localTime.format("YYYY-MM-DD HH:mm:ss");
};

export const handleXAxis = (dates: any[], count: number) => {
  const length = dates.length;

  // get center position
  const center = Math.floor((length - 1) / 2);
  const space = Math.floor(length / count);

  // array of labels positions
  const positions = new Set<number>();

  // index to get position after center;
  let leftIndex = center;
  let rightIndex = center;
  positions.add(center);
  // add below center
  while(true) {
    leftIndex-=space;
    if (leftIndex < 0 || rightIndex > length -1 || positions.size > count) break;
    if (positions.size < count) {
      positions.add(leftIndex);
    }
    rightIndex+=space;
    if (positions.size < count) {
      positions.add(rightIndex);
    }

  }
  //sort index
  return Array.from(positions).sort((a, b) => a - b);
};

export const parseDate = (dateString: string) => {
  const date = dayjs(dateString);
  return date.format("MMM D, YYYY");
};
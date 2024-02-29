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
  while (true) {
    leftIndex -= space;
    if (leftIndex < 0 || rightIndex > length - 1 || positions.size > count)
      break;
    if (positions.size < count) {
      positions.add(leftIndex);
    }
    rightIndex += space;
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

/*
  * maxAxis: number of axis in chart
  * length: length of chart
  * MIN_AXIS: minimum number of xaxis ( default 3. for tablet or mobile = 3. pc maybe > 3)
  * Now we can calculate min surplus from length % i (i from MIN to maxAxis) to get best label

*/

export const getNumberOfAxis = (
  length: number,
  maxAxis: number,
  MIN_AXIS = 3,
) => {
  let result = maxAxis;
  // because max Label  = 7
  let minSurplus = 6;
  for (let i = MIN_AXIS; i <= maxAxis; i++) {
    if (minSurplus < length % i) {
      minSurplus = length % i;
      result = i;
    }
  }
  return result;
};

export const getLabelChart = (data: any[], numberOfAxis: number) => {
  const length = data.length;
  const label = [];
  for (let i = data.length - 1; i >= 0; i -= length / numberOfAxis) {
    label.push(data[i]);
  }
  return label;
};

/*
 * length: length of data
 * width: width of chart( it depends on responsive)
 * space: space between 2 point in data( depends on tab: 7D, 1M, 3M)
 * caluculate to get padding left and right
 * px: get px of every point with current data
 * Now have different left and right. Because it depends on the first day and last day
 * Last day and first day have different data.
 * For first day: data may not start by 00:00
 * For last day: data may not end by the time before 00:00. i can 23:50 or 23:00 or 20:00( depends on tab: 7D, 1M, 3M)
 * We can just depends on data between first and last day to make center label and have the correct label
 *
 */

export const getPaddingLeftAndRight = (
  data: Date[],
  width: number,
  space: number,
) => {
  const px = width / data.length;
  const firstDay = new Date(data[0]);
  const nextDay = new Date(data[0]);
  nextDay.setDate(firstDay.getDate() + 1);
  nextDay.setHours(0);
  nextDay.setMinutes(0);
  nextDay.setSeconds(0);

  let countFirstDay = 0;
  let countLastDay = 0;
  while (true) {
    if (firstDay < nextDay) {
      countFirstDay++;
    } else {
      break;
    }
    firstDay.setMinutes(firstDay.getMinutes() + space);
  }

  const lastDay = data[data.length - 1];
  const beforeLastDay = data[data.length - 1];
  beforeLastDay.setHours(0);
  beforeLastDay.setMinutes(0);
  beforeLastDay.setSeconds(0);
  while (true) {
    if (beforeLastDay < lastDay) {
      countLastDay++;
    } else {
      break;
    }
    lastDay.setMinutes(lastDay.getMinutes() - space);
  }
  return {
    // min px = 12
    paddingLeft: Math.max(12, px * countFirstDay),
    paddingRight: Math.max(12, px * countLastDay),
  };
};

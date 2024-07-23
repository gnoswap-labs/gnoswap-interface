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

const MIN_AXIS = 3;
export const getNumberOfAxis = (
  length: number,
  maxAxis: number,
  minAxis = MIN_AXIS,
) => {
  let result = minAxis;
  let minSurplus = 999999999;
  for (let i = minAxis; i <= maxAxis; i++) {
    const tempSpace = Math.floor(length / i);
    const floorNumberAxis = tempSpace * i - tempSpace + 1;
    const ceilNumberAxis = (tempSpace + 1) * i - tempSpace + 1;
    if (ceilNumberAxis > length) {
      if (minSurplus > length - floorNumberAxis) {
        minSurplus = length - floorNumberAxis;
        result = i;
      }
    } else {
      const checkCeillOrFloor = Math.min(
        length - floorNumberAxis,
        length - ceilNumberAxis,
      );
      if (minSurplus > checkCeillOrFloor) {
        minSurplus = checkCeillOrFloor;
        result = i;
      }
    }
  }
  return result;
};
/*
 * data is unique day in array
 * numberOfAxis is getNumberOfAxis();
 */

export const getLabelChart = (data: any[], numberOfAxis: number) => {
  const length = data.length;
  const label = [];
  let tempSpace = Math.floor(length / numberOfAxis);
  const ceilNumberAxis = tempSpace * numberOfAxis - tempSpace + 1;
  if (ceilNumberAxis <= length && numberOfAxis !== data.length) {
    tempSpace += 1;
  }

  for (let i = data.length - 1; i >= 0; i -= tempSpace) {
    if (tempSpace === 1) {
      label.push(data[i].slice(0, 10));
    } else {
      if (i < tempSpace) {
        label.push(data[0].slice(0, 10));
      } else {
        label.push(data[i].slice(0, 10));
      }
    }
  }
  return label.reverse();
};

/*
  V2
*/

export const getLabelChartV2 = (data: any[], space: number) => {
  const length = data.length;
  const temp = [];
  for (let i = 0; i < length; i += space) {
    temp.push(data[i].slice(0, 10));
  }
  return temp;
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

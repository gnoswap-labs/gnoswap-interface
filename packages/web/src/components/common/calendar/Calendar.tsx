import React, { useCallback, useState } from "react";
import IconStrokeArrowLeft from "../icons/IconStrokeArrowLeft";
import IconStrokeArrowRight from "../icons/IconStrokeArrowRight";
import { wrapper } from "./Calendar.styles";

export interface CalendarItem {
  year: number;
  month: number;
  date: number;
}

interface CalendarProps {
  selectedDate: CalendarItem;
  dayOfWeeks?: string[];
  onClickDate: (date: CalendarItem) => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  dayOfWeeks = ["S", "M", "T", "W", "T", "F", "S"],
  onClickDate,
}) => {
  const [currentDate, setCurrentDate] = useState<CalendarItem>({
    year: selectedDate.year,
    month: selectedDate.month,
    date: 1,
  });

  function isDate(date: number) {
    return date !== -1;
  }

  function verifyDate(date: number) {
    const crDate = new Date();
    const checkDate = new Date(
      `${currentDate.year}-${currentDate.month}-${date}`,
    );
    return crDate <= checkDate;
  }

  const getCurrent = useCallback(() => {
    return new Date(currentDate.year, currentDate.month - 1, currentDate.date);
  }, [currentDate]);

  const getFirstDate = useCallback(() => {
    const now = getCurrent();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }, [getCurrent]);

  const getLastDate = useCallback(() => {
    const now = getCurrent();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }, [getCurrent]);

  const currentMonthName = useCallback(() => {
    const month = getCurrent().getMonth();
    const monthName = MONTH_NAMES[month];
    const year = getCurrent().getFullYear();
    return `${monthName} ${year}`;
  }, [getCurrent]);

  const getDates = useCallback(() => {
    const blanks = Array.from({ length: getFirstDate().getDay() }, () => -1);
    const dates = Array.from(
      { length: getLastDate().getDate() },
      (_, index) => index + 1,
    );
    return [...blanks, ...dates];
  }, [getFirstDate, getLastDate]);

  const isSelected = useCallback(
    (date: number) => {
      const current = getCurrent();
      if (selectedDate.year !== current.getFullYear()) {
        return false;
      }
      if (selectedDate.month !== current.getMonth() + 1) {
        return false;
      }
      return selectedDate.date === date;
    },
    [selectedDate, getCurrent],
  );

  const onClickCalendarDate = (date: number) => {
    onClickDate({
      year: currentDate.year,
      month: currentDate.month,
      date: date,
    });
  };

  const onClickPreviousMonth = useCallback(() => {
    const now = getCurrent();
    const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    setCurrentDate({
      year: previous.getFullYear(),
      month: previous.getMonth() + 1,
      date: 1,
    });
  }, [getCurrent]);

  const onClickNextMonth = useCallback(() => {
    const now = getCurrent();
    const previous = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setCurrentDate({
      year: previous.getFullYear(),
      month: previous.getMonth() + 1,
      date: 1,
    });
  }, [getCurrent]);

  return (
    <div css={wrapper}>
      <div className="calendar-info">
        <button className="arrow-button" onClick={onClickPreviousMonth}>
          <IconStrokeArrowLeft />
        </button>
        <h4 className="title-date">{currentMonthName()}</h4>
        <button className="arrow-button" onClick={onClickNextMonth}>
          <IconStrokeArrowRight />
        </button>
      </div>

      <div className="date-wrap date-head">
        {dayOfWeeks.map((dayOfWeek, index) => (
          <span key={index}>{dayOfWeek}</span>
        ))}
      </div>

      <div className="date-wrap date-body">
        {getDates().map((date, index) =>
          isDate(date) ? (
            <span
              key={index}
              className={`${isSelected(date) ? "date selected" : "date"} ${
                !verifyDate(date) ? "disable-date" : ""
              }`}
              onClick={() => onClickCalendarDate(date)}
            >
              {date}
            </span>
          ) : (
            <span key={index} />
          ),
        )}
      </div>
    </div>
  );
};

export default Calendar;

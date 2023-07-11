import Calendar from "@components/common/calendar/Calendar";
import React, { useCallback, useState } from "react";
import { SelectDistributionPeriodInputWrapper } from "./SelectDistributionPeriodInput.styles";

interface DistributionPeriodDate {
  year: number;
  month: number;
  date: number;
}

export interface SelectDistributionPeriodInputProps {
  title: string;
  date?: DistributionPeriodDate;
  setDate: (date: DistributionPeriodDate) => void;
}

const DefaultDate = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  date: new Date().getDate(),
};

const SelectDistributionPeriodInput: React.FC<SelectDistributionPeriodInputProps> = ({
  title,
  date,
  setDate,
}) => {
  const [opened, setOpened] = useState(false);

  const getDateText = useCallback(() => {
    if (!date) {
      return "";
    }
    return `${date.date}/${date.month}/${date.year}`;
  }, [date]);

  const onClickDateWrapper = useCallback(() => {
    setOpened(!opened);
  }, [opened]);

  const onClickCalendarDate = (date: DistributionPeriodDate) => {
    setDate(date);
    setOpened(false);
  };

  return (
    <SelectDistributionPeriodInputWrapper>
      <span className="title">{title}</span>

      <div className="date-wrapper" onClick={onClickDateWrapper}>
        <span className="date">{getDateText()}</span>
      </div>

      <div className="calendar-container">
        {opened && (
          <div className="calendar-wrapper">
            <Calendar
              selectedDate={date || DefaultDate}
              onClickDate={onClickCalendarDate}
            />
          </div>
        )}
      </div>
    </SelectDistributionPeriodInputWrapper>
  );
};

export default SelectDistributionPeriodInput;
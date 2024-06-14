import { getDateUtcToLocal } from "@common/utils/date-util";
import Tooltip from "../tooltip/Tooltip";
import { DateTimeTooltipWrapper, FloatingContentWrapper, TimeNoteWrapper, TimeWrapper } from "./DateTimeTooltip.styles";

interface DateTimeTooltipProps {
  children: React.ReactElement;
  date?: Date | string;
}

function DateTimeTooltip({ children, date }: DateTimeTooltipProps) {
  const timeFormat = date ? getDateUtcToLocal(date) : undefined;

  return (<DateTimeTooltipWrapper>
    <Tooltip
      placement="top"
      FloatingContent={<FloatingContentWrapper>
        {timeFormat && <TimeWrapper>{`${timeFormat.value}`}</TimeWrapper>}
        <TimeNoteWrapper>*Based on your local time</TimeNoteWrapper>
      </FloatingContentWrapper>}
    >
      {children}
    </Tooltip>
  </DateTimeTooltipWrapper>);
}

export default DateTimeTooltip;
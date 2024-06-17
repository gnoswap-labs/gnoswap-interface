import { getDateUtcToLocal } from "@common/utils/date-util";
import { Placement } from "@floating-ui/react";
import Tooltip from "../tooltip/Tooltip";
import { DateTimeTooltipWrapper, FloatingContentWrapper, TimeNoteWrapper, TimeWrapper } from "./DateTimeTooltip.styles";

interface DateTimeTooltipProps {
  children: React.ReactElement;
  date?: Date | string;
  placement?: Placement;
}

function DateTimeTooltip({ children, date, placement }: DateTimeTooltipProps) {
  const timeFormat = date ? getDateUtcToLocal(date) : undefined;

  return (<DateTimeTooltipWrapper>
    <Tooltip
      placement={placement ?? "top"}
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
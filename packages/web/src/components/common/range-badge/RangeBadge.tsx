import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { useMemo } from "react";
import {
  RangeDot,
  RangeBadgeText,
  RangeBadgeWrapper,
} from "./RangeBadge.styles";

export interface RangeBadgeProps {
  status: RANGE_STATUS_OPTION;
  className?: string;
  isShorten?: boolean;
}

const RangeBadge: React.FC<RangeBadgeProps> = ({ status, className, isShorten }) => {
  const statusText = useMemo(() => {
    if (isShorten) {
      switch (status) {
        case RANGE_STATUS_OPTION.IN:
          return "In";
        case RANGE_STATUS_OPTION.OUT:
          return "Out";
        case RANGE_STATUS_OPTION.NONE:
        default:
          return "Closed";
      }
    }

    switch (status) {
      case RANGE_STATUS_OPTION.IN:
        return "In-range";
      case RANGE_STATUS_OPTION.OUT:
        return "Out-range";
      case RANGE_STATUS_OPTION.NONE:
      default:
        return "Closed";
    }
  }, [isShorten, status]);

  return <RangeBadgeWrapper className={className} >
    <RangeDot status={status} />
    <RangeBadgeText status={status}>
      {statusText}
    </RangeBadgeText>
  </RangeBadgeWrapper >;
};

export default RangeBadge;

import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import {
  RangeDot,
  RangeBadgeText,
  RangeBadgeWrapper,
} from "./RangeBadge.styles";

export interface RangeBadgeProps {
  status: RANGE_STATUS_OPTION;
  className?: string;
}

const RangeBadge: React.FC<RangeBadgeProps> = ({ status, className }) => (
  <RangeBadgeWrapper className={className}>
    <RangeDot status={status} />
    <RangeBadgeText status={status}>
      {status === RANGE_STATUS_OPTION.IN ? "In-range" : status === RANGE_STATUS_OPTION.OUT ? "Out-range" : "Closed"}
    </RangeBadgeText>
  </RangeBadgeWrapper>
);

export default RangeBadge;

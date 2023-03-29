import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import {
  RandgeDot,
  RangeBadgeText,
  RangeBadgeWrapper,
} from "./RangeBadge.styles";

export interface RangeBadgeProps {
  status: RANGE_STATUS_OPTION;
}

const RangeBadge: React.FC<RangeBadgeProps> = ({ status }) => (
  <RangeBadgeWrapper>
    <RandgeDot status={status} />
    <RangeBadgeText status={status}>
      {status === RANGE_STATUS_OPTION.IN ? "In range" : "Out of range"}
    </RangeBadgeText>
  </RangeBadgeWrapper>
);

export default RangeBadge;

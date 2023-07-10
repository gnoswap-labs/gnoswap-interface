import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { RangeBadgeProps } from "./RangeBadge";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";

export const RangeBadgeWrapper = styled.div`
  ${mixins.flexbox("row", "center", "center", false)};
  height: 15px;
  gap: 6px;
`;

export const RangeDot = styled.i<RangeBadgeProps>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ theme, status }) =>
    status === RANGE_STATUS_OPTION.IN
      ? theme.color.green01
      : theme.color.red01};
`;

export const RangeBadgeText = styled.span<RangeBadgeProps>`
  color: ${({ theme, status }) =>
    status === RANGE_STATUS_OPTION.IN
      ? theme.color.green01
      : theme.color.red01};
`;

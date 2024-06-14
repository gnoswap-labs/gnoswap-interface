import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";

export const DateTimeTooltipWrapper = styled.div``;

export const FloatingContentWrapper = styled.div``;

export const TimeNoteWrapper = styled.div`
  ${fonts.p4}
  color: ${({ theme }) => theme.color.text04};
`;

export const TimeWrapper = styled.div`
  margin-bottom: 8px;
  color: ${({ theme }) => theme.color.text02};
  ${fonts.body12}
`;


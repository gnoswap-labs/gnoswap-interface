import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";

export const IncentivizeBlockTooltipContentWrapper = styled.div``;

export const Content = styled.div`
  margin-bottom: 24px;
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text01};
`;

export const SubContent = styled.div`
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text04};
`;

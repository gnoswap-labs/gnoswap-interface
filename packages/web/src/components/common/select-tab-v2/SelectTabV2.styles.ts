import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const SelectTabWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start", false)};
  background-color: ${({ theme }) => theme.color.background15};
  border: 1px solid ${({ theme }) => theme.color.border13};
  border-radius: 4px;
  padding: 2px;
  flex-shrink: 0;
`;

export const SelectButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  ${fonts.body10};
  padding: 8px 24px;
  border-radius: 4px;
  color: ${({ theme }) => theme.color.text04};
  transition: all 0.3s ease;
  flex-shrink: 0;

  ${media.mobile} {
    ${fonts.body12};
  }

  &.selected {
    background-color: ${({ theme }) => theme.color.select};
    color: ${({ theme }) => theme.color.text02};
  }
`;

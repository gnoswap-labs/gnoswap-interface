import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const SelectTabWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start", false)};
  background-color: ${({ theme }) => theme.colors.colorBlack};
  border: 1px solid ${({ theme }) => theme.colors.gray60};
  border-radius: 4px;
  padding: 2px;
`;

export const SelectButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  ${fonts.body9};
  height: 41px;
  padding: 0px 24px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.gray40};
  transition: all 0.3s ease;
  &.selected {
    background-color: ${({ theme }) => theme.colors.gray60};
    color: ${({ theme }) => theme.colors.gray10};
  }
`;

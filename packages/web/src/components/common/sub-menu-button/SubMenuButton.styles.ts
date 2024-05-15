import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const SubMenuButtonWrapper = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  padding: 8px;
  position: relative;
  ${fonts.body3};
  cursor: pointer;
  color: ${({ theme }) => theme.color.text07};
  &.selected,
  &:hover {
    color: ${({ theme }) => theme.color.text04};
  }
`;

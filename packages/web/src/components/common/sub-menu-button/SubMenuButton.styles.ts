import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const SubMenuButtonWrapper = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  position: relative;
  ${fonts.body3};
  cursor: pointer;
  color: ${({ theme }) => theme.color.text04};
  &.selected,
  &:hover {
    color: ${({ theme }) => theme.color.text16};
  }
`;

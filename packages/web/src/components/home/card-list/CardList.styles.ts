import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { UP_DOWN_TYPE } from "./CardList";

export const CardListWrapper = styled.ul`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
`;

export const ListItem = styled.li<{ upDownType: UP_DOWN_TYPE }>`
  ${mixins.flexbox("row", "center", "flex-start")};
  ${fonts.body12};
  width: 100%;
  height: 40px;
  padding: 0px 24px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: ${({ theme }) => theme.color.text01};
  &:hover {
    background-color: ${({ theme }) => theme.color.hover02};
  }

  .list-logo {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  i,
  .list-content {
    color: ${({ theme }) => theme.color.text04};
  }
  i {
    margin-right: 24px;
  }
  .token-name {
    margin: 0px 8px;
  }
  .list-content {
    margin-right: auto;
  }
  .arrow-up * {
    fill: ${({ theme }) => theme.color.green01};
  }
  .arrow-down * {
    fill: ${({ theme }) => theme.color.red01};
  }
  .notation-value {
    color: ${({ theme, upDownType }) => {
      if (upDownType === UP_DOWN_TYPE.UP) return theme.color.green01;
      if (upDownType === UP_DOWN_TYPE.DOWN) return theme.color.red01;
      return theme.color.text01;
    }};
  }
`;

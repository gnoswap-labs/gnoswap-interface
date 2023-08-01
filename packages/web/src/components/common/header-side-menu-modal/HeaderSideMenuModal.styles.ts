import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";

export const HeaderSideMenuModalWrapper = styled.div`
  ${mixins.posMoveToTopAndLeft("80%", "40%")};
  transform: translate(-110%, 14px);
  width: 240px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.background01};
  border: 1px solid ${({ theme }) => theme.color.border02};
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.2);
`;

export const Navigation = styled.nav`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  padding: 4px 0px;
  ul {
    width: 100%;
    gap: 4px;
  }
  li {
    ${mixins.flexbox("row", "center", "flex-start")};
    padding: 8px 16px;
    color: ${({ theme }) => theme.color.text04};
    &.selected,
    &:hover {
      color: ${({ theme }) => theme.color.text16};
      background-color: ${({ theme }) => theme.color.hover01};
      .left-icon * {
        stroke: ${({ theme }) => theme.color.icon10};
      }
      .right-icon * {
        fill: ${({ theme }) => theme.color.icon10};
      }
    }
  }
`;

export const LeftIcon = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  width: 20px;
  height: 20px;
`;

export const LeftIconMenu = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  ${fonts.body10};
  gap: 10px;
`;

export const RightIconMenu = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  ${fonts.body12};
  gap: 5px;
`;

export const LinkIconButton = styled.button`
  ${mixins.flexbox("row", "center", "flex-start")};
  width: 16px;
  height: 16px;
  margin: 1px 0px;
  .right-icon * {
    fill: ${({ theme }) => theme.color.icon03};
  }
`;

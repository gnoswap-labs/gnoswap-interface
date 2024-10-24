import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

export const SubMenuWrapper = styled.div`
  position: absolute;
  top: 44px;
  ${media.tablet} {
    top: 44px;
  }

  left: 0px;
  width: 240px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.background01};
  border: 1px solid ${({ theme }) => theme.color.border02};
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.2);
  ${media.mobile} {
    width: 100%;
    left: 0;
    bottom: 0;
    position: fixed;
    top: initial;
  }
`;

export const FakeSpaceWrapper = styled.div`
  position: absolute;
  height: 44px;
  top: 0px;

  left: 0px;
  width: 40px;
  ${media.mobile} {
    width: 100%;
    left: 0;
    bottom: 0;
    position: fixed;
    top: initial;
  }
`;

export const Navigation = styled.nav`
  width: 100%;
  padding: 0px;

  .header-side-menu-item {
    width: 100%;
  }

  ul {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 4px;
    &:last-of-type {
      li {
        padding: 10px 16px;
      }
    }

    li {
      ${mixins.flexbox("column", "flex-start", "center")};
      width: 100%;
      &.first-side-menu {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
      &.last-side-menu {
        border-bottom-right-radius: 8px;
        border-bottom-left-radius: 8px;
      }
      height: 38px;
      padding: 8px 16px;
      color: ${({ theme }) => theme.color.text04};

      .left-icon * {
        stroke: ${({ theme }) => theme.color.text04};
      }

      &.selected,
      &:hover {
        background-color: ${({ theme }) => theme.color.hover04};
        > div {
          color: ${({ theme }) => theme.color.text16};
          .left-icon * {
            stroke: ${({ theme }) => theme.color.text16};
          }
          .right-icon {
            fill: ${({ theme }) => theme.color.text16};
          }
          button {
            svg * {
              fill: ${({ theme }) => theme.color.text16};
            }
          }
        }
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

export const MenuDivider = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  height: 1px;
  align-self: stretch;
  background: ${({ theme }) => theme.color.border02};
`;

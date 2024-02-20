import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";
interface Props {
  width?: number;
}

export const SelectLanguageWrapper = styled.div<Props>`
  position: absolute;
  width: 280px;
  top: 45px;
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2);
  padding: 15px;
  z-index: ${Z_INDEX.modal};
  right: ${({ width }) => {
    return width && width < 1521 && "0px";
  }};
  left: ${({ width }) => {
    return width && width < 768 && "0px";
  }};
  @media (min-width: 1521px) {
    left: 0;
  }

  ${media.tablet} {
    top: 46px;
    right: -50px;
  }
  ${media.mobile} {
    ${mixins.flexbox("column", "center", "flex-start")};
    position: fixed;
    width: 100%;
    height: 228px;
    top: auto;
    bottom: 0;
    z-index: ${Z_INDEX.modal};
    padding: 16px 16px 0 16px;
    min-width: 360px;
  }
  .header {
    ${mixins.flexbox("row", "center", "space-between")};
    svg {
      width: 16px;
      height: 16px;
    }
    svg * {
      fill: ${({ theme }) => theme.color.icon03};
    }
    svg:hover * {
      fill: ${({ theme }) => theme.color.icon07};
    }
    p {
      color: ${({ theme }) => theme.color.text01};
      ${fonts.p1}
    }
    > div {
      width: 16px;
      height: 16px;
      &:first-of-type {
        cursor: pointer;
      }
    }
    ${media.mobile} {
      width: 100%;
    }
  }
  .list {
    margin-top: 16px;
    max-height: 360px;
    overflow-y: scroll;
    > div {
      cursor: pointer;
      padding: 10px 8px;
      ${mixins.flexbox("row", "center", "space-between")};
      p {
        ${fonts.p2}
        color: ${({ theme }) => theme.color.text10};
      }
      svg {
        width: 16px;
        height: 16px;
      }
      svg * {
        fill: ${({ theme }) => theme.color.point};
      }
      &:hover {
        border-radius: 4px;
        background-color: ${({ theme }) => theme.color.backgroundOpacity};
      }
    }
    ${media.mobile} {
      width: 100%;
      max-height: 180px;

    }
  }

`;

import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const HeaderWrapper = styled.div`
  ${mixins.flexbox("row", "flex-end", "space-between")};
  width: 100%;
  ${fonts.h5};
  color: ${({ theme }) => theme.color.text02};
  .header {
    text-wrap: nowrap;
    ${mixins.flexbox("row", "center", "flex-start")};
    .hide-close-position {
      display: none;
    }
    ${media.mobile} {
      width: 100%;
      .hide-close-position {
        display: flex;
        ${media.mobile} {
          label {
            display: none;
          }
        }
      }
      ${mixins.flexbox("row", "center", "space-between")};
    }

    h2 {
      display: flex;
      flex-direction: row;
      align-items: center;

      button {
        display: inline-flex;
        height: 24px;
        align-items: center;
        justify-content: center;
        margin-left: 8px;
        > svg * {
          fill: ${({ theme }) => theme.color.icon03};
        }
        > svg:hover * {
          fill: ${({ theme }) => theme.color.icon07};
        }
      }
      .name {
        background: ${({ theme }) => theme.color.text32};
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        cursor: pointer;
        font-weight: 700;
      }
      button {
        position: relative;
      }
    }
  }
  ${media.mobile} {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    justify-content: flex-start;
    ${fonts.h6};
  }

  .button-wrap {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 8px;
    .hide-close-position {
      ${mixins.flexbox("row", "center", "cencter")};
      margin-right: 28px;
      ${media.tablet} {
        margin-right: 16px;
      }
      ${media.mobile} {
        display: none;
      }
    }
    ${media.mobile} {
      width: 100%;
      button {
        width: 100%;
      }
    }
  }
`;

export const CopyTooltip = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  position: absolute;
  top: -65px;
  left: -45px;
  z-index: 2;
  .box {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 115px;
    padding: 16px;
    gap: 8px;
    flex-shrink: 0;
    border-radius: 8px;
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text02};
    background-color: ${({ theme }) => theme.color.background02};
    & > span {
      white-space: nowrap;
    }
  }
  .dark-shadow {
    box-shadow: 10px 14px 60px rgba(0, 0, 0, 0.4);
  }
  .light-shadow {
    box-shadow: 10px 14px 48px 0px rgba(0, 0, 0, 0.12);
  }

  .polygon-icon * {
    fill: ${({ theme }) => theme.color.background02};
  }

  ${media.mobile} {
    ${mixins.flexbox("column", "center", "flex-start")};
    top: -60px;
    left: -40px;
    z-index: 2;
    .box {
      padding: 12px;
    }

    & .rotate-90 {
      transform: rotate(90deg);
      margin-right: -10px;
    }
  }
`;

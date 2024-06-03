import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";

import styled from "@emotion/styled";
import { Theme } from "@emotion/react";
import { css } from "@emotion/css";
import { media } from "@styles/media";

export const IncreaseLiquidityWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 2px;
  width: 500px;
  height: 100%;
  color: ${({ theme }) => theme.color.text02};
  background-color: ${({ theme }) => theme.color.background06};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  box-shadow: ${({ theme }) => theme.color.shadow01};
  padding: 23px;
  margin: 0 auto;
  h3 {
    margin-bottom: 14px;
    ${fonts.h6};
    ${media.mobile} {
      margin-bottom: 8px;
      font-weight: 500;
    }
  }

  ${media.mobile} {
    padding: 15px;
    width: 100%;
    max-width: 500px;
    gap: 4px;
    .title {
      margin-bottom: 8px;
    }
  }

  article {
    ${mixins.flexbox("column", "flex-start", "center")};
    width: 100%;
    background-color: ${({ theme }) => theme.color.background20};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    padding: 15px;
    gap: 16px;
    &:first-of-type {
      ${media.mobile} {
        position: relative;
      }
    }
    ${media.mobile} {
      padding: 11px;
      gap: 8px;
    }
    .section-title {
      color: ${({ theme }) => theme.color.text10};
      ${fonts.body12}
    }
    &.token-amount-input {
      > div {
        padding: 16px;
        ${media.mobile} {
          padding: 12px;
        }
      }
      .token {
        .selected-token {
          padding: 5px 10px 5px 6px;
          gap: 8px;
          height: 34px;
          span {
            font-size: 16px;
          }
        }
        .not-selected-token {
          padding: 5px 10px 5px 12px;
          gap: 8px;
          height: 34px;
          span {
            font-size: 16px;
          }
        }
      }
    }
  }
  .button-confirm {
    gap: 8px;
    margin-top: 16px;
    height: 57px;
    span {
      ${fonts.body7}
    }
    ${media.mobile} {
      height: 41px;
      margin-top: 8px;
      span {
        ${fonts.body9}
      }
    }
  }
`;

export const IncreaseLiquidityBoxStyle = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "center")};
  width: 100%;
  background-color: ${theme.color.backgroundOpacity};
  border-radius: 8px;
  border: 1px solid ${theme.color.border02};
  padding: 15px;
  gap: 16px;

  .section-title {
    color: ${theme.color.text05};
    ${fonts.body12}
  }
`;

export const IncreaseLiquidityLoadingWrapper = styled(IncreaseLiquidityWrapper)`
  .header-wrapper {
    ${mixins.flexbox("row", "center", "space-between")};
    position: relative;
    width: 100%;

    ${media.mobile} {
      margin-bottom: 6px;
    }

    .setting-button {
      width: 24px;
      height: 24px;
      .setting-icon * {
        fill: ${({ theme }) => theme.color.icon03};
      }
      .setting-icon:hover * {
        fill: ${({ theme }) => theme.color.icon07};
      }
    }
  }

  h5 {
    color: ${({ theme }) => theme.color.text04};
    ${fonts.body12}
    &.enter-increase-amount {
      color: ${({ theme }) => theme.color.text10};
    }
  }

  .loading-wrapper {
    ${mixins.flexbox("column", "flex-start", "center")};
    width: 100%;
    align-items: center;
    justify-content: center;

    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};

    &.position {
      height: 285px;
    }

    &.amount {
      height: 200px;
    }
  }
`;

import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";

import styled from "@emotion/styled";
import { Theme } from "@emotion/react";
import { css } from "@emotion/css";
import { media } from "@styles/media";

export const PoolIncentivizeWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 16px;
  width: 500px;
  height: 100%;
  color: ${({ theme }) => theme.color.text02};
  background-color: ${({ theme }) => theme.color.background06};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  box-shadow: ${({ theme }) => theme.color.shadow01};
  padding: 23px;
  margin: 0 auto;
  ${media.mobile} {
    padding: 11px;
    width: 100%;
    max-width: 500px;
  }

  .title {
    ${fonts.h6};
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
    height: 57px;
    span {
      ${fonts.body7}
    }
    ${media.mobile} {
      height: 41px;
      span {
        ${fonts.body9}
      }
    }
  }
`;

export const PoolIncentivizeBoxStyle = (theme: Theme) => css`
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

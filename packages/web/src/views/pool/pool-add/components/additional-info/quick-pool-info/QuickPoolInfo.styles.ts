import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const QuickPoolInfoWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  background-color: ${({ theme }) => theme.color.background01};
  width: 430px;
  padding: 15px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  gap: 16px;
  .pool-info,
  .unstake-info,
  .stake-info {
    ${mixins.flexbox("column", "center", "center")};
    gap: 4px;
    width: 100%;
    > div {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      .label,
      .value {
        ${mixins.flexbox("row", "center", "center")};
        ${fonts.body12}
        gap: 5px;
      }
    }
  }
  .token-pair {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 8px;
    .token-name {
      color: ${({ theme }) => theme.color.text02};
      ${fonts.body7};
    }
  }
  .pool-info {
    > div {
      height: 34px;
      &:last-of-type {
        height: 33px;
      }
    }
    .label {
      color: ${({ theme }) => theme.color.text04};
    }
    .value {
      color: ${({ theme }) => theme.color.text02};

      .staking-apr-value,
      .fee-apr-value {
        ${mixins.flexbox("row", "center", "flex-end")};
      }
    }
  }
  .unstake-info,
  .stake-info {
    .title {
      height: 34px;
      .label {
        color: ${({ theme }) => theme.color.text04};
      }
      .value {
        ${mixins.flexbox("row", "center", "flex-start")};
        svg {
          width: 16px;
          height: 16px;
          * {
            fill: ${({ theme }) => theme.color.icon06};
          }
        }
        ${fonts.body11}
        color: ${({ theme }) => theme.color.text07};
        &:hover {
          color: ${({ theme }) => theme.color.text08};
          cursor: pointer;
        }
      }
    }
    .content {
      height: 33px;
      .label {
        ${mixins.flexbox("row", "center", "flex-start")};
        gap: 5px;
        color: ${({ theme }) => theme.color.text03};
      }
      .value {
        color: ${({ theme }) => theme.color.text02};
      }
    }
  }
  ${media.tablet} {
    margin-left: 0;
    width: 100%;
    max-width: 500px;
  }
  ${media.mobile} {
    padding: 11px;
    gap: 12px;
  }
`;

export const Divider = styled.div`
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.color.border02};
`;


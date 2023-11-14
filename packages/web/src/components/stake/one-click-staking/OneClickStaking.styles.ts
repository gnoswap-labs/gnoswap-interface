import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const OneClickStakingWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  width: 430px;
  padding: 23px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  margin-left: 16px;
  gap: 16px;
  .one-click-info,
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
        ${fonts.body12}
        x
      }
    }
  }
  .one-click-info {
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
    }
  }
  .unstake-info, .stake-info {
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
    width: 500px;
    max-width: 500px;
  }
`;

export const Divider = styled.div`
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.color.border02};
`;

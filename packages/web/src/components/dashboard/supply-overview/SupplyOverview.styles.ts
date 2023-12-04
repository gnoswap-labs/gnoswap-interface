import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const SupplyOverviewWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")}
  width: 100%;
  color: ${({ theme }) => theme.color.text02};
  padding: 23px;
  gap: 24px;
  .supply-overview {
    ${fonts.body9};
    ${media.mobile} {
      ${fonts.body7};
    }
  }
  ${media.mobile} {
    padding: 11px;
    gap: 16px;
  }
`;

export const SupplyInfoWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")}
  width: 100%;
  ${fonts.body7};
  gap: 16px;
  ${media.mobile} {
    ${fonts.body9};
  }

  .label-title {
    ${mixins.flexbox("row", "center", "flex-start")};
    ${fonts.body10};
    color: ${({ theme }) => theme.color.text04};
    gap: 4px;
    flex-shrink: 0;

    ${media.mobile} {
      ${fonts.body12}
    }
    svg {
      margin: 1.5px 0px;
      width: 18px;
      height: 18px;
    }
    path {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }

  .total-supply {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    ${media.tabletMiddle} {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }

  .circulating-supply {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 16px;
    ${media.tabletMiddle} {
      gap: 8px;
    }
    ${media.mobile} {
      gap: 6px;
    }
    .circulating-info {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      ${media.tabletMiddle} {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
    }
  }

  .daily-block-emissions {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    ${media.tabletMiddle} {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }

  .total-staked {
    ${mixins.flexbox("row", "flex-start", "space-between")};
    width: 100%;
    ${media.tabletMiddle} {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
    .staked-info {
      ${mixins.flexbox("column", "flex-end", "center")};
      width: 100%;
      gap: 4px;
      .loading-text-wrapper {
        &:last-of-type {
          padding: 0;
          margin-bottom: -4px;
        }
      }
      ${media.tabletMiddle} {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
      ${media.mobile} {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 4px;
        .loading-text-wrapper {
          span {
            width: 100px;
          }
          &:last-of-type {
            margin-bottom: 0px;
          }
        }
      }
    }
    .staked-ratio-title {
      ${fonts.p2}
      color: ${({ theme }) => theme.color.text04};
    }
  }

  .daily-block-emissions-tooltip {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 4px;
    svg {
      cursor: default;
      margin: 3.5px 0px;
      width: 18px;
      height: 18px;
    }
    path {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }
`;

export interface progressBarProps {
  width?: string;
}

export const ProgressBar = styled.div<progressBarProps>`
  ${mixins.flexbox("column", "flex-start", "center")};
  width: 100%;
  height: 12px;
  border-radius: 99px;
  background-color: ${({ theme }) => theme.color.background11};
  .progress-bar-rate {
    width: ${({ width }) => {
      return width ? width : "0%";
    }};
    height: 12px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.color.point};
  }
`;

export const LoadingTextWrapper = styled.div`
  padding: 2.5px 0;
  span {
    height: 20px;
    display: block;
  }
  ${media.mobile} {
    padding: 1px 0;
  }
`;
export const LoadingProgressWrapper = styled.div`
  width: 100%;
  span {
    height: 12px;
    display: block;
  }
`;

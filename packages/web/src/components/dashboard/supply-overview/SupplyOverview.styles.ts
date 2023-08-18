import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const SupplyOverviewWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")}
  width: 100%;
  color: ${({ theme }) => theme.color.text02};
  padding: 24px;
  gap: 24px;
  .supply-overview {
    ${fonts.body9};
    ${media.mobile} {
      ${fonts.body7};
    }
  }
  ${media.mobile} {
    max-width: 328px;
    padding: 12px;
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

    ${media.mobile} {
      ${fonts.body12}
    }
    svg {
      cursor: pointer;
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
    ${media.mobile} {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
  }

  .circulating-supply {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 16px;
    ${media.mobile} {
      gap: 6px;
    }
    .circulating-info {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      ${media.mobile} {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }
    }
  }

  .daily-block-emissions {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    ${media.mobile} {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
  }

  .total-staked {
    ${mixins.flexbox("row", "flex-start", "space-between")};
    width: 100%;
    ${media.mobile} {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
    .staked-info {
      ${mixins.flexbox("column", "flex-end", "center")};
      width: 100%;
      gap: 4px;
      ${media.mobile} {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 6px;
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
      cursor: pointer;
      margin: 3.5px 0px;
      width: 18px;
      height: 18px;
    }
    path {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }
`;

export const ProgressBar = styled.div`
  ${mixins.flexbox("column", "flex-start", "center")};
  width: 100%;
  height: 12px;
  border-radius: 99px;
  background-color: ${({ theme }) => theme.color.background11};
  .progress-bar-rate {
    width: 245px;
    height: 12px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.color.point};
  }
`;

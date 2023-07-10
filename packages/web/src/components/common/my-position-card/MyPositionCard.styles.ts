import { fonts } from "@constants/font.constant";
import { STAKED_OPTION } from "@constants/option.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (stakeType: STAKED_OPTION) => (theme: Theme) =>
  css`
    width: 100%;
    background-color: ${stakeType === STAKED_OPTION.STAKED
      ? theme.color.background03
      : theme.color.background09};
    border: 1px solid
      ${stakeType === STAKED_OPTION.STAKED
        ? theme.color.border01
        : theme.color.border02};
    box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    padding: 16px;
    transition: all 0.3s ease;
    color: ${theme.color.text02};
    cursor: pointer;
    &:hover {
      background-color: ${theme.color.background02};
      border: 1px solid ${theme.color.border03};
    }
    .token-pair {
      width: 100%;
      ${mixins.flexbox("row", "center", "space-between")};
      ${fonts.body5}
    }
    .badge-info {
      width: 100%;
      margin: 4px 0px 16px;
      ${mixins.flexbox("row", "center", "flex-end")};
      gap: 2px;
      .staking-icon {
        width: 16px;
        height: 16px;
        margin-right: 4px;
        & * {
          fill: ${theme.color.text06};
        }
      }
    }

    .pool-price-info {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
    }

    .content-item {
      ${mixins.flexbox("column", "flex-start", "center")}
      gap: 8px;
      &:nth-child(even) {
        align-items: flex-end;
      }
      span {
        ${mixins.flexbox("row", "center", "center")};
      }
    }

    .label-text {
      color: ${theme.color.text04};
      ${fonts.body12};
      height: 18px;
    }

    .pool-price-graph {
      width: 100%;
      padding: 16px;
      background-color: ${theme.color.backgroundOpacity};
      border-radius: 8px;
      margin-top: 16px;
    }
    .price-range-info {
      ${mixins.flexbox("row", "flex-start", "space-between")};
      width: 100%;
      margin-bottom: 24px;
    }
    .current-price {
      ${mixins.flexbox("column", "flex-start", "center", false)};
      gap: 4px;
      color: ${theme.color.text05};
      ${fonts.p4};
    }
    .dummy-chart {
      width: 100%;
      height: 61px;
      border: 1px solid green;
    }

    .min-max-price {
      ${mixins.flexbox("column", "center", "space-between")};
      width: 100%;
      gap: 8px;
      margin-top: 24px;
    }
    .price-section {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
    }
  `;

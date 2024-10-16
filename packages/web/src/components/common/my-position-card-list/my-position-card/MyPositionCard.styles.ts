import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

interface CardProps {
  staked: boolean;
  viewMyRange: boolean;
  disabled: boolean;
}

interface MyPositionCardWrapperBorderProps {
  viewMyRange: boolean;
}

export const MyPositionCardWrapperBorder = styled.div<MyPositionCardWrapperBorderProps>`
  position: relative;
  z-index: 0;
  overflow: hidden;
  min-width: 322px;
  border-radius: 10px;
  &.special-card {
    min-width: 322px;
    background: ${({ theme }) => theme.color.backgroundGradient4};
    border-radius: 10px;
    padding: 1px;
    height: fit-content;
    ${media.tablet} {
      min-width: 322px;
    }
    ${media.mobile} {
      min-width: 290px;
    }
    .base-border {
      border-radius: 10px;
      background: ${({ theme }) => theme.color.background01};
      > div {
        min-width: auto;
        max-width: 322px;
        border: 0;
        ${media.mobile} {
          min-width: auto;
          max-width: 322px;
        }
      }
    }
  }
  &:hover {
    box-shadow: ${({ viewMyRange }) => {
      return !viewMyRange ? "8px 8px 20px rgba(0, 0, 0, 0.08)" : "none";
    }};
    .base-border {
      > div {
        background-color: ${({ theme, viewMyRange }) => {
          return viewMyRange ? "none" : theme.color.background02;
        }};
      }
    }
  }
  &:before {
    display: ${({ viewMyRange }) => {
      return !viewMyRange ? "none" : "block";
    }};
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.color.backgroundOpacity8};
  }
`;

export const MyPositionCardWrapper = styled.div<CardProps>`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  min-width: 322px;
  gap: 16px;
  padding: 15px;
  border-radius: 10px;
  background-color: ${({ theme, disabled }) => {
    return disabled ? theme.color.background03 : theme.color.background06;
  }};
  ${media.tablet} {
    min-width: 322px;
  }
  ${media.mobile} {
    min-width: 290px;
  }
  border: 1px solid ${({ theme }) => theme.color.border14};

  transition: all 0.3s ease;
  color: ${({ theme, disabled }) => {
    return disabled ? theme.color.text10 : theme.color.text02;
  }};
  cursor: pointer;
  &:hover {
    background-color: ${({ viewMyRange, theme }) => {
      return viewMyRange ? "none" : theme.color.background02;
    }};
    border: 1px solid
      ${({ viewMyRange, theme }) => {
        return viewMyRange ? "none" : theme.color.border14;
      }};
  }
  .title-wrapper {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    gap: 4px;
    ${fonts.body5}
    .disabled-range {
      > span {
        color: ${({ theme }) => theme.color.text05};
      }
    }
    .box-header {
      ${mixins.flexbox("row", "center", "flex-start")};
      align-self: stretch;
      gap: 8px;
      > span {
        ${fonts.body7}
      }
    }
    .badge-group {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 3px;
      .content {
        gap: 4px;
      }
      .staking-icon {
        width: 16px;
        height: 16px;
        & * {
          fill: ${({ theme }) => theme.color.text06};
        }
      }
    }
  }

  .list-wrapper {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 4px;
    ${media.mobile} {
      gap: 5px;
    }
    .list-header {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      .label-text {
        ${fonts.body12}
      }
      &.mt-4 {
        margin-top: 4px;
      }
    }
    .list-content {
      ${mixins.flexbox("row", "center", "space-between")};
      ${fonts.body9};
      width: 100%;
      span {
        ${fonts.body9};
      }

      & .apr-value {
        ${mixins.flexbox("row", "center", "flex-end")};
      }
    }
  }

  .label-text {
    color: ${({ theme }) => theme.color.text04};
    ${fonts.body12};
    height: 18px;
  }
  .view-my-range {
    width: 100%;
    ${mixins.flexbox("row", "center", "center")};
    span {
      ${mixins.flexbox("row", "center", "center")};
      ${fonts.p4}
      color: ${({ theme }) => theme.color.text10};
      text-align: center;
      cursor: pointer;
      gap: 4px;
      > svg {
        width: 18px;
        height: 16px;

        * {
          fill: ${({ theme }) => theme.color.icon15};
        }
      }
      &:hover {
        color: ${({ theme }) => theme.color.text16};
        > svg {
          * {
            fill: ${({ theme }) => theme.color.icon10};
          }
        }
      }
    }
  }
  .pool-price-graph {
    height: 0;
    position: absolute;
    padding: 16px 16px 0 16px;
    left: 1px;
    bottom: -25px;
    width: calc(100% - 2px);
    background-color: ${({ theme }) => theme.color.background06};
    border-radius: 8px;
    cursor: default;
    box-shadow: 0px -4px 4px 0px #00000040;
    transition: height 0.5s ease;
  }
  .open {
    bottom: 1px;
    height: 165px;
  }
  .price-range-info {
    ${mixins.flexbox("row", "flex-start", "space-between")};
    width: 100%;
    margin-bottom: 4px;
  }
  .current-price {
    display: flex;
    width: fit-content;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;

    span {
      color: ${({ theme }) => theme.color.text10};
      cursor: pointer;
      ${fonts.p4};
      &:hover {
        color: ${({ theme }) => theme.color.text16};
      }
    }

    svg {
      width: 16px;
      height: 16px;

      * {
        fill: ${({ theme }) => theme.color.icon03};
      }
    }
  }

  .chart-wrapper {
    display: flex;
    width: 100%;
    margin-top: 16px;
    align-items: center;
    justify-content: center;
    cursor: default;
  }

  .graph-loading-wrapper {
    display: flex;
    width: 100%;
    margin-top: 36px;
    padding: 15px;
    align-items: center;
    justify-content: center;
    cursor: default;
  }

  .min-max-price {
    ${mixins.flexbox("row", "center", "center")};
    width: calc(100% + 32px);
    gap: 4px;
    margin-top: 12px;
    margin-left: -16px;
    .label-text {
      ${fonts.p4};
      height: auto;
      &.positive {
        > span {
          color: ${({ theme }) => theme.color.green01};
        }
      }
      &.negative {
        > span {
          color: ${({ theme }) => theme.color.red01};
        }
      }
    }
  }
`;

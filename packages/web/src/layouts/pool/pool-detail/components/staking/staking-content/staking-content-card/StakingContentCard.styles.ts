import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

interface Props {
  nonTotal: boolean;
  isMax: boolean;
}

export const StakingContentCardWrapper = styled.div<Props>`
  display: contents;
  ${media.tabletMiddle} {
    ${mixins.flexbox("column", "flex-end", "flex-start")};
    width: 100%;
    gap: 5px;
    align-self: stretch;
  }
  .left {
    ${mixins.flexbox("row", "center", "flex-start")};
    min-width: 0;
    ${media.tabletMiddle} {
      justify-content: space-between;
      align-self: stretch;
    }
    .mobile-wrap {
      ${mixins.flexbox("row", "center", "flex-start")};
      height: 50px;
      gap: 24px;
      ${media.tabletMiddle} {
        ${mixins.flexbox("row", "center", "flex-start")};
        gap: 12px;
        flex: 1 0 0;
      }
    }
    .check-wrap {
      ${mixins.flexbox("row", "center", "center")};
      position: relative;
      width: 20px;
      height: 20px;
      border-radius: 99px;
      background: ${({ theme }) => theme.color.background04};
      .check-line {
        height: 49px;
        position: absolute;
        right: 9px;
        bottom: -49px;
        stroke-width: 1px;
        stroke: var(--point-global-point, #233dbd);
      }
      .check-line-long {
        height: 456px;
        position: absolute;
        left: 9px;
        top: 20px;
        stroke-width: 1px;
        stroke: var(--point-global-point, #233dbd);
      }
      .border-not-active {
        width: 1px;
        height: 55px;
        border-left: 1px solid ${({ theme }) => theme.color.border08};
        ${media.tabletMiddle} {
          height: 100px;
        }
      }
      &-not-active {
        border: 1px solid ${({ theme }) => theme.color.border08};
        background: ${({ theme }) => theme.color.background02};
      }
    }
    .name-wrap {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      gap: 4px;
      ${media.tabletMiddle} {
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
      }
      .symbol-text {
        color: ${({ theme }) => theme.color.text02};
        .symbol-count {
          display: none;
          color: ${({ theme }) => theme.color.text04};
          font: inherit;
          ${media.tabletMiddle} {
            display: inline;
          }
        }

        ${fonts.body7}
        ${media.tablet} {
          ${fonts.body9}
        }
        ${media.mobile} {
          ${fonts.p1}
        }
      }

      .icon-wrap {
        ${mixins.flexbox("row", "center", "flex-start")};
        gap: 4px;
        ${media.mobile} {
          gap: 5.33px;
        }
        .content-text {
          color: ${({ theme }) => theme.color.text04};
          ${fonts.body11}
          ${media.mobile} {
            ${fonts.p5}
            font-size: 11px;
          }
        }
        .content-gd-text {
          background: linear-gradient(308deg, #536cd7 0%, ${({ theme }) => theme.color.text25} 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          ${fonts.body12}
          font-weight: 500;
          ${media.mobile} {
            ${fonts.p6}
            font-size: 11px;
            font-weight: 500;
          }
        }
        .tooltip-icon {
          width: 16px;
          height: 16px;
          * {
            fill: ${({ theme }) => theme.color.icon03};
          }
        }
      }
    }
  }
  .contents-wrap {
    display: contents;
    ${media.tabletMiddle} {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      width: 100%;
      padding-left: 32px;
    }
  }

  .contents {
    display: contents;
    ${media.tabletMiddle} {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      justify-content: space-between;
      padding: 11px 16px;
      gap: 12px;
      border-radius: 8px;
      border: 1px solid ${({ theme, isMax }) => (isMax ? theme.color.text07 : theme.color.border14)};
      background-color: ${({ theme }) => theme.color.backgroundOpacity2};
    }
    .my-staking,
    .apr-box {
      ${mixins.flexbox("row", "center", "flex-start")};
      align-self: stretch;
      min-height: 58px;
      padding: 11px 24px;
      border-radius: 8px;
      border: 1px solid ${({ theme, isMax }) => (isMax ? theme.color.text07 : theme.color.border14)};
      background-color: ${({ theme }) => theme.color.backgroundOpacity2};
      ${media.tablet} {
        padding: 11px 16px;
      }
      ${media.tabletMiddle} {
        min-height: auto;
        padding: 0;
        border: none;
        background-color: transparent;
      }
    }
    .my-staking {
      ${media.tabletMiddle} {
        flex: 1;
        min-width: 0;
      }
    }
    .apr-box {
      justify-content: flex-end;
      min-width: 176px;
      ${media.tablet} {
        min-width: 140px;
      }
      ${media.tabletMiddle} {
        min-width: 0;
      }
    }
    .total-staked {
      ${mixins.flexbox("column", "stretch", "center")};
      align-self: stretch;
      padding: 12px 24px;
      gap: 6px;
      border-radius: 8px;
      background-color: ${({ theme }) => theme.color.background26};
      ${media.tablet} {
        padding: 12px 16px;
      }
      ${media.tabletMiddle} {
        display: none;
      }
      .total-staked-info {
        ${mixins.flexbox("row", "flex-end", "space-between")};
        gap: 8px;
      }
      .total-staked-value {
        ${mixins.flexbox("row", "flex-end", "flex-start")};
        gap: 6px;
      }
      .total-staked-usd {
        ${fonts.body8}
        line-height: 22px;
        color: ${({ theme }) => theme.color.text02};
        ${media.tablet} {
          ${fonts.body10}
        }
      }
      .total-staked-ratio,
      .total-staked-count {
        ${fonts.body10}
        line-height: 20px;
        color: ${({ theme }) => theme.color.text05};
        white-space: nowrap;
        ${media.tablet} {
          ${fonts.body12}
        }
      }
      .total-staked-bar {
        width: 100%;
        height: 6px;
        border-radius: 3px;
        overflow: hidden;
        background-color: ${({ theme }) => theme.color.backgroundOpacity7};
      }
      .total-staked-bar-fill {
        height: 100%;
        border-radius: 3px;
        background-color: ${({ theme }) => theme.color.text05};
      }
    }
    .price {
      cursor: default;
      span {
        div {
          ${mixins.flexbox("row", "center", "flex-start")};
          flex-wrap: wrap;
          gap: 6px;
          color: ${({ theme }) => theme.color.text02};
          span {
            color: ${({ theme }) => theme.color.text02};
          }
          .price-usd {
            color: ${({ theme }) => theme.color.text07};
          }
          pointer-events: ${({ nonTotal }) => {
            return nonTotal ? "none" : "initial";
          }};
          &:hover {
            span {
              color: ${({ theme }) => theme.color.text07};
            }
          }
        }
        ${fonts.body3}
        ${media.tablet} {
          ${fonts.body7}
        }
        ${media.mobile} {
          ${fonts.p2}
          > div {
            gap: 4px;
          }
        }
      }
      .price-gd-text {
        background: linear-gradient(308deg, #536cd7 0%, ${({ theme }) => theme.color.text25} 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .badge {
        ${mixins.flexbox("row", "center", "center")};
        white-space: nowrap;
        margin-left: 10px;
        min-width: 58px;
        height: 34px;
        padding: 0px 6px;
        gap: 4px;
        border-radius: 4px;
        border: 1px solid ${({ theme }) => theme.color.border08};
        background-color: ${({ theme }) => theme.color.background08};
        ${fonts.body7}
        ${media.tablet} {
          ${fonts.body9}
        }
        ${media.tabletMiddle} {
          margin-left: 2px;
        }
        ${media.mobile} {
          margin-left: 0;
          min-width: auto;
          ${fonts.p4}
          height: 24px;
        }
        color: ${({ theme }) => theme.color.text12};
      }
    }
    .apr {
      ${mixins.flexbox("row", "center", "flex-end")};
      gap: 16px;
      &.small-gap {
        gap: 4px;
      }

      .apr-text,
      .apr-gd-text {
        cursor: default;
        white-space: nowrap;
        ${fonts.body5}
        ${media.tablet} {
          ${fonts.body8}
          font-size: 17px;
        }
        ${media.mobile} {
          ${fonts.p2}
        }
      }
      .apr-text {
        color: ${({ theme }) => theme.color.text03};
      }
      .apr-gd-text {
        background: linear-gradient(308deg, #536cd7 0%, ${({ theme }) => theme.color.text25} 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
`;

export const TooltipDivider = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.color.border01};
`;

export const PriceTooltipContentWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 8px;
  width: 300px;
  ${fonts.body12};
  ${media.mobile} {
    gap: 4px;
    ${fonts.p2};
  }
  .list {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    padding: 4px 0px;
    &.list-logo {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 5px;
    }
  }
  .title {
    color: ${({ theme }) => theme.color.text02};
  }
  .content {
    color: ${({ theme }) => theme.color.text02};
  }
  .label {
    color: ${({ theme }) => theme.color.text04};
  }
`;

export const ToolTipContentWrapper = styled.div`
  width: 268px;
  ${fonts.body12}
`;

import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

interface Props {
  nonTotal: boolean;
}

export const StakingContentCardWrapper = styled.div<Props>`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  ${media.tabletMiddle} {
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
    align-self: stretch;
  }
  .left {
    width: 350px;
    ${mixins.flexbox("row", "center", "flex-start")};
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
        stroke: var(--point-global-point, #233DBD);
      }
      .check-line-long {
        height: 456px;
        position: absolute;
        left: 9px;
        top: 20px;
        stroke-width: 1px;
        stroke: var(--point-global-point, #233DBD);
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
    flex: 1;
    ${media.tabletMiddle} {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      width: 100%;
      padding-left: 32px;
    }
  }

  .contents {
    width: 100%;
    max-width: 900px;
    margin-left: auto;
    ${mixins.flexbox("row", "center", "space-between")};
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border14};
    background-color: ${({ theme }) => theme.color.backgroundOpacity2};
    ${media.tabletMiddle} {
      padding: 11px 16px;
      gap: 12px;
    }
    .price {
      cursor: default;
      span {
        div {
          ${mixins.flexbox("row", "center", "flex-start")};
          gap: 6px;
          color: ${({ theme }) => theme.color.text02};
          span {
            color: ${({ theme }) => theme.color.text02};
            
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
          ${fonts.body10}
          > div {
            gap: 4px;
          }
        }
      }
      ${media.tablet} {
        align-items: center;
      }
      ${media.mobile} {
        gap: 8px;
      }
      .price-gd-text {
        background: linear-gradient(308deg, #536cd7 0%, ${({ theme }) => theme.color.text25} 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .badge {
        ${mixins.flexbox("row", "center", "center")};
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
          ${fonts.p4}
          height: 24px;
        }
        color: ${({ theme }) => theme.color.text12};
      }
    }
    .apr {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 16px;
      &.small-gap {
        gap: 4px;
      }
      ${media.mobile} {
        justify-content: flex-end;
        align-items: center;
        gap: 8px;
      }
     
      .apr-text {
        cursor: default;
        color: ${({ theme }) => theme.color.text03};
        ${fonts.body6}
        font-weight: 600;
        ${media.tablet} {
          ${fonts.body8}
          font-size: 17px;
          font-weight: 600;
        }
        ${media.mobile} {
          ${fonts.body12}
          font-weight: 600;
        }
      }
      .apr-gd-text {
        background: linear-gradient(308deg, #536cd7 0%, ${({ theme }) => theme.color.text25} 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        cursor: default;
        ${fonts.body6}
        font-weight: 600;
        ${media.tablet} {
          ${fonts.body8}
          font-size: 17px;
          font-weight: 600;
        }
        ${media.mobile} {
          ${fonts.body12}
          font-weight: 600;
        }
      }
      .coin-info {
        ${mixins.flexbox("row", "center", "flex-start")};
        img {
          width: 36px;
          height: 36px;
          ${media.tablet} {
            width: 24px;
            height: 24px;
          }
          ${media.mobile} {
            width: 20px;
            height: 20px;
          }
          &:not(:first-of-type) {
            margin-left: -6px;
          }
        }
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

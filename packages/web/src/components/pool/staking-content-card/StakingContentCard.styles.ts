import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const StakingContentCardWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  ${media.mobile} {
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
    align-self: stretch;
  }
  .left {
    ${mixins.flexbox("row", "center", "flex-start")};
    ${media.mobile} {
      justify-content: space-between;
      align-self: stretch;
    }
    .mobile-wrap {
      ${mixins.flexbox("row", "center", "flex-start")};
      height: 50px;
      gap: 24px;
      ${media.mobile} {
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
      background: var(--global-color-point, #0059ff);
      .check-line {
        height: 49px;
        position: absolute;
        right: 10px;
        bottom: -49px;
        stroke-width: 1px;
        stroke: var(--point-global-point, #0059ff);
      }
      .check-line-long {
        height: 456px;
        position: absolute;
        left: 10px;
        top: 20px;
        stroke-width: 1px;
        stroke: var(--point-global-point, #0059ff);
      }
    }
    .name-wrap {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      gap: 4px;
      ${media.mobile} {
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
          ${fonts.body12}
          ${media.tablet} {
            ${fonts.p4}
          }
          ${media.mobile} {
            ${fonts.p6}
          }
        }
        .content-gd-text {
          background: linear-gradient(308deg, #536cd7 0%, #a7b9f8 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          ${fonts.body12}
          ${media.tablet} {
            ${fonts.p4}
          }
          ${media.mobile} {
            ${fonts.p6}
          }
        }
        .tooltip-icon {
          width: 16px;
          height: 16px;
          cursor: pointer;
          * {
            fill: ${({ theme }) => theme.color.icon03};
          }
        }
      }
    }
  }
  .contents-wrap {
    ${media.mobile} {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      width: 100%;
      padding-left: 32px;
    }
  }

  .contents {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 800px;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border12};
    background-color: ${({ theme }) => theme.color.backgroundOpacity2};
    ${media.tablet} {
      width: 600px;
    }
    ${media.mobile} {
      width: 100%;
      padding: 12px 16px;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      gap: 12px;
    }
    .price {
      ${mixins.flexbox("row", "flex-start", "flex-start")};
      gap: 16px;
      span {
        color: ${({ theme }) => theme.color.text02};
        ${fonts.body3}
        ${media.tablet} {
          ${fonts.body7}
        }
        ${media.mobile} {
          ${fonts.body10}
        }
      }
      ${media.tablet} {
        align-items: center;
      }
      ${media.mobile} {
        gap: 8px;
      }
      .price-gd-text {
        background: linear-gradient(308deg, #536cd7 0%, #a7b9f8 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .badge {
        ${mixins.flexbox("row", "center", "center")};
        width: 58px;
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
        ${media.mobile} {
          ${fonts.p4}
          height: 24px;
        }
        color: ${({ theme }) => theme.color.text12};
      }
    }
    .apr {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 16px;
      ${media.mobile} {
        justify-content: flex-end;
        align-items: center;
        gap: 8px;
      }
      .apr-text {
        color: ${({ theme }) => theme.color.text03};
        ${fonts.body6}
        ${media.tablet} {
          ${fonts.body8}
        }
        ${media.mobile} {
          ${fonts.body12}
        }
      }
      .apr-gd-text {
        background: linear-gradient(308deg, #536cd7 0%, #a7b9f8 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        cursor: pointer;
        ${fonts.body6}
        ${media.tablet} {
          ${fonts.body8}
        }
        ${media.mobile} {
          ${fonts.body12}
        }
      }
      .coin-info {
        ${mixins.flexbox("row", "center", "flex-start")};
        .token-logo {
          width: 36px;
          height: 36px;
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

export const RewardsContent = styled.div`
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
    .coin-info {
      ${mixins.flexbox("row", "center", "flex-start")};
      width: 170px;
      gap: 8px;
      flex-shrink: 0;
      .token-logo {
        width: 20px;
        height: 20px;
      }
    }
  }
  .title {
    color: ${({ theme }) => theme.color.text04};
  }
  .content {
    color: ${({ theme }) => theme.color.text02};
  }
  p {
    ${fonts.p4};
    color: ${({ theme }) => theme.color.text04};
  }
`;

export const TooltipDivider = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.color.border01};
`;

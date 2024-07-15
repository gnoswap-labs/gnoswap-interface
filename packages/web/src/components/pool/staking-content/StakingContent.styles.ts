import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export interface StakingContentProps {
  isMobile: boolean;
}

export const StakingContentWrapper = styled.div<StakingContentProps>`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  padding: 24px 36px;
  gap: 24px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background11};
  ${media.tabletMiddle} {
    padding: 24px 12px;
  }
  .content-header {
    ${mixins.flexbox("row", "center", "flex-start")};
    width: 100%;
    gap: 5px;
    position: relative;
    color: ${({ theme }) => theme.color.text01};
    ${fonts.body6}
    ${media.tablet} {
      ${fonts.body8}
      font-size: 17px;
    }
    ${media.mobile} {
      ${fonts.body12}
      align-items: flex-start;
      flex-wrap: wrap;
    }
    .header-wrap {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 10px;
      ${media.mobile} {
        gap: 5px;
      }
      @media (max-width: 376px) {
        position: absolute;
        left: 0;
        bottom: ${({ isMobile }) => {
          return isMobile ? "-21px" : "calc(-100% - 5px)";
        }};
      }
    }
    .to-mobile {
      display: none;
    }
    @media (max-width: 376px) {
      .to-web {
        display: none;
      }
      .to-mobile {
        display: initial;
      }
    }
    .coin-info {
      ${mixins.flexbox("row", "flex-start", "flex-start")};
      .overlap-logo-wrapper {
        img {
          width: 36px;
          height: 36px;

          &:not(:first-of-type) {
            margin-left: -6px;
          }
        }
        ${media.tablet} {
          &:not(:first-of-type) {
            margin-left: -4px;
          }
          width: 24px;
          height: 24px;
          img {
            width: 24px;
            height: 24px;
          }
        }
        ${media.mobile} {
          width: 20px;
          height: 20px;
          img {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
    .apr {
      &:hover {
        .float-view-apr {
          visibility: hidden;
        }
      }
      ${fonts.h5}
      ${media.tablet} {
        ${fonts.body7}
      }
      ${media.mobile} {
        ${fonts.body9}
      }
      background: linear-gradient(
        308deg,
        #536cd7 0%,
        ${({ theme }) => theme.color.text25} 100%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .staking-wrap {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 8px;
    ${media.mobile} {
      gap: 16px;
    }
    @media (max-width: 376px) {
      margin-top: 24px;
    }
    span {
      color: ${({ theme }) => theme.color.text04};
      ${fonts.body8}
      ${media.tablet} {
        ${fonts.body10}
      }
      ${media.mobile} {
        ${fonts.p2}
      }
    }
  }
  .empty-content {
    max-width: 350px;
    min-width: 350px;
    flex: 1;
    ${media.tabletMiddle} {
      min-width: 32px;
    }
  }
  .button-wrap {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    .loading-button {
    }
    .loading-wrapper {
      ${mixins.flexbox("row", "center", "center")};
      width: 100%;
      max-width: 900px;
      background-color: ${({ theme }) => theme.color.backgroundOpacity2};
      border-radius: 8px;
      padding: 12px 16px;
      text-align: center;
    }
    .change-weight {
      max-width: 900px;
      cursor: default;
      border: 1px solid ${({ theme }) => theme.color.border14};
      span {
        font-weight: 400;
      }
    }
    .wrapper-staking-btn {
      width: 100%;
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 20px;
    }
    .receive-button {
      max-width: 900px;
      cursor: default;
      background: ${({ theme }) => theme.color.background21};
      border: 1px solid ${({ theme }) => theme.color.border16};
      span {
        color: ${({ theme }) => theme.color.text27};
      }
    }
  }
`;

export const CustomButtonStaking = styled.div`
  width: 140px;
  padding: 10px 16px;
  cursor: pointer;
  background: ${({ theme }) => theme.color.background04};
  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 8px;
  color: ${({ theme }) => theme.color.text20};
  ${fonts.p1}
  border-radius: 8px;
  svg {
    width: 16px;
    height: 16px;
    * {
      fill: ${({ theme }) => theme.color.icon13};
    }
  }
  ${media.mobile} {
    display: none;
  }
`;

export const AprViewRewardTooltipWrapper = styled.div`
  ${fonts.body12}
`;

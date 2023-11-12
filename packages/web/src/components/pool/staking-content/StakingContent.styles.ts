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
    ${fonts.body4}
    ${media.tablet} {
      ${fonts.body8}
    }
    ${media.mobile} {
      ${fonts.body10}
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
        left: ${({ isMobile }) => {
          return isMobile ? "0px" : "21px";
        }};
        bottom: ${({ isMobile }) => {
          return isMobile ? "-21px" : "0px";
        }};
      }
    }
    .coin-info {
      ${mixins.flexbox("row", "flex-start", "flex-start")};
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
    .apr {
      ${fonts.body3}
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
  .button-wrap {
    ${mixins.flexbox("row", "center", "flex-end")};
    width: 100%;
    .change-weight {
      cursor: default;
      border: 1px solid ${({ theme }) => theme.color.border14};;
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
      cursor: default;
      background: ${({ theme }) => theme.color.background21};
      border: 1px solid ${({ theme }) => theme.color.border16};
      span {
        color: #e0e8f4;
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

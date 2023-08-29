import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const MyLiquidityContentWrapper = styled.div`
  ${mixins.flexbox("row", "flex-start", "flex-start")};
  width: 100%;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  ${media.mobile} {
    flex-direction: column;
  }

  section {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    padding: 24px 36px;
    flex: 1 0 0;
    gap: 16px;
    &:not(:first-of-type) {
      border-left: 1px solid ${({ theme }) => theme.color.border02};
    }
    ${media.tablet} {
      padding: 24px;
    }
    ${media.mobile} {
      padding: 12px;
      gap: 8px;
      &:not(:first-of-type) {
        border-top: 1px solid ${({ theme }) => theme.color.border02};
      }
    }
  }

  h4 {
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text04};
  }

  .has-tooltip {
    cursor: pointer;
    transition: color 0.3s ease;
    &:hover {
      color: ${({ theme }) => theme.color.text07};
    }
  }

  span.content-value {
    ${fonts.body2};
    ${media.tablet} {
      ${fonts.body4}
    }
    ${media.mobile} {
      ${fonts.body8}
    }
    color: ${({ theme }) => theme.color.text02};
  }

  .claim-wrap {
    ${mixins.flexbox("row", "center", "space-between")}
    width: 100%;
  }
  .mobile-wrap {
    ${mixins.flexbox("row", "center", "space-between")}
    width: 100%;
  }
  .column-wrap {
    ${mixins.flexbox("column", "flex-start", "flex-start")}
    gap: 8px;
  }
`;

export const RewardsContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 8px;
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
    color: ${({ theme }) => theme.color.text08};
  }
  .content {
    color: var(--global-gray-gray-100, #e0e8f4);
  }
  p {
    ${fonts.p4};
    color: var(--global-brand-brand-400, #536cd7);
  }
`;

export const TooltipDivider = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.color.border04};
`;

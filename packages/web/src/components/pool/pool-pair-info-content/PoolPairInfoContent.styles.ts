import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const PoolPairInfoContentWrapper = styled.div`
  ${mixins.flexbox("row", "flex-start", "flex-start")};
  width: 100%;
  ${fonts.body12};
  border-radius: 8px;
  color: ${({ theme }) => theme.color.text04};
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background06};
  ${media.mobile} {
    flex-direction: column;
  }

  section {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    padding: 24px 36px;
    gap: 16px;
    flex: 1 0 0;
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

  .section-info {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 16px;
    @media (min-width: 769px) and (max-width: 800px) {
      gap: 8px;
    }
    .negative {
      color: ${({ theme }) => theme.color.red01};
    }
    .positive {
      color: ${({ theme }) => theme.color.green01};
    }
  }

  .apr-info {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 24px;
    .content-wrap {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 16px;
      .apr-value {
        color: ${({ theme }) => theme.color.text10};
      }
    }
  }

  .has-tooltip {
    cursor: pointer;
    transition: color 0.3s ease;
    &:hover {
      color: ${({ theme }) => theme.color.text07};
    }
  }

  strong {
    ${fonts.body2};
    ${media.tablet} {
      ${fonts.body4};
    }
    ${media.tablet} {
      ${fonts.body7};
    }
    color: ${({ theme }) => theme.color.text02};
  }
`;

export const TooltipContent = styled.div`
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
    color: ${({ theme }) => theme.color.text04};
  }
  .content {
    color: ${({ theme }) => theme.color.text02};
  }
`;

export const AprDivider = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 1px;
  height: 12px;
  background: ${({ theme }) => theme.color.background12};
`;

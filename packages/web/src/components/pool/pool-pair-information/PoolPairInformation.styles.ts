import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const PoolPairInformationWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  gap: 36px;
  ${media.tablet} {
    align-self: stretch;
  }
  ${media.mobile} {
    gap: 32px;
  }
  .token-status {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 16px;
    ${media.tablet} {
      align-self: stretch;
    }
  }
`;

export const BreadcrumbsWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  width: 100%;
  gap: 20px;
  align-self: stretch;
  ${media.mobile} {
    gap: 10px;
  }

  .page-name {
    ${fonts.h3};
    ${media.tablet} {
      ${fonts.h4};
    }
    ${media.mobile} {
      ${fonts.h5};
    }
    color: ${({ theme }) => theme.color.text02};
  }

  .location {
    ${mixins.flexbox("row", "center", "flex-start")};
    padding: 4px 8px;
    gap: 4px;
    border-radius: 2px;
    background-color: ${({ theme }) => theme.color.background11};
    ${fonts.body12};
    ${media.tablet} {
      ${fonts.p2};
    }
    color: ${({ theme }) => theme.color.text05};
    .token {
      color: ${({ theme }) => theme.color.text22};
    }
  }

  span {
    cursor: pointer;
    transition: color 0.3s ease;
    &:hover {
      color: ${({ theme }) => theme.color.text02};
    }
    &:last-of-type {
      color: ${({ theme }) => theme.color.text05};
    }
  }

  .step-icon {
    width: 16px;
    height: 16px;
    * {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }
`;

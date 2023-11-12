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
  position: relative;
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
    position: absolute;
    left: 98.8px;
    top: 12px;
    bottom: 6px;
    ${mixins.flexbox("row", "center", "flex-start")};
    padding: 4px 8px;
    gap: 4px;
    border-radius: 2px;
    background-color: ${({ theme }) => theme.color.background11};
    ${fonts.body12};
    ${media.tablet} {
      ${fonts.p2};
      left: 82px;
      top: 10px;
      bottom: 5px;
    }
    ${media.mobile} {
      ${fonts.p2};
      left: 62.5px;
      top: 3px;
      bottom: 2px;
    }
    color: ${({ theme }) => theme.color.text04};
    .token {
      color: ${({ theme }) => theme.color.text10};
    }
  }

  span {
    cursor: pointer;
    transition: color 0.3s ease;
    &:hover {
      color: ${({ theme }) => theme.color.text16};
    }
    &:last-of-type {
      color: ${({ theme }) => theme.color.text10};
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

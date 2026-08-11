import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { media } from "@styles/media";

export const TokenListHeaderwrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;

  .tokens-search {
    min-width: 300px;
  }
  ${media.mobile} {
    align-items: flex-start;
    flex-direction: column;
    gap: 24px;
    .tokens-search {
      min-width: 200px;
    }
  }
  .select-tab-token {
    ${media.mobile} {
      padding: 4px 24px;
    }
  }
  .right-section {
    ${mixins.flexbox("row", "center", "center")};
    flex-shrink: 0;
    gap: 36px;
  }

  .show-unverified-info {
    display: flex;
    flex: 0 0 16px;
    width: 16px;
    height: 16px;
    cursor: default;
    margin-right: -8px;

    ${media.mobile} {
      margin-right: 0;
    }

    svg {
      width: 16px;
      height: 16px;

      path {
        fill: ${({ theme }) => theme.color.icon08};
      }
    }
  }
`;

export const TokenTitleWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  width: 100%;
  gap: 36px;
  ${media.mobile} {
    justify-content: space-between;
    min-height: 24px;
  }
  h2 {
    ${fonts.h5};
    color: ${({ theme }) => theme.color.text02};
    ${media.mobile} {
      ${fonts.h6};
    }
  }

  .mobile-controls {
    ${mixins.flexbox("row", "center", "center")};
    gap: 8px;
  }
  .icon-wrap {
    height: 100%;
    .search-icon {
      width: 24px;
      height: 24px;
      margin-right: 13px;
      * {
        fill: ${({ theme }) => theme.color.icon08};
      }
    }
    .search-icon:hover {
      * {
        fill: ${({ theme }) => theme.color.icon02};
      }
    }
  }
`;

export const UnverifiedTokensTooltipContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 16px;
  width: 320px;
  color: ${({ theme }) => theme.color.text02};
  ${fonts.body12};

  p {
    margin: 0;
  }

  a {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 8px;
    color: ${({ theme }) => theme.color.text04};
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.color.text01};
    }

    svg {
      flex: 0 0 16px;

      path {
        fill: currentColor;
      }
    }
  }

  ${media.mobile} {
    width: min(320px, calc(100vw - 32px));
  }
`;

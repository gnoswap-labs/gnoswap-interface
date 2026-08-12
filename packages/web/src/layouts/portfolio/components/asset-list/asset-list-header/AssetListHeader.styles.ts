import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const AssetListHeaderWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  ${media.tabletMiddle} {
    align-items: flex-start;
    gap: 24px;
  }
  ${media.mobile} {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 24px;
    .select-tab-wrapper {
      button {
        padding: 4px 24px;
      }
    }
  }

  .title-container {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 36px;
    ${media.tabletMiddle} {
      gap: 24px;
      ${mixins.flexbox("column", "flex-start", "flex-start")};
    }
    ${media.mobile} {
      width: 100%;
      ${mixins.flexbox("row", "center", "space-between")};
    }
  }
  .mobile-title-container {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 12px;
  }
  .icon-wrap {
    ${mixins.flexbox("row", "center", "center")};
    cursor: pointer;
    margin-right: 13px;
  }
  .search-icon {
    width: 24px;
    height: 24px;
    * {
      fill: ${({ theme }) => theme.color.icon08};
    }
  }
  .search-icon:hover {
    * {
      fill: ${({ theme }) => theme.color.icon02};
    }
  }

  h2 {
    ${fonts.h5};
    color: ${({ theme }) => theme.color.text02};
    ${media.mobile} {
      ${fonts.h6};
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
  .assets-search {
    input {
      &::placeholder {
        color: ${({ theme }) => theme.color.text17};
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

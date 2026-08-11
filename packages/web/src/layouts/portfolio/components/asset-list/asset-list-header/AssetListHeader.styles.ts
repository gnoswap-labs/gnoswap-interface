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
  .filters-wrapper {
    position: relative;
  }
  .filters-trigger {
    ${mixins.flexbox("row", "center", "center")};
    gap: 8px;
    padding: 0;
    border: 0;
    background: transparent;
    color: ${({ theme }) => theme.color.text02};
    cursor: pointer;
    font: inherit;
    white-space: nowrap;
  }
  .filters-arrow {
    width: 16px;
    height: 16px;

    path {
      fill: ${({ theme }) => theme.color.icon08};
    }
  }
  .filters-dropdown {
    position: absolute;
    z-index: 10;
    top: calc(100% + 12px);
    right: 0;
    min-width: 240px;
    padding: 16px;
    border: 1px solid ${({ theme }) => theme.color.border01};
    border-radius: 8px;
    background: ${({ theme }) => theme.color.background01};
    box-shadow: 0 8px 24px rgb(0 0 0 / 20%);

    .switch-button + .switch-button {
      margin-top: 16px;
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

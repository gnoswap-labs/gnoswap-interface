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
  .assets-search {
    input {
      &::placeholder {
        color: ${({ theme }) => theme.color.text17};
      }
    }
  }
`;

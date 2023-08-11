import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const AssetListHeaderWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  ${media.mobile} {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
  }

  .title-container {
    ${mixins.flexbox("row", "center", "flex-start")};
    width: 651px;
    gap: 36px;
    ${media.mobile} {
      width: 328px;
      justify-content: space-between;
    }
  }
  .mobile-title-container {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 12px;
  }
  .icon-wrap {
    ${mixins.flexbox("row", "center", "center")};
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
  }
`;

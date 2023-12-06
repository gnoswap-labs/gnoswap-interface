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
`;

export const TokenTitleWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  width: 100%;
  gap: 36px;
  ${media.mobile} {
    justify-content: space-between;
    height: 24px;
  }
  h2 {
    ${fonts.h5};
    color: ${({ theme }) => theme.color.text02};
    ${media.mobile} {
      ${fonts.h6};
    }
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

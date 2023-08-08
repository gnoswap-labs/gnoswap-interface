import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { media } from "@styles/media";

export const TokenListHeaderwrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  ${media.mobile} {
    align-items: flex-start;
    flex-direction: column;
    gap: 24px;
  }
`;

export const TokenTitleWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  max-width: 651px;
  width: 100%;
  gap: 36px;
  .icon-wrap {
    ${mixins.flexbox("row", "center", "center")};
    padding: 8px 13px;
  }
  ${media.mobile} {
    max-width: 328px;
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
`;

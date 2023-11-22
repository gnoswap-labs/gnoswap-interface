import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const PoolHeaderWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  align-self: stretch;
  ${media.mobile} {
    flex-direction: column;
    gap: 24px;
    align-items: flex-start;
  }

  .title-container {
    ${mixins.flexbox("row", "center", "space-between")};
    gap: 36px;
    ${media.mobile} {
      width: 100%;
    }
  }

  h2 {
    ${fonts.h5};
    ${media.mobile} {
      ${fonts.h6}
    }
    color: ${({ theme }) => theme.color.text02};
  }

  .icon-wrap {
    ${mixins.flexbox("row", "center", "center")};
    padding: 0 13px;
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

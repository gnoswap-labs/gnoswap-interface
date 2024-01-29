import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const HeaderWrapper = styled.div`
  ${mixins.flexbox("row", "flex-end", "space-between")};
  width: 100%;
  ${fonts.h5};
  color: ${({ theme }) => theme.color.text02};

  .header {
    ${mixins.flexbox("row", "center", "flex-start")};
    .hide-close-position {
      display: none;
    }
    ${media.mobile} {
      width: 100%;
      .hide-close-position {
        display: flex;
      }
      ${mixins.flexbox("row", "center", "space-between")};
    }
  }
  ${media.mobile} {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    justify-content: flex-start;
    ${fonts.h6};
  }

  .button-wrap {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 8px;
    .hide-close-position {
      ${mixins.flexbox("row", "center", "cencter")};
      margin-right: 28px;
      ${media.tablet} {
        margin-right: 16px;
      }
      ${media.mobile} {
        display: none;
      }
    }
    ${media.mobile} {
      width: 100%;
      button {
        width: 50%;
      }
      
    }
    .full-width {
      width: 100%;
    }
  }
`;

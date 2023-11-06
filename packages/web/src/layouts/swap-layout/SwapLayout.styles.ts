import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media, ContainerWidth } from "@styles/media";
import mixins from "@styles/mixins";

export const SwapLayoutWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  background-color: ${({ theme }) => theme.color.background01};

  .swap-section {
    ${mixins.flexbox("column", "center", "flex-start")};
    max-width: ${ContainerWidth.WEB_SECTION_CONTAINER};
    width: 100%;
    padding: 100px 0px;
    ${media.tablet} {
      max-width: ${ContainerWidth.TABLET_CONTAINER};
      padding: 60px 0px;
    }
    ${media.mobile} {
      max-width: ${ContainerWidth.MOBILE_CONTAINER};
      width: 100%;
      padding: 0px 16px;
    }
  }
  .swap-container {
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    max-width: ${ContainerWidth.WEB_CONTAINER};
    width: 100%;
    padding: 0px 40px;
    ${media.tablet} {
      align-self: stretch;
    }
    ${media.mobile} {
      padding: 24px 0px 48px 0px;
      flex-direction: column;
      gap: 24px;
    }
  }

  .right-container {
    ${mixins.flexbox("row", "flex-start", "flex-end")};
    width: 100%;
    gap: 16px;
    margin-top: 8px;
    ${media.tablet} {
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }
    ${media.mobile} {
      gap: 8px;
      margin-top: 0px;
      align-items: center;
    }
  }

  .page-name {
    ${fonts.h3};
    ${media.tablet} {
      ${fonts.h4};
    }
    ${media.mobile} {
      ${fonts.h5};
      ${mixins.flexbox("row", "flex-start", "flex-start")};
      max-width: 500px;
      width: 100%;
      align-self: center;
    }
    color: ${({ theme }) => theme.color.text02};
  }

  .swap {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    max-width: 500px;
    width: 100%;
    gap: 16px;
    ${media.mobile} {
      gap: 8px;
      align-items: center;
    }
  }

  .liquidity {
    max-width: 414px;
    width: 100%;
    ${media.tablet} {
      max-width: 500px;
    }
  }
`;

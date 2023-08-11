import mixins from "@styles/mixins";
import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import { media } from "@styles/media";

export const WalletLayoutWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  background-color: ${({ theme }) => theme.color.background01};

  .wallet-summary-section {
    ${mixins.flexbox("column", "center", "flex-start")};
    max-width: 1920px;
    width: 100%;
    padding: 100px 0px;
    ${media.tablet} {
      max-width: 1180px;
      padding: 60px 0px;
    }
    ${media.mobile} {
      max-width: 360px;
      padding: 0px;
    }
  }

  .summary-container {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    max-width: 1440px;
    width: 100%;
    padding: 0px 40px;
    gap: 36px;
    ${media.tablet} {
      gap: 24px;
    }
    ${media.mobile} {
      padding: 24px 16px 48px 16px;
    }
  }
  .assets,
  .positions,
  .balance-container {
    width: 100%;
  }

  .wallet-detail-section {
    ${mixins.flexbox("column", "center", "flex-start")};
    max-width: 1920px;
    width: 100%;
    position: relative;
    padding: 100px 0px;
    ${media.tablet} {
      max-width: 1180px;
      padding: 60px 0px;
    }
    ${media.mobile} {
      max-width: 360px;
      padding: 48px 0px;
    }
  }

  .detail-container {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    max-width: 1440px;
    width: 100%;
    padding: 0px 40px;
    gap: 24px;
    ${media.mobile} {
      padding: 0px 16px;
    }
  }

  .title-wrapper {
    ${fonts.h3};
    ${media.tablet} {
      ${fonts.h4};
    }
    ${media.mobile} {
      ${fonts.h5};
    }
    color: ${({ theme }) => theme.color.text02};
  }

  .background-wrapper {
    ${mixins.flexbox("column", "center", "flex-start")};
    position: relative;
    width: 100%;
    min-height: 400px;

    .background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 400px;
      background: linear-gradient(
        180deg,
        ${({ theme }) => theme.color.backgroundGradient2} 0%,
        ${({ theme }) => theme.color.backgroundGradient3} 100%
      );
    }
  }
`;

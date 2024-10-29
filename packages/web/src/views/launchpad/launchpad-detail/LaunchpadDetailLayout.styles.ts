import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const LaunchpadDetailLayoutWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  background-color: ${({ theme }) => theme.color.background01};
  main {
    ${mixins.flexbox("column", "center", "center")}
    gap: 36px;
    width: 100%;
    max-width: 1440px;
    padding: 100px 40px;
    ${media.tablet} {
      gap: 24px;
      padding: 60px 40px;
    }
    ${media.mobile} {
      padding: 24px 16px;
    }
  }
  .header-section {
    ${mixins.flexbox("column", "center", "center")}
    width: 100%;
    flex-grow: 1;
    margin: 0 auto;
    ${media.mobile} {
      ${mixins.flexbox("column", "center", "center")}
    }
  }
  .header {
    ${mixins.flexbox("row", "center", "flex-start")};
    width: 100%;
    gap: 20px;
    .title {
      color: ${({ theme }) => theme.color.text02};
      font-size: 36px;
      font-weight: 600;
      ${media.tablet} {
        font-size: clamp(2rem, 1.6014rem + 0.5405vw, 2.25rem);
      }
      ${media.mobile} {
        font-size: clamp(1.5rem, 1.2805rem + 0.9756vw, 2rem);
      }
    }
  }

  .contents-section {
    width: 100%;
    ${mixins.flexbox("column", "center", "flex-start")};
    gap: 16px;
  }

  .main-container {
    ${mixins.flexbox("row", "flex-start", "space-between")};

    gap: 16px;
    width: 100%;
    ${media.tablet} {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
    }
  }
  .main-section {
    ${mixins.flexbox("column", "center", "space-between")};
    gap: 16px;
    flex: 1;
    max-width: 914px;
    min-width: 722px;
    ${media.tablet} {
      max-width: none;
      width: 100%;
      min-width: auto;
    }
    .pool-list {
      width: 100%;
    }
    .project-summary {
      width: 100%;
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.color.border02};
    }
    .about-project {
      width: 100%;
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.color.border02};
      padding: 24px;
    }
  }

  .right-section {
    ${mixins.flexbox("column", "center", "space-between")};
    gap: 16px;
    max-width: 430px;
    width: 100%;
    ${media.tablet} {
      max-width: 100%;
      min-width: auto;
      width: 100%;
    }
    .participate {
      width: 100%;
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.color.border02};
      background: ${({ theme }) => theme.color.background06};
      padding: 24px;
    }
    .my-participation {
      width: 100%;
    }
    .click-here {
      ${mixins.flexbox("row", "cetner", "center")};
      gap: 4px;
      width: 100%;
    }
  }
`;

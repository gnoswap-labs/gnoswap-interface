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
  }
  .header-section {
    ${mixins.flexbox("column", "center", "center")}
    width: 100%;
    flex-grow: 1;
    margin: 0 auto;
    ${media.tablet} {
      /* padding: 118px 40px; */
    }
    ${media.mobile} {
      padding: 48px 0;
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
    }
  }

  .contents-section {
    width: 100%;
    ${mixins.flexbox("column", "center", "flex-start")};
    gap: 16px;
  }
  .contents-header {
    width: 100%;
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 8px;
    .symbol-icon {
      width: 36px;
      height: 36px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .project-name {
      color: ${({ theme }) => theme.color.text02};
      font-size: 24px;
      font-weight: 600;
    }
    .project-status {
      ${mixins.flexbox("row", "center", "center")}
      gap: 4px;
      color: ${({ theme }) => theme.color.text05};
      font-size: 12px;
      font-weight: 500;
      padding: 4px 12px;
      border-radius: 36px;
      background: ${({ theme }) => theme.color.backgroundOpacity7};
    }
  }
  .main-container {
    ${mixins.flexbox("row", "flex-start", "space-between")};

    gap: 16px;
    width: 100%;
    @media (max-width: 930px) {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
    }
  }
  .main-section {
    ${mixins.flexbox("column", "center", "space-between")};
    gap: 16px;
    flex: 1;
    max-width: 914px;
    min-width: 722px;
    @media (max-width: 1180px) {
      max-width: 734px;
      min-width: 568px;
    }
    @media (max-width: 930px) {
      max-width: 100%;
      min-width: auto;
      width: 100%;
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
    @media (max-width: 1180px) {
      max-width: 360px;
      min-width: 276px;
    }
    @media (max-width: 930px) {
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
      box-shadow: 10px 14px 60px 0px rgba(0, 0, 0, 0.4);
    }
    .my-participation {
      width: 100%;
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.color.border02};
      background: ${({ theme }) => theme.color.background06};
      padding: 24px;
      box-shadow: 10px 14px 60px 0px rgba(0, 0, 0, 0.4);
    }
  }
`;

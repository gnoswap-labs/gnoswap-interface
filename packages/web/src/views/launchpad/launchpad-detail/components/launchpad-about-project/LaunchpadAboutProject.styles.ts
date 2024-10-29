import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const LaunchpadAboutProjectWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")}
  gap: 16px;
  width: 100%;
  ${media.mobile} {
    gap: 8px;
  }
  .main-contents {
    ${mixins.flexbox("column", "center", "flex-start")}
    gap: 24px;
    width: 100%;
    ${media.mobile} {
      gap: 16px;
    }
  }
  .header {
    color: ${({ theme }) => theme.color.text02};
    font-size: 18px;
    font-weight: 500;
  }

  .contents {
    width: 100%;
    ${mixins.flexbox("column", "flex-start", "flex-start")}
    gap: 16px;
    ${media.mobile} {
      gap: 8px;
    }
    .description {
      max-width: 768px;
      color: ${({ theme }) => theme.color.text04};
      font-size: 14px;
      font-weight: 400;
    }
    .show-more {
      ${mixins.flexbox("row", "flex-start", "center")}
      color: ${({ theme }) => theme.color.text04};
      font-size: 14px;
      font-weight: 500;
    }
  }

  .link-wrapper {
    ${mixins.flexbox("column", "flex-start", "center")}
    gap: 12px;
    width: 100%;
    .key {
      color: ${({ theme }) => theme.color.text02};
      font-size: 14px;
      font-weight: 500;
    }
    .links {
      ${mixins.flexbox("row", "center", "flex-start")}
      gap: 4px;
      width: 100%;
    }
  }
`;

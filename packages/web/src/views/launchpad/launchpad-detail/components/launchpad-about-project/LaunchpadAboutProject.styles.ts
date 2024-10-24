import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const LaunchpadAboutProjectWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")}
  gap: 16px;
  width: 100%;
  .main-contents {
    ${mixins.flexbox("column", "center", "flex-start")}
    gap: 24px;
    width: 100%;
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

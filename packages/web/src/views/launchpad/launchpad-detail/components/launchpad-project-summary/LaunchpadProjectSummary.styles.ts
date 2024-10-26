import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const LaunchpadProjectSummaryWrapper = styled.div`
  ${mixins.flexbox("row", "center", "center")}
  .card {
    ${mixins.flexbox("column", "flex-start", "center")}
    gap: 16px;
    width: 100%;
    padding: 16px;
    .key {
      ${mixins.flexbox("row", "flex-start", "center")}
      gap: 4px;
      color: ${({ theme }) => theme.color.text04};
      font-size: 14px;
      font-weight: 400;
      * {
        fill: ${({ theme }) =>
          theme.themeKey === "dark" ? "#596782" : "#90A2C0"};
      }
    }
    .value {
      color: ${({ theme }) => theme.color.text02};
      font-size: 18px;
      font-weight: 400;
    }
  }
  .border {
    border-right: 1px solid ${({ theme }) => theme.color.border02};
  }
`;

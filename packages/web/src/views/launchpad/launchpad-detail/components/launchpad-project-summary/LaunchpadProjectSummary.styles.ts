import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const LaunchpadProjectSummaryWrapper = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  width: 100%;
  ${media.tablet} {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0;
  }
  ${media.mobile} {
    ${mixins.flexbox("column", "center", "center")}
  }
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
    ${media.tablet} {
      &:nth-of-type(1),
      &:nth-of-type(2) {
        border-bottom: 1px solid ${({ theme }) => theme.color.border02};
      }
      &:nth-of-type(1),
      &:nth-of-type(3) {
        border-right: 1px solid ${({ theme }) => theme.color.border02};
      }
    }
    ${media.mobile} {
      ${media.mobile} {
        &:nth-of-type(1),
        &:nth-of-type(2),
        &:nth-of-type(3),
        &:nth-of-type(4) {
          border-right: none;
          border-bottom: none;
        }

        &:not(:last-child) {
          border-bottom: 1px solid ${({ theme }) => theme.color.border02};
      }
    }
  }
  .border {
    border-right: 1px solid ${({ theme }) => theme.color.border02};
    ${media.tablet} {
      border-right: none;
      border-bottom: none;
    }
    ${media.mobile} {
      border-right: none;
      border-bottom: none;
    }
  }
`;

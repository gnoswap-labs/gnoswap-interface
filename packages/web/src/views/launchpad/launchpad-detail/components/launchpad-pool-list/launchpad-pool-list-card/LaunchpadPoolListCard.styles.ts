import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const CardWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")}
  gap: 16px;
  width: 100%;
  background: ${({ theme }) => theme.color.background03};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  padding: 16px;
  ${media.tablet} {
    min-width: 260px;
  }
  ${media.mobile} {
    min-width: 280px;
  }
  &.ongoing {
    cursor: pointer;
    &:hover {
      background: ${({ theme }) =>
        theme.themeKey === "dark"
          ? theme.color.background05Hover
          : theme.color.hover01};
    }
    &.active {
      background: ${({ theme }) =>
        theme.themeKey === "dark"
          ? theme.color.background05Hover
          : theme.color.hover01};
      border: 1px solid var(--border-gradient, #869dff);
    }
  }

  .card-header {
    ${mixins.flexbox("row", "center", "space-between")}
    width: 100%;
    .card-header-title {
      ${mixins.flexbox("row", "center", "flex-start")}
      gap: 8px;
      width: 100%;
      .flex-section {
        ${mixins.flexbox("row", "center", "center")};
        gap: 4px;
      }
    }
    .title {
      color: ${({ theme }) => theme.color.text02};
      font-size: 22px;
      font-weight: 500;
      white-space: nowrap;
    }
    .chip {
      color: ${({ theme }) =>
        theme.themeKey === "dark" ? theme.color.text06 : theme.color.text04};
      background: ${({ theme }) =>
        theme.themeKey === "dark"
          ? theme.color.background03
          : theme.color.background11};
      border-radius: 4px;
      border: 1px solid
        ${({ theme }) =>
          theme.themeKey === "dark"
            ? theme.color.border03
            : theme.color.border01};
      padding: 4px 6px;
      font-size: 12px;
      font-weight: 400;
    }
  }

  .card-description {
    /* color: ${({ theme }) => theme.color.text03}; */
    color: ${({ theme }) =>
      theme.themeKey === "dark" ? "#596782" : theme.color.text03};
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    line-height: 18.2px;
    ${media.tablet} {
      font-size: clamp(0.8125rem, 0.7128rem + 0.1351vw, 0.875rem);
    }
  }

  .data {
    ${mixins.flexbox("column", "flex-start", "center")};
    gap: 8px;
    width: 100%;
    font-size: clamp(0.875rem, 0.6757rem + 0.2703vw, 1rem);
    font-weight: 500;
    ${media.tablet} {
      font-size: clamp(0.875rem, 0.6757rem + 0.2703vw, 1rem);
    }
    .key {
      color: ${({ theme }) => theme.color.text04};
    }
    .value {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 4px;
      width: 100%;
      color: ${({ theme }) => theme.color.text03};
      &.ended {
        color: ${({ theme }) =>
          theme.themeKey === "dark" ? theme.color.text05 : "#C3D2EA"};
      }
    }
  }

  .token-image {
    width: 24px;
    height: 24px;
  }
`;

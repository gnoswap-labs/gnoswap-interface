import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const ActiveProjectCardDataWrapper = styled.div`
  ${mixins.flexbox("row", "flex-start", "space-between")};
  gap: 2px;
  width: 100%;
  ${media.mobile} {
    ${mixins.flexbox("column", "flex-start", "space-between")};
    gap: 16px;
    width: 100%;
  }
  .data-box {
    ${mixins.flexbox("column", "flex-start", "center")};
    gap: 8px;
    width: 100%;
    color: ${({ theme }) => theme.color.text02};
    ${media.mobile} {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 4px;
    }
  }
  .data-title {
    font-size: 14px;
    font-weight: 400;
    white-space: nowrap;
  }
  .flex-box {
    ${mixins.flexbox("column", "flex-start", "center")};
    gap: 8px;
    width: 100%;
    ${media.mobile} {
      ${mixins.flexbox("row-reverse", "space-between", "space-between")};
      width: calc(100% -60px);
    }
  }
  .data {
    ${mixins.flexbox("row", "center", "center")};
    font-size: 18px;
    font-weight: 500;
    ${media.mobile} {
      ${mixins.flexbox("row", "center", "flex-end")};
      font-size: 14px;
      text-align: end;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .badge {
    font-size: 12px;
    font-weight: 400;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid
      ${({ theme }) =>
        theme.themeKey === "dark"
          ? theme.color.border03
          : theme.color.border01};
    background: ${({ theme }) =>
      theme.themeKey === "dark"
        ? "rgba(20, 26, 41, 0.50)"
        : theme.color.background11};
  }
`;

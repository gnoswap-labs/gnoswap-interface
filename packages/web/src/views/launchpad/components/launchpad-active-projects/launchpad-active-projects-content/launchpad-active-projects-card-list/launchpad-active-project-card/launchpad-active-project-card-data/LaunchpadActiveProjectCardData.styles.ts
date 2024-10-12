import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const ActiveProjectCardDataWrapper = styled.div`
  ${mixins.flexbox("row", "flex-start", "space-between")};
  gap: 2px;
  width: 100%;
  .data-box {
    ${mixins.flexbox("column", "flex-start", "center")};
    gap: 8px;
    width: 100%;
    color: ${({ theme }) => theme.color.text02};
  }
  .data-title {
    font-size: 14px;
    font-weight: 400;
  }
  .data {
    ${mixins.flexbox("row", "center", "center")};
    font-size: 18px;
    font-weight: 500;
  }
  .badge {
    font-size: 12px;
    font-weight: 400;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid var(--Dark-Border-Gray400-Border-3, #596782);
    background: var(
      --global-opacity-gray-600-opacity-05,
      rgba(20, 26, 41, 0.5)
    );
  }
`;

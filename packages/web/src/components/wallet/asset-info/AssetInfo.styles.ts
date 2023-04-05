import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const AssetInfoWrapper = styled.div`
  transition: background-color 0.3s ease;
  cursor: pointer;
  min-width: 100%;
  height: 68px;
  ${mixins.flexbox("row", "center", "flex-start")};
  ${({ theme }) => theme.fonts.body11};
  &:not(:first-of-type) {
    border-top: 1px solid ${({ theme }) => theme.colors.gray50};
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }

  .logo {
    width: 20px;
    height: 20px;
  }

  .name {
    margin: 0px 4px;
  }

  .symbol {
    ${({ theme }) => theme.fonts.body12};
    color: ${({ theme }) => theme.colors.gray40};
  }
`;

export const TableColumn = styled.div<{ tdWidth: number }>`
  width: ${({ tdWidth }) => `${tdWidth}px`};
  min-width: ${({ tdWidth }) => `${tdWidth}px`};
  padding: 16px;
  height: 100%;
  ${mixins.flexbox("row", "center", "flex-end")};
  &.left {
    flex-shrink: 0;
    justify-content: flex-start;
  }
`;

export const LoadButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  color: ${({ theme }) => theme.colors.gray40};
  gap: 4px;
  svg {
    width: 16px;
    height: 16px;
    * {
      fill: ${({ theme }) => theme.colors.gray40};
    }
  }
`;

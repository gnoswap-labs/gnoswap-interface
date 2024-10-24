import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const UnconnectedWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")}
  gap: 8px;
  width: 100%;
  padding: 16px;
  background-color: ${({ theme }) =>
    theme.themeKey === "dark" ? theme.color.background09 : ""};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  .unconnected-icon {
    width: 44px;
    height: 44px;
    * {
      fill: ${({ theme }) => theme.color.text04};
    }
  }
  .unconnected-text {
    color: ${({ theme }) => theme.color.text04};
    text-align: center;
    line-height: 20.8px;
  }
`;

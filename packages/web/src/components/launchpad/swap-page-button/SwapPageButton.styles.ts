import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const SwapPageButtonWrapper = styled.button`
  ${mixins.flexbox("row", "center", "center")}
  gap: 4px;
  color: ${({ theme }) => theme.color.text04};
  font-weight: 400;
  cursor: pointer;
  .svg {
    width: 16px;
    height: 16px;
    font-size: 0;
    * {
      fill: ${({ theme }) =>
        theme.themeKey === "dark" ? "#596782" : "#90A2C0"};
    }
  }

  &,
  svg * {
    transition: all 0.3s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.color.text03};
    svg * {
      fill: ${({ theme }) => theme.color.icon07};
    }
  }
`;

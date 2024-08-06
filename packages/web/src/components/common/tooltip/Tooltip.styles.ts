import styled from "@emotion/styled";
import { media } from "@styles/media";

interface ContentToolTipProps {
  themeKey: "dark" | "light";
}
export const BaseTooltipWrapper = styled.div`
  cursor: default;
`;

export const Content = styled.div<ContentToolTipProps>`
  color: ${({ theme }) => theme.color.text02};
  background-color: ${({ theme }) => theme.color.background02};
  padding: 16px;
  border-radius: 8px;
  box-sizing: border-box;
  width: max-content;
  max-width: calc(100vw - 10px);
  box-shadow: ${({ themeKey }) => {
    return themeKey === "dark"
      ? "10px 14px 60px 0px rgba(0, 0, 0, 0.4)"
      : "10px 14px 48px 0px rgba(0, 0, 0, 0.12)";
  }};
  ${media.mobile} {
    padding: 12px;
    gap: 4px;
  }

  &.use-scroll {
    max-height: calc(min(80vh, 480px));
    overflow-y: scroll;
    padding-right: 8px;

    @property --scroll-color {
      syntax: "<color>";
      inherits: true;
      initial-value: ${({ theme }) => theme.color.background12};
    }

    transition: --scroll-color 0.3s;

    ::-webkit-scrollbar {
      width: 12px;
      display: block;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
      padding: 0;
      display: none;
    }

    ::-webkit-scrollbar-thumb {
      background-color: var(--scroll-color);
      border-radius: 8px;
      border: 4px solid ${({ theme }) => theme.color.background12};
    }

    &.show-scroll {
      --scroll-color: #82878ebf;
    }
  }
`;

export const FloatContent = styled.div`
  color: ${({ theme }) => theme.color.text02};
  background-color: ${({ theme }) => theme.color.background02};
  padding: 16px;
  border-radius: 8px;
  box-sizing: border-box;
  width: max-content;
  max-width: calc(100vw - 10px);
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2);
  ${media.mobile} {
    padding: 12px;
    max-width: max-content;
    gap: 4px;
  }
`;

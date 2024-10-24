import mixins from "@styles/mixins";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const Appear = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

export const DepositConditionsTooltipWrapper = styled.div`
  animation: ${Appear} 0.1s ease-out forwards;
`;

export const FloatingContentWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-center")}
  width: 100%;
  gap: 8px;
  color: var(--Dark-Palette-Orange, #ff9f0a);
  font-size: 14px;
  font-weight: 400;

  .contents-header {
    ${mixins.flexbox("row", "center", "flex-start")}
    gap: 8px;
    width: 100%;
  }

  .list-wrapper {
    ${mixins.flexbox("column", "flex-start", "center")};
    gap: 8px;
    padding: 0 16px;
    line-height: 130%;
    li {
      list-style: disc outside;
    }
  }
`;

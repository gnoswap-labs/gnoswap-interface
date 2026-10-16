import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";

export const CandleTooltip = styled.div`
  ${fonts.body12}
  position: fixed;
  z-index: 1000;
  pointer-events: none;
  box-sizing: border-box;
  width: max-content;
  min-width: min(250px, calc(100vw - 16px));
  max-width: calc(100vw - 16px);
  max-height: calc(100dvh - 16px);
  overflow: hidden;
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.color.border03};
  border-radius: 12px;
  background: ${({ theme }) => theme.color.background05};
  color: ${({ theme }) => theme.color.text04};
  box-shadow: 0 12px 28px rgb(0 0 0 / 24%);
  font-variant-numeric: tabular-nums;

  > div {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    & + div {
      margin-top: 2px;
    }
  }
  .quote-volume {
    justify-content: flex-end;
  }
  strong {
    min-width: 0;
    color: ${({ theme }) => theme.color.text02};
    font-weight: 500;
    text-align: right;
    overflow-wrap: anywhere;
  }
`;

import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";

export const CandleTooltip = styled.div`
  ${fonts.body12}
  position: absolute;
  z-index: 4;
  pointer-events: none;
  min-width: 250px;
  max-width: calc(100% - 16px);
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.color.border14};
  border-radius: 12px;
  background: ${({ theme }) => theme.color.background05};
  color: ${({ theme }) => theme.color.text04};
  box-shadow: 0 12px 28px rgb(0 0 0 / 24%);
  font-variant-numeric: tabular-nums;

  > div {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: 2px;
  }
  .quote-volume {
    justify-content: flex-end;
  }
  strong {
    color: ${({ theme }) => theme.color.text02};
    font-weight: 500;
    text-align: right;
    overflow-wrap: anywhere;
  }
`;

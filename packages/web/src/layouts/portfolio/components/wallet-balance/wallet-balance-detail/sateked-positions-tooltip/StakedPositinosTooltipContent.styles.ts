import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const StakedPostionsTooltipContentWrapper = styled.div`
  width: min(300px, calc(100vw - 42px));
  max-height: min(65vh, 400px);
  overflow-y: auto;
  overscroll-behavior: contain;
  ${mixins.flexbox("column", "flex-start", "flex-start")}
  gap: 16px;
  & > * {
    flex-shrink: 0;
  }
`;

export const TokenItem = styled.div`
  width: 100%;
  ${mixins.flexbox("column", "flex-start", "center")}
  gap: 16px;
`;

export const ItemHeader = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")}
  gap: 5px;
`;

export const ItemHeaderSymbol = styled.div`
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text01};
`;

export const DataGrid = styled.div`
  width: 100%;
  ${mixins.flexbox("column", "flex-start", "center")}
  gap: 16px;
`;

export const DataGridItem = styled.div`
  width: 100%;
  gap: 16px;
  ${mixins.flexbox("row", "center", "space-between")}
`;

export const ItemDataGridLabel = styled.div`
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text04};
`;

export const ItemDataGridValue = styled.div`
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text01};
  gap: 2p;
`;

export const ItemDataGridValueBlock = styled.span`
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text10};
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  border-top: 1px solid ${({ theme }) => theme.color.border01};
`;

export const Status = styled.div`
  width: 100%;
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text04};
`;

export const RetryButton = styled.button`
  display: block;
  min-height: 44px;
  margin-top: 8px;
  padding: 8px 16px;
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text01};
  background: ${({ theme }) => theme.color.background02};
  border: 1px solid ${({ theme }) => theme.color.border01};
  border-radius: 8px;
  cursor: pointer;
`;

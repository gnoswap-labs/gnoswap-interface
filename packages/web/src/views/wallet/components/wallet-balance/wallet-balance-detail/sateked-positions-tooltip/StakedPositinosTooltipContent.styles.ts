import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const StakedPostionsTooltipContentWrapper = styled.div`
  min-width: 330px;
  ${mixins.flexbox("column", "center", "center")}
  gap: 16px;
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

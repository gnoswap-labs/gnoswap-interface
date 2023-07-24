import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const DashboardOverviewWrapper = styled.div`
  ${mixins.flexbox("row", "flex-start", "space-between")};
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  gap: 8px;
`;

export const OverviewDivider = styled.div`
  width: 1px;
  height: 290px;
  border: 1px solid ${({ theme }) => theme.color.border02};
`;

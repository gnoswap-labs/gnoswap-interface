import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const DashboardOverviewWrapper = styled.div`
  ${mixins.flexbox("row", "flex-start", "center")};
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  gap: 8px;
  ${media.mobile} {
    gap: 0px;
    border: 0px;
    flex-direction: column;
    justify-content: flex-start;
  }
`;

export const OverviewDivider = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 1px;
  height: auto;
  align-self: stretch;
  background: ${({ theme }) => theme.color.border02};
`;

export const MobileDivider = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  height: 1px;
  align-self: stretch;
  background: ${({ theme }) => theme.color.border02};
`;

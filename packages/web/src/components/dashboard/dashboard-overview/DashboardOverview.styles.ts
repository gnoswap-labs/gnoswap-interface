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
    max-width: 328px;
    border: 0px;
    flex-direction: column;
    justify-content: flex-start;
  }
`;

export const OverviewDivider = styled.div`
  width: 1px;
  height: 290px;
  background: ${({ theme }) => theme.color.border02};
`;

export const MobileDivider = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  .divider {
    width: 328px;
    height: 1px;
    background: ${({ theme }) => theme.color.border02};
  }
`;

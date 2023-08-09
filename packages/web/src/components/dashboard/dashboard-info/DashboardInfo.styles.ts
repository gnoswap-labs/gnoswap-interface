import styled from "@emotion/styled";
import { media } from "@styles/media";

import mixins from "@styles/mixins";

export const DashboardInfoWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  max-width: 1360px;
  width: 100%;
  padding: 24px;
  gap: 24px;
  background-color: ${({ theme }) => theme.color.background03};
  border: 1px solid ${({ theme }) => theme.color.border01};
  border-radius: 10px;
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.08);
  ${media.tablet} {
    max-width: 1100px;
  }
  ${media.mobile} {
    max-width: 328px;
    padding: 0px;
    gap: 0px;
  }
`;

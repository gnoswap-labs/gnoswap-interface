import styled from "@emotion/styled";
import { ContainerWidth, media } from "@styles/media";

import mixins from "@styles/mixins";

export const DashboardInfoWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  max-width: ${ContainerWidth.WEB_CONTAINER};
  width: 100%;
  padding: 23px;
  gap: 24px;
  background-color: ${({ theme }) => theme.color.background03};
  border: 1px solid ${({ theme }) => theme.color.border01};
  border-radius: 10px;
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.08);
  .loading-spining {
    padding: 8px 0;
    width: 100%;
    span {
      height: 20px;
      display: block;
      max-width: 100%;
    }
  }
  ${media.tablet} {
    max-width: ${ContainerWidth.TABLET_CONTAINER};
  }
  ${media.mobile} {
    max-width: ${ContainerWidth.MOBILE_CONTAINER};
    padding: 0px;
    gap: 0px;
    .loading-spining {
      padding: 30px 0 30px 11px;
    }
  }
`;

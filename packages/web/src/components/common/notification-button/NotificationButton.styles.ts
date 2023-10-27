import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const NotificationWrapper = styled.div`
  position: relative;
`;

export const AlertButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  width: 36px;
  height: 36px;
  padding: 3px 4px 5px 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
  ${media.tablet} {
    width: 32px;
    height: 32px;
  }
  .notification-icon {
    width: 28px;
    height: 28px;
    ${media.tablet} {
      width: 24px;
      height: 24px;
    }
    * {
      fill: ${({ theme }) => theme.color.icon05};
    }
  }
  &:hover {
    .notification-icon * {
      fill: ${({ theme }) => theme.color.icon07};
    }
  }
`;

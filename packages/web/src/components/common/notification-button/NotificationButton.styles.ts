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
  border-radius: 4px;
  transition: all 0.3s ease;
  .notification-icon {
    width: 36px;
    height: 36px;
    padding: 4px;
    ${media.tablet} {
      width: 32px;
      height: 32px;
    }
    * {
      fill: ${({ theme }) => theme.color.icon05};
    }
  }
  &:hover {
    .notification-icon * {
      fill: ${({ theme }) => theme.color.icon02};
    }
  }
`;

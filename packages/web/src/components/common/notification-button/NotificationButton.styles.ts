import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const NotificationWrapper = styled.div`
  position: relative;
`;

export const AlertButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  width: 28px;
  height: 28px;
  border-radius: 4px;
  transition: all 0.3s ease;
  ${media.tablet} {
    width: 24px;
    height: 24px;
  }
  .notification-icon {
    width: 21px;
    height: 25px;
    ${media.tablet} {
      width: 18px;
      height: 21.5px;
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

import styled from "@emotion/styled";
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
  .notification-icon * {
    fill: ${({ theme }) => theme.color.icon05};
  }
  &:hover {
    .notification-icon * {
      fill: ${({ theme }) => theme.color.icon02};
    }
  }
`;

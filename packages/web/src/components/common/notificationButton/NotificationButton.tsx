import React from "react";
import IconAlert from "../icons/IconAlert";
import { AlertButton, NotificationWrapper } from "./NotificationButton.styles";

const NotificationButton = () => {
  return (
    <NotificationWrapper>
      <AlertButton>
        <IconAlert className="notification-icon" />
      </AlertButton>
    </NotificationWrapper>
  );
};

export default NotificationButton;

import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import NotificationButton from "./NotificationButton";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "common/NotificationButton",
  component: NotificationButton,
  decorators: [
    Story => (
      <div
        style={{
          position: "fixed",
          top: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof NotificationButton>;

const Template: ComponentStory<typeof NotificationButton> = args => (
  <NotificationButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  breakpoint: DEVICE_TYPE.WEB,
};

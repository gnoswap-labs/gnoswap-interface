import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import NotificationButton from "./NotificationButton";

export default {
  title: "common/NotificationButton",
  component: NotificationButton,
  decorators: [
    Story => (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof NotificationButton>;

const Template: ComponentStory<typeof NotificationButton> = () => (
  <NotificationButton />
);

export const Default = Template.bind({});
Default.args = {};

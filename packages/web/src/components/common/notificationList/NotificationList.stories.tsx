import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import NotificationList from "./NotificationList";

export default {
  title: "common/NotificationList",
  component: NotificationList,
  decorators: [
    Story => (
      <div
        style={{
          position: "relative",
        }}
      >
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof NotificationList>;

const Template: ComponentStory<typeof NotificationList> = args => (
  <NotificationList />
);

export const Default = Template.bind({});
Default.args = {};

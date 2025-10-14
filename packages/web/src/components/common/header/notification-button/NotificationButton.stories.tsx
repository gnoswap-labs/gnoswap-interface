import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import NotificationButton from "./NotificationButton";
import { DEVICE_TYPE } from "@styles/media";

const meta = {
  title: "common/NotificationButton",
  component: NotificationButton,
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
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
} satisfies Meta<typeof NotificationButton>;

export default meta;
type Story = StoryObj<typeof NotificationButton>;

export const Default: Story = {
  args: {
    breakpoint: DEVICE_TYPE.WEB,
  },
};

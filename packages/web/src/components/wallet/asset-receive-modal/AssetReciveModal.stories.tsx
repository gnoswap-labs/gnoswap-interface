import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import { DEVICE_TYPE } from "@styles/media";
import AssetReceiveModal, { DEFAULT_DEPOSIT_GNOT } from "./AssetReceiveModal";

const meta = {
  title: "wallet/AssetReceiveModal",
  component: AssetReceiveModal,
  tags: ["autodocs"],
} satisfies Meta<typeof AssetReceiveModal>;

export default meta;
type Story = StoryObj<typeof AssetReceiveModal>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof AssetReceiveModal>) => <AssetReceiveModal {...args} />,
  args: {
    breakpoint: DEVICE_TYPE.WEB,
    depositInfo: DEFAULT_DEPOSIT_GNOT,
    avgBlockTime: 2.2,
    changeToken: fn(),
    close: fn(),
  },
};

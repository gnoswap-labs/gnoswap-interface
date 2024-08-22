import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import AssetReceiveModal, { DEFAULT_DEPOSIT_GNOT } from "./AssetReceiveModal";
import { action } from "@storybook/addon-actions";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "wallet/AssetReceiveModal",
  component: AssetReceiveModal,
} as ComponentMeta<typeof AssetReceiveModal>;

const Template: ComponentStory<typeof AssetReceiveModal> = args => (
  <AssetReceiveModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  breakpoint: DEVICE_TYPE.WEB,
  depositInfo: DEFAULT_DEPOSIT_GNOT,
  avgBlockTime: 2.2,
  changeToken: action("changeToken"),
  close: action("close"),
};

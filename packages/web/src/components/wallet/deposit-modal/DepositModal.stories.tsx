import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import DepositModal, { DEFAULT_DEPOSIT_GNOT } from "./DepositModal";
import { action } from "@storybook/addon-actions";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "wallet/DepositModal",
  component: DepositModal,
} as ComponentMeta<typeof DepositModal>;

const Template: ComponentStory<typeof DepositModal> = args => (
  <DepositModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  breakpoint: DEVICE_TYPE.WEB,
  depositInfo: DEFAULT_DEPOSIT_GNOT,
  avgBlockTime: 2.2,
  changeToken: action("changeToken"),
  close: action("close"),
};

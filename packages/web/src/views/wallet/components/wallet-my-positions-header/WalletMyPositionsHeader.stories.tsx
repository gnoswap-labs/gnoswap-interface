import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import WalletMyPositionsHeader from "./WalletMyPositionsHeader";

export default {
  title: "wallet/WalletMyPositionsHeader",
  component: WalletMyPositionsHeader,
} as ComponentMeta<typeof WalletMyPositionsHeader>;

const Template: ComponentStory<typeof WalletMyPositionsHeader> = args => (
  <WalletMyPositionsHeader {...args} />
);

export const Default = Template.bind({});
Default.args = {};

import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import EnterAmounts from "./EnterAmounts";

export default {
  title: "common/AddLiquidity/EnterAmounts",
  component: EnterAmounts,
} as ComponentMeta<typeof EnterAmounts>;

const Template: ComponentStory<typeof EnterAmounts> = args => (
  <EnterAmounts {...args} />
);

export const Default = Template.bind({});
Default.args = {
  from: { token: "GNOT", amount: "121", price: "$0.00", balance: "0" },
  to: { token: "GNOS", amount: "5000", price: "$0.00", balance: "0" },
};

import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PoolInfo from "./PoolInfo";

export default {
  title: "earn/PoolList/PoolInfo",
  component: PoolInfo,
} as ComponentMeta<typeof PoolInfo>;

const Template: ComponentStory<typeof PoolInfo> = args => (
  <PoolInfo {...args} />
);

export const Default = Template.bind({});
Default.args = {
  id: "pool_id",
};

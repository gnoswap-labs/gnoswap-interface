import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PoolListTable from "./PoolListTable";

export default {
  title: "earn/PoolList/PoolListTable",
  component: PoolListTable,
} as ComponentMeta<typeof PoolListTable>;

const Template: ComponentStory<typeof PoolListTable> = args => (
  <PoolListTable {...args} />
);

export const Default = Template.bind({});
Default.args = {
  pools: [{ id: "pool_id_1" }, { id: "pool_id_2" }],
};

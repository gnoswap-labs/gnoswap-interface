import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TableSkeleton from "./TableSkeleton";

export default {
  title: "common/TableSkeleton",
  component: TableSkeleton,
} as ComponentMeta<typeof TableSkeleton>;

const Template: ComponentStory<typeof TableSkeleton> = args => (
  <TableSkeleton />
);

export const Default = Template.bind({});
Default.args = {};

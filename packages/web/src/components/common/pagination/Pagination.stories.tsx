import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Pagination from "./Pagination";

export default {
  title: "common/Pagination",
  component: Pagination,
} as ComponentMeta<typeof Pagination>;

const Template: ComponentStory<typeof Pagination> = args => (
  <Pagination {...args} />
);

export const Default = Template.bind({});
Default.args = {
  totalPage: 100,
  currentPage: 0,
  onPageChange: action("onPageChange"),
};

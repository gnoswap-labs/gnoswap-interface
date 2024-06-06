import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TableSkeleton from "./TableSkeleton";
import {
  // POOL_TD_WIDTH,
  SHAPE_TYPES,
  TABLE_TITLE,
} from "@constants/skeleton.constant";

export default {
  title: "common/TableSkeleton",
  component: TableSkeleton,
} as ComponentMeta<typeof TableSkeleton>;

const Template: ComponentStory<typeof TableSkeleton> = args => (
  <TableSkeleton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  info: {
    title: TABLE_TITLE.POOL_TABLE,
    total: 5,
    // tdWidth: POOL_TD_WIDTH,
    list: [
      { width: 161, type: SHAPE_TYPES.ROUNDED_SQUARE, left: true, className: "", skeletonWidth: 161 },
      { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, className: "", skeletonWidth: 120 },
      { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, className: "", skeletonWidth: 120 },
      { width: 120, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, className: "", skeletonWidth: 120 },
      { width: 80, type: SHAPE_TYPES.ROUNDED_SQUARE, left: false, className: "", skeletonWidth: 80 },
      { width: 20, type: SHAPE_TYPES.CIRCLE, left: false, className: "", skeletonWidth: 20 },
    ],
  },
};

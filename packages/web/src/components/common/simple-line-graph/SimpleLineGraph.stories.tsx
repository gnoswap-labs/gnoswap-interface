import SimpleLineGraph, { type SimpleLineGraphProps } from "./SimpleLineGraph";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "common/SimpleLineGraph",
  component: SimpleLineGraph,
} as Meta<typeof SimpleLineGraph>;

export const Default: StoryObj<SimpleLineGraphProps> = {
  args: {
    datas: [
      3, 2, 5, 1, 8, 6, 8
    ]
  },
};

export const Up: StoryObj<SimpleLineGraphProps> = {
  args: {
    datas: [
      1, 2, 3, 4, 5, 6, 7
    ]
  },
};

export const Down: StoryObj<SimpleLineGraphProps> = {
  args: {
    datas: [
      7, 6, 5, 4, 3, 2, 1
    ]
  },
};
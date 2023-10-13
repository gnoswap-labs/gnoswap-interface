import PoolGraph, { type PoolGraphProps } from "./PoolGraph";
import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

export default {
  title: "common/PoolGraph",
  component: PoolGraph,
} as Meta<typeof PoolGraph>;

export const Default: StoryObj<PoolGraphProps> = {
  args: {
    ticks: [],
    width: 400,
    height: 200,
    onChangeMinTick: action("onChangeMinTick"),
    onChangeMaxTick: action("onChangeMaxTick"),
  },
};
import { DUMMY_POOL_TICKS } from "@containers/earn-add-liquidity-container/earn-add-liquidity-dummy";
import PoolGraph, { type PoolGraphProps } from "./PoolGraph";
import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

export default {
  title: "common/PoolGraph",
  component: PoolGraph,
} as Meta<typeof PoolGraph>;

export const Default: StoryObj<PoolGraphProps> = {
  args: {
    ticks: DUMMY_POOL_TICKS,
    currentTick: DUMMY_POOL_TICKS[20],
    width: 400,
    height: 200,
    minTick: DUMMY_POOL_TICKS[10],
    maxTick: DUMMY_POOL_TICKS[30],
    onChangeMinTick: action("onChangeMinTick"),
    onChangeMaxTick: action("onChangeMaxTick"),
  },
};
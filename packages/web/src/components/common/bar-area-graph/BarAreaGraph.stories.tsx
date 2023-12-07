import BarAreaGraph, { type BarAreaGraphProps } from "./BarAreaGraph";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "common/BarAreaGraph",
  component: BarAreaGraph,
} as Meta<typeof BarAreaGraph>;

const datas = Array.from({ length: 60 }, () => `${Math.random() * 30 + 10}`);

export const Default: StoryObj<BarAreaGraphProps> = {
  args: {
    width: 400,
    height: 300,
    minGap: 1,
  },
};
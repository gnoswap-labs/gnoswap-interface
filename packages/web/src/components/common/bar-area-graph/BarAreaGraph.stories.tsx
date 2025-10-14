import BarAreaGraph, { type BarAreaGraphProps } from "./BarAreaGraph";
import { Meta, StoryObj } from "@storybook/nextjs";

export default {
  title: "common/BarAreaGraph",
  component: BarAreaGraph,
} as Meta<typeof BarAreaGraph>;

export const Default: StoryObj<BarAreaGraphProps> = {
  args: {
    width: 400,
    height: 300,
    minGap: 1,
  },
};

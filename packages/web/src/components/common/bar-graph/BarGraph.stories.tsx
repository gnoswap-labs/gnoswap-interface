import BarGraph, { type BarGraphProps } from "./BarGraph";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "common/BarGraph",
  component: BarGraph,
} as Meta<typeof BarGraph>;

const datas = Array.from({ length: 24 }, () => `${Math.random() * 30}`);

export const Default: StoryObj<BarGraphProps> = {
  args: {
    width: 570,
    height: 180,
    color: "#192EA2",
    hoverColor: "#0059FF",
    strokeWidth: 12.5,
    minGap: 1,
    datas,
  },
};
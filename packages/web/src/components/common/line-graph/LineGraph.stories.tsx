import LineGraph, { type LineGraphProps } from "./LineGraph";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "common/LineGraph",
  component: LineGraph,
} as Meta<typeof LineGraph>;

const datas = [
  {
    value: "1",
    time: "2022-01-01",
  },
  {
    value: "3",
    time: "2022-01-02",
  },
  {
    value: "6",
    time: "2022-01-03",
  },
  {
    value: "4",
    time: "2022-01-04",
  },
  {
    value: "5",
    time: "2022-01-6",
  },
  {
    value: "3",
    time: "2022-01-7",
  },
  {
    value: "7",
    time: "2022-01-8",
  },
  {
    value: "2",
    time: "2022-01-9",
  },
  {
    value: "7",
    time: "2022-01-10",
  },
  {
    value: "3",
    time: "2022-01-11",
  },
  {
    value: "4",
    time: "2022-01-12",
  },
  {
    value: "7",
    time: "2022-01-13",
  },
  {
    value: "5",
    time: "2022-01-14",
  },
];

export const Default: StoryObj<LineGraphProps> = {
  args: {
    gradientStartColor: "FF0000",
    gradientEndColor: "#00000000",
    strokeWidth: 1,
    width: 400,
    height: 300,
    point: true,
    color: "#FF0000",
    datas,
    cursor: true,
    smooth: true,
  },
};
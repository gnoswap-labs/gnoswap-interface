import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import { CHART_TYPE } from "@constants/option.constant";
import VolumeChartSelectTab from "./VolumeChartSelectTab";

const meta = {
  title: "dashboard/VolumeChartSelectTab",
  component: VolumeChartSelectTab,
  tags: ["autodocs"],
} satisfies Meta<typeof VolumeChartSelectTab>;

export default meta;
type Story = StoryObj<typeof VolumeChartSelectTab>;

export const Default: Story = {
  args: {
    volumeChartType: CHART_TYPE["7D"],
    changeVolumeChartType: fn(),
  },
};

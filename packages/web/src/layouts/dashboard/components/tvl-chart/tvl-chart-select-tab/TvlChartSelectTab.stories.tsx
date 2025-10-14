import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import { CHART_TYPE } from "@constants/option.constant";
import TvlChartSelectTab from "./TvlChartSelectTab";

const meta = {
  title: "dashboard/TvlChartSelectTab",
  component: TvlChartSelectTab,
  tags: ["autodocs"],
} satisfies Meta<typeof TvlChartSelectTab>;

export default meta;
type Story = StoryObj<typeof TvlChartSelectTab>;

export const Default: Story = {
  args: {
    tvlChartType: CHART_TYPE["7D"],
    changeTvlChartType: fn(),
  },
};

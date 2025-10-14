import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import { CHART_TYPE } from "@constants/option.constant";

import ChartScopeSelectTab from "./ChartScopeSelectTab";

const meta = {
  title: "earn/ChartScopeSelectTab",
  component: ChartScopeSelectTab,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof ChartScopeSelectTab>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof ChartScopeSelectTab>]?: React.ComponentProps<typeof ChartScopeSelectTab>[K];
}>;

export const Default: Story = {
  args: {
    selected: CHART_TYPE["7D"],
    onChange: fn(),
  },
};

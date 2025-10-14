import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import TokenChartGraphTab from "./TokenChartGraphTab";

const meta = {
  title: "token/TokenChartGraphTab",
  component: TokenChartGraphTab,
  tags: ["autodocs"],
} satisfies Meta<typeof TokenChartGraphTab>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof TokenChartGraphTab>]?: React.ComponentProps<typeof TokenChartGraphTab>[K];
}>;

export const Default: Story = {
  args: {
    currentTab: "1D",
    changeTab: fn(),
  },
};

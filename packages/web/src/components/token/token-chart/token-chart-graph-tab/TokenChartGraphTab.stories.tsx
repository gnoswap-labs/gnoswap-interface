import TokenChartGraphTab, { type TokenChartGraphTabProps } from "./TokenChartGraphTab";
import { Meta, StoryObj } from "@storybook/react";
import { action } from '@storybook/addon-actions';

export default {
  title: "token/TokenChartGraphTab",
  component: TokenChartGraphTab,
} as Meta<typeof TokenChartGraphTab>;

export const Default: StoryObj<TokenChartGraphTabProps> = {
  args: {
    currentTab: "1D",
    changeTab: () => action("changeTab")
  },
};
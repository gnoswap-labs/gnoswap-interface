import SelectToken, { type SelectTokenIncentivizeProps } from "./SelectTokenIncentivize";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "common/SelectToken",
  component: SelectToken,
} as Meta<typeof SelectToken>;

export const Default: StoryObj<SelectTokenIncentivizeProps> = {
  args: {},
};
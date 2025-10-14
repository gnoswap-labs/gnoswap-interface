import SelectToken, { type SelectTokenIncentivizeProps } from "./SelectTokenIncentivize";
import { Meta, StoryObj } from "@storybook/nextjs";

export default {
  title: "common/SelectTokenIncentivize",
  component: SelectToken,
} as Meta<typeof SelectToken>;

export const Default: StoryObj<SelectTokenIncentivizeProps> = {
  args: {},
};

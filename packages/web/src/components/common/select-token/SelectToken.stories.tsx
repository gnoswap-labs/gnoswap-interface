import SelectToken, { type SelectTokenProps } from "./SelectToken";
import { Meta, StoryObj } from "@storybook/nextjs";

export default {
  title: "common/SelectToken",
  component: SelectToken,
} as Meta<typeof SelectToken>;

export const Default: StoryObj<SelectTokenProps> = {
  args: {},
};

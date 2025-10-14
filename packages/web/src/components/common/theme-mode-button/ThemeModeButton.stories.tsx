import type { Meta, StoryObj } from "@storybook/nextjs";
import ThemeModeButton from "./ThemeModeButton";

const meta = {
  title: "common/ThemeModeButton",
  component: ThemeModeButton,
  tags: ["autodocs"],
} satisfies Meta<typeof ThemeModeButton>;

export default meta;
type Story = StoryObj<typeof ThemeModeButton>;

export const Default: Story = {
  args: {},
};

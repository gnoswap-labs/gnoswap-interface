import type { Meta, StoryObj } from "@storybook/nextjs";

import TokenDescriptionContent from "./TokenDescriptionContent";

const meta = {
  title: "token/TokenDescriptionContent",
  component: TokenDescriptionContent,
  tags: ["autodocs"],
} satisfies Meta<typeof TokenDescriptionContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: "string",
  },
};

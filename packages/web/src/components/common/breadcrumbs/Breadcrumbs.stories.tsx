import type { Meta, StoryObj } from "@storybook/nextjs";
import Breadcrumbs from "./Breadcrumbs";
import { fn } from "@storybook/test";

const meta = {
  title: "common/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  args: {
    steps: [
      {
        title: "Earn",
        path: "/earn",
      },
      {
        title: "GNOS/GNOT (0.3%)",
      },
    ],
    onClickPath: fn(),
  },
};

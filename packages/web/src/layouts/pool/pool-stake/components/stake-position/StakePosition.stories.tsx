import type { Meta, StoryObj } from "@storybook/nextjs";

import StakePositionContainer from "../../containers/stake-position-container/StakePositionContainer";

import StakePosition from "./StakePosition";

const meta = {
  title: "stake/StakePosition",
  component: StakePosition,
  tags: ["autodocs"],
} satisfies Meta<typeof StakePosition>;

export default meta;
type Story = StoryObj<typeof StakePosition>;

export const Default: Story = {
  render: () => <StakePositionContainer onOpenVideoGuide={() => {}} />,
};

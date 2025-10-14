import type { Meta, StoryObj } from "@storybook/nextjs";
import { css } from "@emotion/react";

import MyDetailedPositionCard from "./MyDetailedPositionCard";
import { DEVICE_TYPE } from "@styles/media";

const meta = {
  title: "pool/MyDetailedPositionCard",
  component: MyDetailedPositionCard,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div css={wrapper}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MyDetailedPositionCard>;

export default meta;
type Story = StoryObj<typeof MyDetailedPositionCard>;

export const Default: Story = {
  args: {
    breakpoint: DEVICE_TYPE.WEB,
  },
};

const wrapper = css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;

import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import Badge, { BADGE_TYPE } from "./Badge";
import IconStaking from "@components/common/icons/IconStaking";

const meta = {
  title: "Components/Common/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: Object.values(BADGE_TYPE),
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

export const Line: Story = {
  args: {
    type: BADGE_TYPE.LINE,
    text: "Line",
  },
};

export const Primary: Story = {
  args: {
    type: BADGE_TYPE.PRIMARY,
    text: "Primary",
  },
};

export const LightDefault: Story = {
  args: {
    type: BADGE_TYPE.LIGHT_DEFAULT,
    text: "LightDefault",
  },
};

export const DarkDefault: Story = {
  args: {
    type: BADGE_TYPE.DARK_DEFAULT,
    text: "DarkDefault",
  },
};

export const LeftIcon: Story = {
  args: {
    type: BADGE_TYPE.PRIMARY,
    text: "Staked",
    leftIcon: <IconStaking />,
  },
};

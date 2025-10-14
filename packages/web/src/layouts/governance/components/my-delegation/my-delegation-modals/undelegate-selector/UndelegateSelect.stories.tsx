import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import { DelegationItemInfo } from "@repositories/governance";

import UndelegateSelect from "./UndelegateSelect";

const meta = {
  title: "governance/UndelegateModal/Select",
  component: UndelegateSelect,
  tags: ["autodocs"],
} satisfies Meta<typeof UndelegateSelect>;

export default meta;
type Story = StoryObj<{
  [K in keyof React.ComponentProps<typeof UndelegateSelect>]: K extends "children"
    ? React.ReactNode
    : React.ComponentProps<typeof UndelegateSelect>[K];
}>;

export const Default: Story = {
  args: {
    delegatedInfos: [],
  },
  render: (args: React.ComponentProps<typeof UndelegateSelect>) => {
    const [selectedDelegationInfo, setSelectedDelegationInfo] = useState<DelegationItemInfo | null>(null);

    return (
      <UndelegateSelect
        {...args}
        selectedDelegationInfo={selectedDelegationInfo}
        select={() => setSelectedDelegationInfo(null)}
      />
    );
  },
};

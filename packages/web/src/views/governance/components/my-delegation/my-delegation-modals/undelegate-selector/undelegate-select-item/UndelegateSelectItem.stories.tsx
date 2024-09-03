import { Meta, StoryObj } from "@storybook/react";
import React from "react";

import GetMyDelegationResposneMock from "@repositories/governance/mock/get-my-delegation-response.json";

import UndelegateSelectItem, { type UndelegateSelectItemProps } from "./UndelegateSelectItem";

const Template: React.FC<UndelegateSelectItemProps> = args => {
  return (
    <div style={{ backgroundColor: "#141A29" }}>
      <UndelegateSelectItem {...args} />
    </div>
  );
};

export default {
  title: "governance/UndelegateModal/SelectItem",
  component: Template,

} as Meta<typeof UndelegateSelectItem>;


export const Default: StoryObj<UndelegateSelectItemProps> = {
  args: {
    delegationItemInfo: GetMyDelegationResposneMock.delegations[0],
    visibleAmount: true,
  },
};
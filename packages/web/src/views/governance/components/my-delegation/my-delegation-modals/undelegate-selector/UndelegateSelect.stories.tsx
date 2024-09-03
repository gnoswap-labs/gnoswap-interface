import { ComponentStory, Meta } from "@storybook/react";
import { useState } from "react";

import { DelegationItemInfo } from "@repositories/governance";
import GetMyDelegationResposneMock from "@repositories/governance/mock/get-my-delegation-response.json";

import UndelegateSelect from "./UndelegateSelect";

export default {
  title: "governance/UndelegateModal/Select",
  component: UndelegateSelect,
} as Meta<typeof UndelegateSelect>;

const Template: ComponentStory<typeof UndelegateSelect> = args => {
  const [selectedDelegationInfo, setSelectedDelegationInfo] =
    useState<DelegationItemInfo | null>(null);

  return (
    <UndelegateSelect
      {...args}
      selectedDelegationInfo={selectedDelegationInfo}
      select={() => setSelectedDelegationInfo(null)}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  delegatedInfos: GetMyDelegationResposneMock.delegations,
};

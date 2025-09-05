import { ComponentStory, Meta } from "@storybook/react";
import { useState } from "react";

import { DelegationItemInfo2 } from "@repositories/governance";

import UndelegateSelect from "./UndelegateSelect";

export default {
  title: "governance/UndelegateModal/Select",
  component: UndelegateSelect,
} as Meta<typeof UndelegateSelect>;

const Template: ComponentStory<typeof UndelegateSelect> = args => {
  const [selectedDelegationInfo, setSelectedDelegationInfo] = useState<DelegationItemInfo2 | null>(null);

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
  delegatedInfos: [],
};

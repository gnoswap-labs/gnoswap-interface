import { ComponentMeta, ComponentStory } from "@storybook/react";

import SelectUnstakeResult from "./SelectUnstakeResult";

export default {
  title: "pool/pool-unstake/SelectUnstakeResult",
  component: SelectUnstakeResult,
} as ComponentMeta<typeof SelectUnstakeResult>;

const Template: ComponentStory<typeof SelectUnstakeResult> = args => {
  return <SelectUnstakeResult {...args} />;
};

export const Default = Template.bind({});
Default.args = {};

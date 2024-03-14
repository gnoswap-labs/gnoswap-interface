import { ComponentStory, ComponentMeta } from "@storybook/react";
import CopyReferralLink from "./CopyReferralLink";

export default {
  title: "leaderboard/CopyReferralLink",
  component: CopyReferralLink,
} as ComponentMeta<typeof CopyReferralLink>;

const Template: ComponentStory<typeof CopyReferralLink> = args => (
  <CopyReferralLink {...args} />
);

export const Connected = Template.bind({});
Connected.args = {
  connected: true,
};

export const Unconnected = Template.bind({});
Unconnected.args = {
  connected: false,
};

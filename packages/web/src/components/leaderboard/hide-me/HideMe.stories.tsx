import { ComponentStory, Meta } from "@storybook/react";
import HideMe from "./HideMe";

export default {
  title: "leaderboard/HideMe",
  component: HideMe,
} as Meta<typeof HideMe>;

const Template: ComponentStory<typeof HideMe> = args => <HideMe {...args} />;

export const Mobile = Template.bind({});
Mobile.args = {
  isMobile: true,
};

export const Web = Template.bind({});
Web.args = {
  isMobile: false,
};

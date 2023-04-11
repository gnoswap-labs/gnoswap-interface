import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TokenDescriptionLinks from "./TokenDescriptionLinks";
import { descriptionInit } from "@containers/token-description-container/TokenDescriptionContainer";

export default {
  title: "token/TokenDescriptionLinks",
  component: TokenDescriptionLinks,
} as ComponentMeta<typeof TokenDescriptionLinks>;

const Template: ComponentStory<typeof TokenDescriptionLinks> = args => (
  <TokenDescriptionLinks {...args} />
);

export const Default = Template.bind({});
Default.args = {
  links: descriptionInit.links,
};

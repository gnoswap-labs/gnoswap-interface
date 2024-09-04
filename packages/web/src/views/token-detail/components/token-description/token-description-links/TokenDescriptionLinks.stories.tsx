import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TokenDescriptionLinks from "./TokenDescriptionLinks";

export default {
  title: "token/TokenDescriptionLinks",
  component: TokenDescriptionLinks,
} as ComponentMeta<typeof TokenDescriptionLinks>;

const Template: ComponentStory<typeof TokenDescriptionLinks> = args => (
  <TokenDescriptionLinks {...args} />
);

export const Default = Template.bind({});
Default.args = {
  links: {
    Website: "https://gnoswap.io",
    Gnoscan: "https://gnoscan.io/tokens/r/demo/wugnot",
  },
};

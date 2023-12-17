import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ActivityInfo from "./ActivityInfo";
import { css, Theme } from "@emotion/react";

export default {
  title: "dashboard/ActivityInfo",
  component: ActivityInfo,
} as ComponentMeta<typeof ActivityInfo>;

const Template: ComponentStory<typeof ActivityInfo> = args => (
  <div css={wrapper}>
    <ActivityInfo {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  item: {
    action: "IBC Deposit ATOM",
    totalValue: "$12,090",
    tokenAmountOne: "100 ATOM",
    tokenAmountTwo: "19 GNOS",
    account: "g129kua...ndsu12",
    time: "less than a minute ago",
    explorerUrl:
      "https://gnoscan.io/transactions/details?txhash=hNaBGE2oDb15Q08y68wpycjwwGaCcXcU2jnrRRfuUo0%3D",
  },
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;

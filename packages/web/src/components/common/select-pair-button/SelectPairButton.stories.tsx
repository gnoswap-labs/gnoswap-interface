import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import SelectPairButton from "./SelectPairButton";

export default {
  title: "common/AddLiquidity/SelectPairButton",
  component: SelectPairButton,
} as ComponentMeta<typeof SelectPairButton>;

const Template: ComponentStory<typeof SelectPairButton> = args => (
  <SelectPairButton {...args} />
);

export const Selected = Template.bind({});
Selected.args = {
  token: {
    chainId: "test3",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    path: "gno.land/r/demo/1inch",
    name: "1inch",
    symbol: "1INCH",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    type: "grc20",
    priceId: "1inch",
    createdAt: "1999-01-01T00:00:01Z"
  },
};

export const UnSelected = Template.bind({});
UnSelected.args = {
  token: undefined,
};

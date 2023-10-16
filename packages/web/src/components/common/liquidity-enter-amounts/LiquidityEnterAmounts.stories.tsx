import React from "react";
import {
  ComponentStory,
  ComponentMeta
} from "@storybook/react";

import EnterAmounts from "./LiquidityEnterAmounts";
import { action } from "@storybook/addon-actions";

export default {
  title: "common/AddLiquidity/EnterAmounts",
  component: EnterAmounts,
} as ComponentMeta<typeof EnterAmounts>;

const Template: ComponentStory<typeof EnterAmounts> = args => (
  <EnterAmounts {...args} />
);

const token = {
  "chainId": "test3",
  "address": "0x111111111117dC0aa78b770fA6A738034120C302",
  "path": "gno.land/r/demo/1inch",
  "name": "1inch",
  "symbol": "1INCH",
  "decimals": 6,
  "logoURI": "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
  "priceId": "1inch",
  "createdAt": "1999-01-01T00:00:01Z"
};

export const Default = Template.bind({});
Default.args = {
  tokenAInput: {
    token: token,
    amount: "121",
    usdValue: "$0.00",
    balance: "0",
    changeAmount: action("changeAmount"),
  },
  tokenBInput: {
    token: token,
    amount: "121",
    usdValue: "$0.00",
    balance: "0",
    changeAmount: action("changeAmount"),
  },
  changeTokenA: action("changeTokenA"),
  changeTokenB: action("changeTokenB"),
};

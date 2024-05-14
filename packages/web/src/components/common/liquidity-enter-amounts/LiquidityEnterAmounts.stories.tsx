import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import EnterAmounts from "./LiquidityEnterAmounts";
import { action } from "@storybook/addon-actions";
import { TokenModel } from "@models/token/token-model";

export default {
  title: "common/AddLiquidity/EnterAmounts",
  component: EnterAmounts,
} as ComponentMeta<typeof EnterAmounts>;

const Template: ComponentStory<typeof EnterAmounts> = args => (
  <EnterAmounts {...args} />
);

const token: TokenModel = {
  isWrappedGasToken: false,
  isGasToken: false,
  description: "",
  websiteURL: "",
  type: "grc20",
  chainId: "dev.gnoswap",
  createdAt: "2023-12-08T03:57:43Z",
  name: "Foo",
  path: "gno.land/r/foo",
  decimals: 4,
  symbol: "FOO",
  logoURI:
    "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
  priceID: "gno.land/r/foo",
  priceId: "gno.land/r/foo",
  address: "",
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

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { TokenModel } from "@models/token/token-model";
import SelectPair from "./SelectPair";

export default {
  title: "pool/pool-add/SelectPair",
  component: SelectPair,
} as ComponentMeta<typeof SelectPair>;

const Template: ComponentStory<typeof SelectPair> = args => <SelectPair {...args} />;

const tokenA: TokenModel = {
  type: "GRC20",
  chainId: "dev.gnoswap",
  createdAt: "2023-12-08T03:57:43Z",
  name: "Foo",
  path: "gno.land/r/foo",
  decimals: 4,
  symbol: "FOO",
  logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
  priceID: "gno.land/r/foo",
  address: "",
};

const tokenB: TokenModel = {
  type: "GRC20",
  chainId: "dev.gnoswap",
  createdAt: "2023-12-08T03:57:43Z",
  name: "Foo",
  path: "gno.land/r/foo",
  decimals: 4,
  symbol: "FOO",
  logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
  address: "",
  priceID: "gno.land/r/foo",
};

export const Default = Template.bind({});
Default.args = {
  tokenA: tokenA,
  tokenB: tokenB,
};

export const SelectableStatus = Template.bind({});
SelectableStatus.args = {
  tokenA: tokenA,
  tokenB: tokenB,
};

export const UnselectableStatus = Template.bind({});
UnselectableStatus.args = {
  tokenA: tokenA,
  tokenB: tokenB,
  disabled: true,
};

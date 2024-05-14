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
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-08T03:57:43Z",
    name: "Foo",
    path: "gno.land/r/foo",
    decimals: 4,
    symbol: "FOO",
    logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceID: "gno.land/r/foo",
    priceId: "gno.land/r/foo",
    address: ""
  },
};

export const UnSelected = Template.bind({});
UnSelected.args = {
  token: undefined,
};

import type { Meta, StoryObj } from "@storybook/nextjs";
import SelectPairButton from "./SelectPairButton";

const meta = {
  title: "common/AddLiquidity/SelectPairButton",
  component: SelectPairButton,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectPairButton>;

export default meta;
type Story = StoryObj<typeof SelectPairButton>;

export const Selected: Story = {
  args: {
    token: {
      type: "GRC20",
      chainId: "dev.gnoswap",
      createdAt: "2023-12-08T03:57:43Z",
      name: "Foo",
      path: "gno.land/r/foo",
      decimals: 4,
      symbol: "FOO",
      displaySymbol: "FOO",
      logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
      priceID: "gno.land/r/foo",
      address: "",
    },
  },
};

export const UnSelected: Story = {
  args: {
    token: undefined,
  },
};

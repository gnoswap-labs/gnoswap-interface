import { css } from "@emotion/react";
import { SwapRouteInfo } from "@models/swap/swap-route-info";
import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import SwapCardAutoRouter from "./SwapCardAutoRouter";

const swapRouteInfos: SwapRouteInfo[] = [
  {
    from: {
      type: "GRC20",
      chainId: "dev.gnoswap",
      createdAt: "2023-12-08T03:57:43Z",
      name: "Foo",
      path: "gno.land/r/foo",
      tokenId: "gno.land/r/foo.FOO",
      decimals: 4,
      symbol: "FOO",
      displaySymbol: "FOO",
      logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
      priceID: "gno.land/r/foo",
      address: "",
    },
    to: {
      type: "GRC20",
      chainId: "dev.gnoswap",
      createdAt: "2023-12-08T03:57:43Z",
      name: "Foo",
      path: "gno.land/r/foo",
      tokenId: "gno.land/r/foo.FOO",
      decimals: 4,
      symbol: "FOO",
      displaySymbol: "FOO",
      logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
      priceID: "gno.land/r/foo",
      address: "",
    },
    gasFee: {
      amount: 0.000001,
      currency: "GNOT",
    },
    gasFeeUSD: 0.1,
    pools: [],
    version: "V1",
    weight: 100,
  },
];

const meta = {
  title: "swap/SwapCardAutoRouter",
  component: SwapCardAutoRouter,
  tags: ["autodocs"],
} satisfies Meta<typeof SwapCardAutoRouter>;

export default meta;
type Story = StoryObj<typeof SwapCardAutoRouter>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof SwapCardAutoRouter>) => (
    <div css={wrapper}>
      <div css={contentWrap}>
        <SwapCardAutoRouter {...args} />
      </div>
    </div>
  ),
  args: {
    swapRouteInfos,
  },
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;

const contentWrap = () => css`
  width: 500px;
`;

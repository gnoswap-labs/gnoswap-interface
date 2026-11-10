import BigNumber from "bignumber.js";
import { css, Global, ThemeProvider } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";
import React from "react";

import { STORY_GNOT_TOKEN, STORY_GNS_TOKEN } from "@components/order/common/order-story-fixtures";
import { applyLimitPricePreset, stepLimitPrice } from "@hooks/order/data/use-order-handler.utils";
import { formatPrice } from "@utils/new-number-utils";
import globalStyle from "@styles/globalStyle";
import { getTheme } from "@utils/theme-utils";

import LimitOrderCard from "./LimitOrderCard";

const meta = {
  title: "swap/LimitOrderCard",
  component: LimitOrderCard,
  tags: ["autodocs"],
} satisfies Meta<typeof LimitOrderCard>;

export default meta;
type Story = StoryObj<typeof LimitOrderCard>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof LimitOrderCard>) => (
    <div css={wrapper}>
      <div css={cardWrap}>
        <LimitOrderCard {...args} />
      </div>
    </div>
  ),
  args: {
    swapType: "limit",
    changeSwapType: fn(),
    copied: false,
    copyURL: fn(),
    slippage: 0.5,
    maxSlippage: 10,
    changeSlippage: fn(),
    themeKey: "dark",
    isLoading: false,
    connectedWallet: true,
    tokenA: STORY_GNS_TOKEN,
    tokenB: STORY_GNOT_TOKEN,
    tokenABalance: "1541.5",
    tokenBBalance: "1541.5",
    sellAmount: "1541.55",
    sellAmountUsd: "$1,541.55",
    buyAmount: "1960.235",
    buyAmountUsd: "$1,541.55",
    changeTokenA: fn(),
    changeTokenB: fn(),
    changeSellAmount: fn(),
    switchTokens: fn(),
    limitPrice: "1.2716",
    limitPriceUsd: "$1",
    marketPrice: "1.2716",
    changeLimitPrice: fn(),
    stepPrice: fn(),
    applyPreset: fn(),
    expiry: 86400,
    expiryOptions: [
      { value: 3600, label: "1 Hour" },
      { value: 86400, label: "1 Day" },
      { value: 604800, label: "1 Week" },
      { value: 2592000, label: "30 Days" },
    ],
    changeExpiry: fn(),
    buttonState: "PLACE_ORDER",
    buttonText: "Start to Order",
    minTradingText: "Minimum 0.0001 GNS",
    onClickButton: fn(),
  },
};

export const InteractivePresets: Story = {
  ...Default,
  args: { ...Default.args, limitPrice: applyLimitPricePreset(Default.args?.marketPrice ?? "1", 10) },
  render: function InteractivePresets(args) {
    const [limitPrice, setLimitPrice] = React.useState(args.limitPrice);
    const outputUsd = BigNumber(args.buyAmountUsd.replace(/[$,]/g, "")).dividedBy(args.buyAmount);
    const buyAmount = BigNumber(args.sellAmount)
      .multipliedBy(limitPrice || 0)
      .toFixed(args.tokenB?.decimals ?? 6);

    return (
      <div css={wrapper}>
        <div css={cardWrap}>
          <LimitOrderCard
            {...args}
            limitPrice={limitPrice}
            limitPriceUsd={limitPrice ? formatPrice(BigNumber(limitPrice).multipliedBy(outputUsd)) : "-"}
            buyAmount={buyAmount}
            buyAmountUsd={formatPrice(BigNumber(buyAmount).multipliedBy(outputUsd))}
            changeLimitPrice={setLimitPrice}
            stepPrice={direction => setLimitPrice(price => stepLimitPrice(price, direction))}
            applyPreset={percent => {
              if (args.marketPrice) setLimitPrice(applyLimitPricePreset(args.marketPrice, percent));
            }}
          />
        </div>
      </div>
    );
  },
};

export const InteractivePresetsLight: Story = {
  ...InteractivePresets,
  decorators: [
    Story => (
      <ThemeProvider theme={getTheme("light")}>
        <Global styles={globalStyle} />
        <Story />
      </ThemeProvider>
    ),
  ],
  args: { ...InteractivePresets.args, themeKey: "light" },
};

export const SmallMarketPrice: Story = {
  ...Default,
  args: {
    ...Default.args,
    tokenABalance: "1000000",
    sellAmount: "1000000",
    sellAmountUsd: "$1",
    buyAmount: "4.4053",
    buyAmountUsd: "$1",
    limitPrice: "0.0000044053",
    limitPriceUsd: "$0.000001",
    marketPrice: "0.0000044053",
  },
};

export const LargeMarketPrice: Story = {
  ...Default,
  args: { ...Default.args, marketPrice: "74309.7" },
};

export const AmountTooLow: Story = {
  ...Default,
  args: { ...Default.args, sellAmount: "10", buttonState: "AMOUNT_TOO_LOW", buttonText: "Amount Too Low" },
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const cardWrap = () => css`
  width: 500px;
  max-width: 100%;
`;

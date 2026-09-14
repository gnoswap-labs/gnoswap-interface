import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { css } from "@emotion/react";
import { fn } from "@storybook/test";
import { createStore, Provider } from "jotai";
import { swapConfirmModalState } from "@states/swap";
import { readySwapModal } from "./ConfirmSwapModal.fixture";

import ConfirmSwapModal from "./ConfirmSwapModal";

const meta = {
  title: "swap/ConfirmSwapModal",
  component: ConfirmSwapModal,
  tags: ["autodocs"],
} satisfies Meta<typeof ConfirmSwapModal>;

export default meta;
type Story = StoryObj<typeof ConfirmSwapModal>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof ConfirmSwapModal>) => {
    const store = createStore();
    store.set(swapConfirmModalState, readySwapModal);
    return (
      <Provider store={store}>
        <div css={wrapper}>
          <div css={contentWrap}>
            <ConfirmSwapModal {...args} />
          </div>
        </div>
      </Provider>
    );
  },
  args: {
    submitted: false,
    title: "Confirm Swap",
    isWrapOrUnwrap: false,
    priceImpactStatus: "LOW",
    isLoading: false,
    connectedWallet: true,
    setSwapRateAction: fn(),
    swapResult: null,
    swap: fn(),
    close: fn(),
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

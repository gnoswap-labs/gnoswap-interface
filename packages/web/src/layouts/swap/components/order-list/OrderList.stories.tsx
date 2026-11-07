import { css } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn, userEvent, within } from "@storybook/test";
import { createInstance } from "i18next";
import React, { useMemo, useState } from "react";
import { I18nextProvider } from "react-i18next";

import { STORY_GNOT_TOKEN, STORY_GNS_TOKEN } from "@components/order/common/order-story-fixtures";
import { DcaOrderModel } from "@models/order/dca-order-model";
import { OrderHistoryModel } from "@models/order/order-type";
import { formatOrderRoi } from "@utils/order-format-utils";

import enSwap from "../../../../../public/locales/en/Swap.json";
import DcaOrderItemCard from "./order-card/DcaOrderItemCard";
import OrderHistoryTable from "./order-history-table/OrderHistoryTable";
import OrderList from "./OrderList";

const NOW = Math.floor(Date.now() / 1000);

const PAST_DCA_ORDER: DcaOrderModel = {
  orderId: "1",
  packagePath: "gno.land/r/gnoswap/order/dca",
  isCurrentRealm: true,
  status: "COMPLETED",
  isActive: false,
  inputToken: STORY_GNS_TOKEN,
  outputToken: STORY_GNOT_TOKEN,
  interval: 60,
  executionCount: 8,
  executedCount: 8,
  remainingCount: 0,
  progress: 100,
  amountPerExecution: "4037500",
  depositAmount: "32300000",
  soldAmount: "32300000",
  purchasedAmount: "32300000",
  remainingAmount: "0",
  claimedAmount: "32300000",
  claimableAmount: "0",
  canClaim: false,
  priceRate: "0.921375",
  returnRate: 0,
  nextExecutionAt: null,
  createdAt: NOW - 3600,
  closedAt: Date.UTC(2024, 11, 25) / 1000,
  createdTxHash: "tx",
  closedTxHash: "tx",
};

const HISTORY: OrderHistoryModel[] = Array.from({ length: 8 }, (_, index) => ({
  key: `round-${index}`,
  txHash: `tx${index}`,
  time: NOW - 12 * 60,
  rate: "1.151437",
  soldAmount: "165.15",
  purchasedAmount: "152.15",
}));

/** The Past order list with Order History open, as in the order list design. */
const PastOrderList: React.FC = () => {
  const i18n = useMemo(() => {
    const instance = createInstance();
    instance.init({ lng: "en", initImmediate: false, resources: { en: { Swap: enSwap } } });
    return instance;
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <div css={wrapper}>
        <OrderList
          tab="past"
          changeTab={fn()}
          connectedWallet
          isLoading={false}
          isEmpty={false}
          currentPage={1}
          totalPages={1}
          changePage={fn()}
        >
          <DcaOrderItemCard
            order={PAST_DCA_ORDER}
            roi={formatOrderRoi(PAST_DCA_ORDER.returnRate)}
            txUrl=""
            onClickStop={fn()}
            onClickClaim={fn()}
            renderHistory={order => (
              <OrderHistoryTable
                items={HISTORY}
                inputToken={order.inputToken}
                outputToken={order.outputToken}
                currentPage={1}
                totalPages={1}
                changePage={fn()}
              />
            )}
          />
        </OrderList>
      </div>
    </I18nextProvider>
  );
};

const meta = {
  title: "swap/OrderList",
  component: PastOrderList,
} satisfies Meta<typeof PastOrderList>;

export default meta;
type Story = StoryObj<typeof PastOrderList>;

export const PastWithHistory: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /Order History/ }));
  },
};

export const Empty: Story = {
  render: function EmptyOrderList() {
    const [tab, setTab] = useState<"active" | "past">("active");
    const i18n = useMemo(() => {
      const instance = createInstance();
      instance.init({ lng: "en", initImmediate: false, resources: { en: { Swap: enSwap } } });
      return instance;
    }, []);

    return (
      <I18nextProvider i18n={i18n}>
        <div css={wrapper}>
          <OrderList
            tab={tab}
            changeTab={setTab}
            connectedWallet
            isLoading={false}
            isEmpty
            currentPage={1}
            totalPages={1}
            changePage={fn()}
          />
        </div>
      </I18nextProvider>
    );
  },
};

const wrapper = css`
  width: 500px;
`;

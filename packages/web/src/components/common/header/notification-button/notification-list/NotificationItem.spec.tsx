import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { NotificationType } from "@common/values";
import { TransactionModel } from "@models/account/account-history-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { OnchainToken } from "@repositories/activity/responses/activity-responses";
import { DexEvent, DexEventType } from "@repositories/common";
import { DEVICE_TYPE } from "@styles/media";

import NotificationItem from "./NotificationItem";

jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock("@hooks/common/use-gnoscan-url", () => ({ useGnoscanUrl: () => ({ getTxUrl: () => "" }) }));

const makeToken = (symbol: string, decimals: number): OnchainToken => ({
  type: "GRC20",
  chainId: "",
  createdAt: "",
  name: symbol,
  path: `gno.land/r/demo/${symbol.toLowerCase()}`,
  decimals,
  symbol,
  displaySymbol: symbol,
  logoURI: "",
  priceID: "",
});

const makeTx = (actionType: DexEventType, tokenAAmount: string, tokenBAmount: string): TransactionModel => {
  const tokenA = makeToken("GNS", 6);
  const tokenB = makeToken("FOO", 18);
  return {
    txType: NotificationType.Swap,
    txHash: "tx",
    tokenInfo: { tokenA, tokenB } as unknown as TransactionModel["tokenInfo"],
    status: "SUCCESS" as TransactionModel["status"],
    createdAt: "",
    rawValue: {
      txHash: "tx",
      actionType,
      tokenA,
      tokenB,
      tokenAAmount,
      tokenBAmount,
      totalUsd: "0",
      usedTokens: 2,
      account: "g1owner",
      time: "",
      success: true,
    },
  };
};

const renderItem = (tx: TransactionModel) =>
  render(
    <JotaiProvider>
      <GnoswapThemeProvider>
        <NotificationItem groups={{ type: "TODAY", txs: [tx] }} breakpoint={DEVICE_TYPE.WEB} />
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );

describe("NotificationItem order actions", () => {
  it.each([
    [DexEvent.DCA_ORDER, "Modal:notif.action.dcaOrdered"],
    [DexEvent.DCA_SWAP, "Modal:notif.action.dcaSwapped"],
    [DexEvent.DCA_STOP, "Modal:notif.action.dcaStopped"],
    [DexEvent.LIMIT_ORDER, "Modal:notif.action.limitOrdered"],
    [DexEvent.LIMIT_SWAP, "Modal:notif.action.limitSwapped"],
    [DexEvent.LIMIT_CANCEL, "Modal:notif.action.limitCancelled"],
    [DexEvent.LIMIT_EXPIRE, "Modal:notif.action.limitExpired"],
  ])("labels %s instead of Undefined Task", (actionType, label) => {
    const { container } = renderItem(makeTx(actionType, "1", "0"));
    expect(container.textContent).toContain(label);
    expect(container.textContent).not.toContain("Undefined Task");
  });

  it("reads a fill as token A for token B", () => {
    const { container } = renderItem(makeTx(DexEvent.DCA_SWAP, "3.5", "40.718631"));
    expect(container.textContent).toContain("3.5 GNS");
    expect(container.textContent).toContain("common:conjunction.for");
    expect(container.textContent).toContain("40.718631 FOO");
    expect(screen.queryByText(/conjunction\.and/)).toBeNull();
  });
});

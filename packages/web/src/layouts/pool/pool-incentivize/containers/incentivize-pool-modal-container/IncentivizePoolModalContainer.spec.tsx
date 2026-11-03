import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";

import IncentivizePoolModalContainer from "./IncentivizePoolModalContainer";

const POOL_PATH = "gno.land/r/demo/foo:gno.land/r/demo/bar:3000";

const getPoolStakingList = jest.fn();
const createExternalIncentive = jest.fn();
const enqueueEvent = jest.fn();

jest.mock("jotai", () => ({
  ...jest.requireActual("jotai"),
  useAtom: (atom: unknown) => {
    // Resolved lazily because @states imports jotai itself.
    const { EarnState } = jest.requireActual("@states/index");
    const values = new Map([
      [EarnState.period, 90],
      [EarnState.date, { year: 2026, month: 10, date: 1 }],
      [EarnState.dataModal, { token: { path: "gno.land/r/demo/atom", symbol: "ATOM" }, amount: "100" }],
      [EarnState.pool, { poolPath: POOL_PATH }],
    ]);
    return [values.get(atom), jest.fn()];
  },
}));
jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ poolRepository: { getPoolStakingList, createExternalIncentive } }),
}));
jest.mock("@hooks/common/use-transaction-event-store", () => ({
  useTransactionEventStore: () => ({ enqueueEvent }),
}));
jest.mock("@hooks/common/use-address", () => ({ useAddress: () => ({ address: "g1creator" }) }));
jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ walletClient: { getWalletType: () => "ADENA" } }),
}));
jest.mock("@hooks/common/use-broadcast-handler", () => ({
  useBroadcastHandler: () => ({
    broadcastSuccess: jest.fn(),
    broadcastError: jest.fn(),
    broadcastRejected: jest.fn(),
    broadcastLoading: jest.fn(),
  }),
}));
jest.mock("@hooks/common/use-clear-modal", () => ({ useClearModal: () => jest.fn() }));
jest.mock("@hooks/common/use-custom-router", () => ({
  __esModule: true,
  default: () => ({ pathname: "/pool/[pool-path]/incentivize", asPath: "", push: jest.fn() }),
}));
jest.mock("@hooks/common/use-message", () => ({ useMessage: () => ({ getMessage: jest.fn() }) }));
jest.mock("@hooks/common/use-transaction-confirm-modal", () => ({
  useTransactionConfirmModal: () => ({ openModal: jest.fn() }),
}));
jest.mock("@hooks/pool/data/use-position-data", () => ({ usePositionData: () => ({ refetch: jest.fn() }) }));
jest.mock("@hooks/token/data/use-token-data", () => ({
  useTokenData: () => ({ tokens: [], isFetched: true, updateBalances: jest.fn() }),
}));
jest.mock("@query/pools", () => ({
  ...jest.requireActual("@query/pools"),
  useGetIncentiveCreationDeposit: () => ({ data: "1000000000" }),
  useGetIncentivizePoolList: () => ({ refetch: jest.fn() }),
  useGetPoolList: () => ({ refetch: jest.fn() }),
  useRefetchGetPoolDetailByPath: () => ({ refetch: jest.fn() }),
}));
jest.mock("@query/pools/use-get-pool-staking-list-by-address", () => ({
  useGetPoolStakingListByAddress: () => ({ refetch: jest.fn() }),
}));
jest.mock("../../components/incentivize-pool-modal/IncentivizePoolModal", () => {
  // Stands in for the pool detail staking tooltip, which reads the same query.
  const PoolDetailRewards = () => {
    const { useGetPoolStakingListByPoolPath } = jest.requireActual("@query/pools");
    const { data = [] } = useGetPoolStakingListByPoolPath(POOL_PATH);
    return <span data-testid="pool-detail-rewards">{data.map((s: { symbol: string }) => s.symbol).join(",")}</span>;
  };
  const MockIncentivizePoolModal = ({ onSubmit }: { onSubmit: () => void }) => (
    <>
      <PoolDetailRewards />
      <button onClick={onSubmit}>Incentivize</button>
    </>
  );
  return { __esModule: true, default: MockIncentivizePoolModal };
});

describe("IncentivizePoolModalContainer", () => {
  beforeEach(() => jest.clearAllMocks());

  // GSW-2985: a newly created external reward was missing from the pool detail staking tooltip.
  it("refreshes the pool detail staking list once the incentive is indexed", async () => {
    let indexed = false;
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });

    getPoolStakingList.mockImplementation(async () =>
      indexed ? [{ symbol: "GNS" }, { symbol: "ATOM" }] : [{ symbol: "GNS" }],
    );
    createExternalIncentive.mockResolvedValue({ code: 0, data: { hash: "tx" } });

    render(
      <QueryClientProvider client={client}>
        <IncentivizePoolModalContainer poolPath={POOL_PATH} />
      </QueryClientProvider>,
    );
    await waitFor(() => expect(screen.getByTestId("pool-detail-rewards")).toHaveTextContent("GNS"));

    fireEvent.click(screen.getByText("Incentivize"));
    await waitFor(() => expect(enqueueEvent).toHaveBeenCalledTimes(1));

    indexed = true;
    await act(async () => {
      await enqueueEvent.mock.calls[0][0].onEmit();
    });

    await waitFor(() => expect(screen.getByTestId("pool-detail-rewards")).toHaveTextContent("GNS,ATOM"));
    client.clear();
  });
});

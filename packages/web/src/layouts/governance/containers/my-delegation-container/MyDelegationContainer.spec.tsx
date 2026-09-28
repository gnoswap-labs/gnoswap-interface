import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";

import {
  nullGovernanceSummaryInfo,
  nullMyDelegatesInfo,
  nullMyDelegationInfo,
  nullMyUnDelegatesInfo,
  nullVerifiedDelegatesInfo,
} from "@repositories/governance";

import MyDelegationContainer from "./MyDelegationContainer";

const getMyDelegation = jest.fn();
const sendDelegate = jest.fn();

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ governanceRepository: { getMyDelegation } }),
}));
jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ connected: true, account: { address: "g1sender" } }),
}));
jest.mock("@hooks/wallet/ui/use-connect-wallet-modal", () => ({
  useConnectWalletModal: () => ({ openModal: jest.fn() }),
}));
jest.mock("@hooks/token/data/use-token-data", () => ({
  useTokenData: () => ({ updateBalances: jest.fn() }),
}));
jest.mock("@hooks/governance/data/use-governance-tx", () => ({
  useGovernanceTx: () => ({
    delegateGNS: sendDelegate,
    undelegateGNS: sendDelegate,
    collectUndelegated: sendDelegate,
    collectReward: sendDelegate,
  }),
}));
jest.mock("@query/governance", () => ({
  ...jest.requireActual("@query/governance"),
  useGetGovernanceSummary: () => ({ data: nullGovernanceSummaryInfo, isFetched: true }),
  useGetMyDelegates: () => ({ data: nullMyDelegatesInfo }),
  useGetMyUnDelegates: () => ({ data: nullMyUnDelegatesInfo }),
  useGetVerifiedDelegates: () => ({ data: nullVerifiedDelegatesInfo, isFetched: true }),
}));
jest.mock("../../components/my-delegation/MyDelegation", () => {
  const { useGetMyDelegation } = jest.requireActual("@query/governance");
  const RecipientPower = () => {
    const { data: recipient } = useGetMyDelegation({ address: "g1recipient" });
    return <span data-testid="recipient-voting-power">{recipient?.votingPower}</span>;
  };
  const MockMyDelegation = ({
    myDelegationInfo,
    delegateGNS,
    undelegateGNS,
    collectUndelegated,
    collectReward,
  }: {
    myDelegationInfo: { delegatedAmount: string };
    delegateGNS: (name: string, address: string, amount: string) => void;
    undelegateGNS: (name: string, address: string, amount: string) => void;
    collectUndelegated: (amount: string) => void;
    collectReward: (amount: string, governance: [], launchpad: []) => void;
  }) => {
    const [recipientOpen, setRecipientOpen] = React.useState(true);
    return (
      <>
        <span data-testid="sender-delegated">{myDelegationInfo.delegatedAmount}</span>
        {recipientOpen && <RecipientPower />}
        {(
          [
            ["Delegate", () => delegateGNS("Recipient", "g1recipient", "1")],
            ["Undelegate", () => undelegateGNS("Recipient", "g1recipient", "1")],
            ["Collect undelegated", () => collectUndelegated("1")],
            ["Collect reward", () => collectReward("1", [], [])],
          ] as const
        ).map(([label, send]) => (
          <button
            key={label}
            onClick={() => {
              send();
              setRecipientOpen(false);
            }}
          >
            {label}
          </button>
        ))}
        <button onClick={() => setRecipientOpen(true)}>Reopen recipient</button>
      </>
    );
  };
  return { __esModule: true, default: MockMyDelegation };
});

describe("delegation refresh after indexing", () => {
  beforeEach(() => jest.clearAllMocks());

  it.each(["Delegate", "Undelegate", "Collect undelegated", "Collect reward"])(
    "%s refreshes the sender and a previously viewed recipient's voting power",
    async action => {
      let indexed = false;
      let onEmit: (() => Promise<void>) | undefined;
      const client = new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnMount: false } } });

      getMyDelegation.mockImplementation(async ({ address }) => ({
        ...nullMyDelegationInfo,
        delegatedAmount: address === "g1sender" && indexed ? "100" : "0",
        votingPower: address === "g1recipient" && indexed ? "100" : "0",
      }));
      sendDelegate.mockImplementation((...args) => {
        onEmit = args[args.length - 1];
      });

      const { unmount } = render(
        <QueryClientProvider client={client}>
          <MyDelegationContainer isOpenDelegateModal={false} setIsOpenDelegateModal={jest.fn()} />
        </QueryClientProvider>,
      );
      await waitFor(() => expect(getMyDelegation).toHaveBeenCalledTimes(2));
      expect(screen.getByTestId("recipient-voting-power")).toHaveTextContent("0");

      fireEvent.click(screen.getByText(action));
      fireEvent.click(screen.getByText("Reopen recipient"));
      await waitFor(() => expect(getMyDelegation).toHaveBeenCalledTimes(3));
      expect(screen.getByTestId("recipient-voting-power")).toHaveTextContent("0");
      indexed = true;
      await act(async () => {
        await onEmit?.();
      });

      await waitFor(() => expect(screen.getByTestId("sender-delegated")).toHaveTextContent("100"));
      await waitFor(() => expect(screen.getByTestId("recipient-voting-power")).toHaveTextContent("100"));
      unmount();
      client.clear();
    },
  );
});

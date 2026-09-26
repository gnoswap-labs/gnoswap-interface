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
const refetch = jest.fn(async () => undefined);

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
  useGovernanceTx: () => ({ delegateGNS: sendDelegate }),
}));
jest.mock("@query/governance", () => ({
  ...jest.requireActual("@query/governance"),
  useGetGovernanceSummary: () => ({ data: nullGovernanceSummaryInfo, isFetched: true, refetch }),
  useGetMyDelegates: () => ({ data: nullMyDelegatesInfo, refetch }),
  useGetMyUnDelegates: () => ({ data: nullMyUnDelegatesInfo, refetch }),
  useGetVerifiedDelegates: () => ({ data: nullVerifiedDelegatesInfo, isFetched: true, refetch }),
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
  }: {
    myDelegationInfo: { delegatedAmount: string };
    delegateGNS: (name: string, address: string, amount: string) => void;
  }) => {
    const [recipientOpen, setRecipientOpen] = React.useState(true);
    return (
      <>
        <span data-testid="sender-delegated">{myDelegationInfo.delegatedAmount}</span>
        {recipientOpen && <RecipientPower />}
        <button
          onClick={() => {
            delegateGNS("Recipient", "g1recipient", "1");
            setRecipientOpen(false);
          }}
        >
          Delegate
        </button>
        <button onClick={() => setRecipientOpen(true)}>Reopen recipient</button>
      </>
    );
  };
  return { __esModule: true, default: MockMyDelegation };
});

describe("delegation refresh after indexing", () => {
  it("updates the sender and the previously viewed recipient's voting power", async () => {
    let indexed = false;
    let onEmit: (() => Promise<void>) | undefined;
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnMount: false } } });

    getMyDelegation.mockImplementation(async ({ address }) => ({
      ...nullMyDelegationInfo,
      delegatedAmount: address === "g1sender" && indexed ? "100" : "0",
      votingPower: address === "g1recipient" && indexed ? "100" : "0",
    }));
    sendDelegate.mockImplementation((_name, _address, _amount, callback) => {
      onEmit = callback;
    });

    const { unmount } = render(
      <QueryClientProvider client={client}>
        <MyDelegationContainer isOpenDelegateModal={false} setIsOpenDelegateModal={jest.fn()} />
      </QueryClientProvider>,
    );
    await waitFor(() => expect(getMyDelegation).toHaveBeenCalledTimes(2));
    expect(screen.getByTestId("recipient-voting-power")).toHaveTextContent("0");

    fireEvent.click(screen.getByText("Delegate"));
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
  });
});

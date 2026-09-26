import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";

import {
  nullProposalDetailsInfo,
  nullProposalItemInfo,
  nullProposalsInfo,
  nullUserVotingInfo,
  nullVotingInfo,
} from "@repositories/governance";

import ProposalListContainer from "./ProposalListContainer";

const getProposals = jest.fn();
const getProposalDetails = jest.fn();
const sendVote = jest.fn();

jest.mock("next/router", () => ({
  useRouter: () => ({ query: {}, pathname: "/governance", replace: jest.fn() }),
}));
jest.mock("@hooks/common/use-window-size", () => ({
  useWindowSize: () => ({ breakpoint: "web" }),
}));
jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ governanceRepository: { getProposals, getProposalDetails } }),
}));
jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ connected: true, account: { address: "g1voter" }, isSwitchNetwork: false }),
}));
jest.mock("@hooks/wallet/ui/use-connect-wallet-modal", () => ({
  useConnectWalletModal: () => ({ openModal: jest.fn() }),
}));
jest.mock("@hooks/governance/ui/use-create-proposal-modal", () => ({
  useCreateProposalModal: () => ({ openModal: jest.fn() }),
}));
jest.mock("@hooks/governance/data/use-governance-tx", () => ({
  useGovernanceTx: () => ({ voteProposal: sendVote }),
}));
jest.mock("@query/governance", () => ({
  ...jest.requireActual("@query/governance"),
  useGetProposalParameters: () => ({
    data: { packages: [], functions: [], proposalCreationThreshold: "0" },
    isFetched: true,
  }),
  useGetMyDelegation: () => ({ data: undefined }),
}));
jest.mock("../../components/proposals-list/ProposalList", () => {
  const { useGetProposalDetails } = jest.requireActual("@query/governance");
  const MockProposalList = ({
    voteProposal,
    proposalList,
    address,
  }: {
    voteProposal: (id: number, yes: boolean) => void;
    proposalList: { votingInfo: { yesVotingWeight: string }; userVotingInfo: { isVoted: boolean } }[];
    address: string;
  }) => {
    const [detailOpen, setDetailOpen] = React.useState(true);
    const { data } = useGetProposalDetails({ proposalId: detailOpen ? 1 : 0, address });
    return (
      <>
        <span data-testid="list-votes">{proposalList[0]?.votingInfo.yesVotingWeight}</span>
        <span data-testid="list-voted">{proposalList[0]?.userVotingInfo.isVoted ? "yes" : "no"}</span>
        {detailOpen && <span data-testid="detail-voted">{data?.proposal.userVotingInfo.isVoted ? "yes" : "no"}</span>}
        <button
          onClick={() => {
            voteProposal(1, true);
            setDetailOpen(false);
          }}
        >
          Vote
        </button>
        <button onClick={() => setDetailOpen(true)}>Reopen details</button>
      </>
    );
  };
  return { __esModule: true, default: MockProposalList };
});

describe("proposal refresh after a vote", () => {
  it("updates both the list and an already reopened proposal detail when indexing completes", async () => {
    let indexed = false;
    let onEmit: (() => Promise<void>) | undefined;
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnMount: false } } });

    getProposals.mockImplementation(async () => ({
      ...nullProposalsInfo,
      proposals: [
        {
          ...nullProposalItemInfo,
          id: 1,
          votingInfo: { ...nullVotingInfo, yesVotingWeight: indexed ? "100" : "0" },
          userVotingInfo: { ...nullUserVotingInfo, isVoted: indexed, voteType: indexed ? "YES" : "" },
        },
      ],
    }));
    getProposalDetails.mockImplementation(async () => ({
      proposal: {
        ...nullProposalDetailsInfo.proposal,
        id: 1,
        userVotingInfo: { ...nullUserVotingInfo, isVoted: indexed, voteType: indexed ? "YES" : "" },
      },
    }));
    sendVote.mockImplementation((_id, _yes, callback) => {
      onEmit = callback;
    });

    const { unmount } = render(
      <QueryClientProvider client={client}>
        <ProposalListContainer />
      </QueryClientProvider>,
    );

    await waitFor(() => expect(screen.getByTestId("list-votes")).toHaveTextContent("0"));
    expect(screen.getByTestId("list-voted")).toHaveTextContent("no");
    await waitFor(() => expect(getProposalDetails).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByText("Vote"));
    fireEvent.click(screen.getByText("Reopen details"));
    await waitFor(() => expect(getProposalDetails).toHaveBeenCalledTimes(2));
    expect(screen.getByTestId("detail-voted")).toHaveTextContent("no");

    indexed = true;
    await act(async () => {
      await onEmit?.();
    });

    await waitFor(() => expect(screen.getByTestId("list-votes")).toHaveTextContent("100"));
    await waitFor(() => expect(screen.getByTestId("list-voted")).toHaveTextContent("yes"));
    await waitFor(() => expect(screen.getByTestId("detail-voted")).toHaveTextContent("yes"));
    unmount();
    client.clear();
  });
});

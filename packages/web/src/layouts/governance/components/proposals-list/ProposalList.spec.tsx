import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import ProposalList, { ProposalListProps } from "./ProposalList";

describe("ProposalList Component", () => {
  it("ProposalList render", () => {
    const mockProps: ProposalListProps = {
      myVotingWeight: 0,
      proposalCreationThreshold: 0,
      isShowActiveOnly: false,
      toggleIsShowActiveOnly: () => null,
      proposalList: [],
      isConnected: false,
      address: "",
      breakpoint: "web",
      cancelProposal: (id: number) => {
        console.log(id);
      },
      connectWallet: () => null,
      executeProposal: (id: number) => {
        console.log(id);
      },
      openCreateProposalModal: () => {
        console.log("open");
      },
      executableFunctions: [],
      fetchMore: () => null,
      isSwitchNetwork: false,
      proposeCommunityPoolSpendProposal: (
        title: string,
        description: string,
        tokenPath: string,
        toAddress: string,
        amount: string,
      ) => {
        console.log(title, description, tokenPath, toAddress, amount);
      },
      proposeParamChangeProposal: (
        title: string,
        description: string,
        variables: {
          pkgPath: string;
          func: string;
          param: string;
        }[],
      ) => {
        console.log(title, description, variables);
      },
      proposeTextProposal: (title: string, description: string) => {
        console.log(title, description);
      },
      selectedProposalId: 0,
      setSelectedProposalId: () => null,
      switchNetwork: () => null,
      voteProposal: (proposalId: number, voteYes: boolean) => {
        console.log(proposalId, voteYes);
      },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <ProposalList {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});

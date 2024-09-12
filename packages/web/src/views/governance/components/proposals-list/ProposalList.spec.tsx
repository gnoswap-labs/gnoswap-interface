import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

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
      fetchMore: () => null,
      isOpenCreateModal: true,
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
      proposeParamChnageProposal: (
        title: string,
        description: string,
        pkgPath: string,
        functionName: string,
        param: string,
      ) => {
        console.log(title, description, pkgPath, functionName, param);
      },
      proposeTextProposal: (title: string, description: string) => {
        console.log(title, description);
      },
      selectedProposalId: 0,
      setIsOpenCreateModal: () => null,
      setSelectedProposalId: () => null,
      switchNetwork:() => null,
      voteProposal:(proposalId: number, voteYes: boolean) => {
        console.log(proposalId, voteYes);
      }
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

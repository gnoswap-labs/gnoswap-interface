import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { DEVICE_TYPE } from "@styles/media";

import CreateProposalModal, {
  CreateProposalModalProps,
} from "./CreateProposalModal";


describe("CreateProposalModal Component", () => {
  it("CreateProposalModal render", () => {
    const mockProps: CreateProposalModalProps = {
      breakpoint: DEVICE_TYPE.WEB,
      setIsOpenCreateModal: () => null,
      myVotingWeight: 0,
      proposalCreationThreshold: 1000,
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
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <CreateProposalModal {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});

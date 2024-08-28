import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import GetProposalsResponseMock from "@repositories/governance/mock/get-proposals-response.json";
import { DEVICE_TYPE } from "@styles/media";

import ViewProposalModal, { ViewProposalModalProps } from "./ViewProposalModal";

describe("ViewProposalModal Component", () => {
  it("ViewProposalModal render", () => {
    const mockProps: ViewProposalModalProps = {
      breakpoint: DEVICE_TYPE.WEB,
      proposalDetail: GetProposalsResponseMock[0],
      setSelectedProposalId: () => null,
      isConnected: true,
      isSwitchNetwork: false,
      handleSelectVote: () => null,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <ViewProposalModal {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});

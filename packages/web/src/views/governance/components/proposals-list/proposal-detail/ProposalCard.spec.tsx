import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import GetProposalsResponseMock from "@repositories/governance/mock/get-proposals-response.json";

import ProposalCard from "./ProposalCard";

describe("ProposalCard Component", () => {
  it("ProposalCard render", () => {
    const mockProps = {
      proposalDetail: GetProposalsResponseMock[0],
      onClickProposalDetail: (id: string) => {
        console.log(id);
      },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <ProposalCard {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>
    );
  });
});

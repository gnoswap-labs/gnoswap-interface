import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import ProposalList from "./ProposalList";

describe("ProposalList Component", () => {
  it("ProposalList render", () => {
    const mockProps = {
      isShowCancelled: false,
      toggleShowCancelled: () => null,
      proposalList: [],
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <ProposalList {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>
    );
  });
});

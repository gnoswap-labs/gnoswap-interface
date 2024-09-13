import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import ProposalList from "./ProposalList";

describe("ProposalList Component", () => {
  it("ProposalList render", () => {
    const mockProps = {
      isShowActiveOnly: false,
      toggleIsShowActiveOnly: () => null,
      proposalList: [],
      isConnected: false,
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

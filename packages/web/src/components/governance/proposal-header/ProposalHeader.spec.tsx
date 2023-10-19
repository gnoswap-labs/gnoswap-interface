import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import ProposalHeader from "./ProposalHeader";

describe("ProposalHeader Component", () => {
  it("ProposalHeader render", () => {
    const mockProps = {
      isShowCancelled: false,
      toggleShowCancelled: () => null,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <ProposalHeader {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>
    );
  });
});

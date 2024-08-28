import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import ProposalHeader, { ProposalHeaderProps } from "./ProposalHeader";

describe("ProposalHeader Component", () => {
  it("ProposalHeader render", () => {
    const mockProps: ProposalHeaderProps = {
      isShowActiveOnly: false,
      toggleIsShowActiveOnly: () => null,
      isDisabledCreateButton: false,
      setIsShowCreateProposal: () => {
        console.log("test");
      },
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

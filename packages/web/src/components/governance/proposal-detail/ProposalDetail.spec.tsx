import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import ProposalDetail from "./ProposalDetail";

describe("ProposalDetail Component", () => {
  it("ProposalDetail render", () => {
    const mockProps = {
      proposalDetail: {
        id: "1",
        title: "#7 Proposal Title",
        label: "Community Pool Spend",
        status: "ACTIVE",
        timeEnd: "Voting Ends in 9 hours (2023-08-01, 12:00:00 UTC+9)",
        abstainOfQuorum: 30,
        noOfQuorum: 20,
        yesOfQuorum: 50,
        currentValue: 20000000,
        maxValue: 40000000,
        votingPower: 0,
        icon: "",
        currency: "",
        description: "",
        typeVote: "",
      },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <ProposalDetail {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>
    );
  });
});

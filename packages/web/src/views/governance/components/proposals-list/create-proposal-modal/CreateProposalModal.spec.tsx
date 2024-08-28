import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import CreateProposalModal from "./CreateProposalModal";
import { DEVICE_TYPE } from "@styles/media";

describe("CreateProposalModal Component", () => {
  it("CreateProposalModal render", () => {
    const mockProps = {
      breakpoint: DEVICE_TYPE.WEB,
      setIsOpenCreateModal: () => null,
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

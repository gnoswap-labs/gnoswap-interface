import Modal from "./Modal";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("Modal Component", () => {
  it("Modal render", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <Modal>
            <p>Modal Test</p>
          </Modal>
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});

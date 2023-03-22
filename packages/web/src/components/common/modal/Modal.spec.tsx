import Modal from "./Modal";
import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@/providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("Modal Component", () => {
  it("Modal render", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <Modal>
            <p>Modal Test</p>
          </Modal>
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});

import LoadMoreButton from "./LoadMoreButton";
import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@/providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("LoadMoreButton Component", () => {
  it("should render", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <LoadMoreButton show={true} onClick={() => {}} />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});

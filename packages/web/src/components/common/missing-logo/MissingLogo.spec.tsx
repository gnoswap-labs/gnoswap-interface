import { fireEvent, render, screen } from "@testing-library/react";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import MissingLogo from "./MissingLogo";

describe("MissingLogo", () => {
  it("replaces a failed position image with its ID and accepts a later working URL", () => {
    const { rerender } = render(
      <GnoswapThemeProvider>
        <MissingLogo symbol="ID #7" url="/broken.svg" width={24} mobileWidth={24} />
      </GnoswapThemeProvider>,
    );
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByText("ID")).toBeInTheDocument();

    rerender(
      <GnoswapThemeProvider>
        <MissingLogo symbol="ID #7" url="/working.svg" width={24} mobileWidth={24} />
      </GnoswapThemeProvider>,
    );
    expect(screen.getByRole("img")).toHaveAttribute("src", "/working.svg");
  });
});

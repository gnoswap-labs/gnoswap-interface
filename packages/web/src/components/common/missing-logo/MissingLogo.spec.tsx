import { fireEvent, render, screen } from "@testing-library/react";
import IconLpToken from "@components/common/icons/IconLpToken";
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

  it("shows the LP icon for an empty or failed image URL and accepts a later working URL", () => {
    const { rerender } = render(
      <GnoswapThemeProvider>
        <MissingLogo symbol="ID #7" url="" fallback={<IconLpToken />} width={24} mobileWidth={24} />
      </GnoswapThemeProvider>,
    );
    expect(screen.getByRole("img", { name: "LP position" })).toBeInTheDocument();

    rerender(
      <GnoswapThemeProvider>
        <MissingLogo symbol="ID #7" url="/broken.svg" fallback={<IconLpToken />} width={24} mobileWidth={24} />
      </GnoswapThemeProvider>,
    );
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByRole("img", { name: "LP position" })).toBeInTheDocument();

    rerender(
      <GnoswapThemeProvider>
        <MissingLogo symbol="ID #7" url="/working.svg" fallback={<IconLpToken />} width={24} mobileWidth={24} />
      </GnoswapThemeProvider>,
    );
    expect(screen.getByRole("img", { name: "logo" })).toHaveAttribute("src", "/working.svg");
  });
});

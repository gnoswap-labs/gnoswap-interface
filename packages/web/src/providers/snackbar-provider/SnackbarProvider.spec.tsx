import React, { useContext } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import SnackbarProvider, { SnackbarContext } from "./SnackbarProvider";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

it("updates the open receive badge amount and unwrap action instead of stacking another badge", () => {
  const unwrapFirst = jest.fn();
  const unwrapLatest = jest.fn();

  const Controls = () => {
    const { enqueue } = useContext(SnackbarContext);
    return (
      <>
        <button
          onClick={() =>
            enqueue(
              { title: "Wrapped GNOT", description: "Convert <span>1 wGNOT</span>", onClick: unwrapFirst },
              { id: 1, type: "receive-wugnot", timeout: 0, closeable: true },
            )
          }
        >
          first swap
        </button>
        <button
          onClick={() =>
            enqueue(
              { title: "Wrapped GNOT", description: "Convert <span>2 wGNOT</span>", onClick: unwrapLatest },
              { id: 2, type: "receive-wugnot", timeout: 0, closeable: true },
            )
          }
        >
          second swap
        </button>
      </>
    );
  };
  render(
    <JotaiProvider>
      <GnoswapThemeProvider>
        <SnackbarProvider>
          <Controls />
        </SnackbarProvider>
      </GnoswapThemeProvider>
    </JotaiProvider>,
  );

  fireEvent.click(screen.getByRole("button", { name: "first swap" }));
  expect(screen.getByText("1 wGNOT")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "second swap" }));
  expect(screen.queryByText("1 wGNOT")).not.toBeInTheDocument();
  expect(screen.getAllByText("Wrapped GNOT")).toHaveLength(1);
  fireEvent.click(screen.getByText("2 wGNOT"));
  expect(unwrapLatest).toHaveBeenCalledTimes(1);
  expect(unwrapFirst).not.toHaveBeenCalled();
});

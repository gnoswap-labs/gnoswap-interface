import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import { useGnoscanUrl } from "./use-gnoscan-url";

const txHash = "ebKeJB6fEOh9BO2MJk1+aNdPmR5BEjVBavhbb42ZL/4=";

describe("useGnoscanUrl", () => {
  it("encodes URL-sensitive transaction hash characters once", () => {
    const Probe = () => {
      const { getTxUrl } = useGnoscanUrl();

      return <output data-testid="tx-url">{getTxUrl(txHash)}</output>;
    };

    render(
      <JotaiProvider>
        <Probe />
      </JotaiProvider>,
    );

    const txUrl = screen.getByTestId("tx-url").textContent || "";
    expect(txUrl).toContain(`txhash=${encodeURIComponent(txHash)}`);
    expect(txUrl).not.toContain(`txhash=${txHash}`);
  });
});

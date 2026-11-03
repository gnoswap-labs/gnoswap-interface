import React from "react";

/**
 * Shown when the RPC provider could not be created.
 *
 * This renders outside the `loadedProviders` gate of `GnoswapServiceProvider`,
 * so it cannot rely on anything mounted below it — the theme provider, the
 * Gnoswap context and the error boundary are all descendants. That is why the
 * styling is inline and the copy is not translated.
 */
const RpcConnectionFailed: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div
    role="alert"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      minHeight: "100vh",
      padding: 24,
      textAlign: "center",
      backgroundColor: "#141519",
      color: "#E0E8F4",
      fontFamily: "sans-serif",
    }}
  >
    <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Unable to reach the network</h1>
    <p style={{ fontSize: 14, margin: 0, color: "#90A2C0" }}>
      We could not connect to the RPC node. Check your connection and try again.
    </p>
    <button
      type="button"
      onClick={onRetry}
      style={{
        marginTop: 8,
        padding: "10px 24px",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 600,
        backgroundColor: "#0059FF",
        color: "#FFFFFF",
      }}
    >
      Retry
    </button>
  </div>
);

export default RpcConnectionFailed;

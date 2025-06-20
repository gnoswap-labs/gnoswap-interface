import { ABCIResponse, RPCRequest, RPCResponse } from "@gnolang/tm2-js-client";

export const postABCIResponse = async (url: string, body: RPCRequest): Promise<RPCResponse<ABCIResponse>> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

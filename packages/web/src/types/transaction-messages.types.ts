import { MsgAddPackage, MsgCall, MsgSend } from "@gnolang/gno-js-client";
import { MsgRun } from "@gnolang/gno-js-client/bin/proto/gno/vm";

export type EMessageType = "/bank.MsgSend" | "/vm.m_call" | "/vm.m_addpkg" | "/vm.m_run";

export type TMessage = MsgAddPackage | MsgCall | MsgSend | MsgRun;

export interface ContractMessage {
  type: EMessageType;
  value: TMessage;
}

export interface Document {
  chain_id: string;
  account_number: string;
  sequence: string;
  fee: {
    amount: {
      denom: string;
      amount: string;
    }[];
    gas: string;
    granter?: string;
    payer?: string;
  };
  msgs: ContractMessage[];
  memo: string;
}

export interface TransactionData {
  messages: readonly ContractMessage[];
  contracts: {
    type: string;
    function: string;
    value: {
      caller?: string;
      send?: string;
      pkg_path?: string;
      func?: string;
      args?: string[] | null;
      from_address?: string;
      to_address?: string;
      amount?: string;
      creator?: string;
      package?: unknown;
      deposit?: string;
    };
  }[];
  gasWanted: string;
  gasFee: string;
  memo: string;
  document: Document;
}

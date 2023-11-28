/* eslint-disable @typescript-eslint/no-unused-vars */
import { FunctionSignature, GnoProvider } from "@gnolang/gno-js-client";
import {
  BlockInfo,
  BlockResult,
  NetworkInfo,
  ConsensusParams,
  Status,
  Tx,
  BroadcastTransactionMap,
  BroadcastAsGeneric,
} from "@gnolang/tm2-js-client";

export class GnoProviderMock implements GnoProvider {
  constructor() {}

  getRenderOutput(
    packagePath: string,
    path: string,
    height?: number | undefined,
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getFunctionSignatures(
    packagePath: string,
    height?: number | undefined,
  ): Promise<FunctionSignature[]> {
    throw new Error("Method not implemented.");
  }
  evaluateExpression(
    packagePath: string,
    expression: string,
    height?: number | undefined,
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getFileContent(
    packagePath: string,
    height?: number | undefined,
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getBalance(
    address: string,
    denomination?: string | undefined,
    height?: number | undefined,
  ): Promise<number> {
    throw new Error("Method not implemented.");
  }
  getAccountSequence(
    address: string,
    height?: number | undefined,
  ): Promise<number> {
    throw new Error("Method not implemented.");
  }
  getAccountNumber(
    address: string,
    height?: number | undefined,
  ): Promise<number> {
    throw new Error("Method not implemented.");
  }
  getBlock(height: number): Promise<BlockInfo> {
    throw new Error("Method not implemented.");
  }
  getBlockResult(height: number): Promise<BlockResult> {
    throw new Error("Method not implemented.");
  }
  getBlockNumber(): Promise<number> {
    throw new Error("Method not implemented.");
  }
  getNetwork(): Promise<NetworkInfo> {
    throw new Error("Method not implemented.");
  }
  getConsensusParams(height: number): Promise<ConsensusParams> {
    throw new Error("Method not implemented.");
  }
  getStatus(): Promise<Status> {
    throw new Error("Method not implemented.");
  }
  getGasPrice(): Promise<number> {
    throw new Error("Method not implemented.");
  }
  estimateGas(tx: Tx): Promise<number> {
    throw new Error("Method not implemented.");
  }
  sendTransaction<K extends keyof BroadcastTransactionMap>(
    tx: string,
    endpoint: K,
  ): Promise<BroadcastAsGeneric<K>["result"]> {
    throw new Error("Method not implemented.");
  }
  waitForTransaction(
    hash: string,
    fromHeight?: number | undefined,
    timeout?: number | undefined,
  ): Promise<Tx> {
    throw new Error("Method not implemented.");
  }
}

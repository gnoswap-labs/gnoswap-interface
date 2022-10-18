export interface AbciQuery {
  response: {
    ResponseBase: {
      Error: string | null;
      Data: string;
      Events: string | null;
      Log: string | null;
      Info: string | null;
    };
    Key: string | null;
    Value: string | null;
    Proof: string | null;
    Height: number;
  };
}

export interface AllowedExternalRewardTokenResponse {
  tokenPath: string;
  minRewardAmount: string;
}

export interface AllowedExternalRewardTokensResponse {
  data: {
    tokens: AllowedExternalRewardTokenResponse[];
  };
}

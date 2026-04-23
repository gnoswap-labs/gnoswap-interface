export enum QUERY_KEY {
  // common
  initLoading = "initLoading",
  avgBlockTime = "avgBlockTime",
  notifications = "notifications",
  transactionEvents = "transactionEvents",
  createTransactionDocument = "createTransactionDocuments",
  // address
  username = "username",
  accountGnotTokenBalance = "accountGnotTokenBalance",
  // dashboard
  dashboardToken = "dashboardToken",
  dashboardGovernanceOverview = "dashboardGovernanceOverview",
  dashboardTvl = "dashboardTvl",
  dashboardVolume = "dashboardVolume",
  dashboardActivities = "dashboardActivities",
  // governance
  governanceSummary = "governanceSummary",
  governanceMyDelegation = "governanceMyDelegation",
  governanceProposals = "governanceProposals",
  governanceExecutableFunctions = "governanceExecutableFunctions",
  governanceCommunityPoolBalances = "governanceCommunityPoolBalances",
  governanceMyDelegates = "governanceMyDelegates",
  governanceMyUnDelegates = "governanceMyUnDelegates",
  governanceProposalDetails = "governanceProposalDetails",
  governanceProposalParameters = "governanceProposalParameters",
  governanceVerifiedDelegates = "governanceVerifiedDelegates",

  // leaderboard
  leaderboardList = "leaderboardList",
  leaderboardListByAddress = "leaderboardListByAddress",
  updateLeaderboardHiddenState = "updateLeaderboardHiddenState",
  leaderboardNextUpdate = "leaderboardNextUpdate",
  leaderboard = "leaderboard",
  // pools
  pools = "pools",
  rpcPools = "rpcPools",
  poolCreationFee = "poolCreationFee",
  poolDetail = "pool_details",
  bins = "bins",
  poolPairBins = "poolPairBins",
  prices = "prices",
  lazyBins = "lazyBins",
  initializeBins = "initializeBins",
  incentivizePools = "incentivizePools",
  poolBins = "poolBins",
  poolWithdrawalFee = "pool_withdrawal_fee",
  unstakingFee = "unstaking_fee",
  poolStakingList = "pool_staking_list",
  lastedBlockHeight = "lasted_block_height",
  removeExternalIncentive = "remove_external_incentive",
  poolLiquidity = "pool_liquidity",
  poolTicks = "pool_ticks",
  poolTickSpacing = "pool_tick_spacing",
  poolSqrtPriceX96 = "pool_sqrt_price_x96",
  poolFromDb = "pool_from_db",
  // positions
  positions = "positions",
  positionRewards = "positionRewards",
  positionHistory = "positionHistory",
  poolPositions = "poolPositions",
  estimateReposition = "estimateReposition",
  positionBins = "positionBins",
  positionLazyBins = "positionLazyBins",
  positionDetail = "positionDetail",
  // swap
  swapHistory = "swap-history",
  // router
  router = "swap-estimate-router",
  swapFee = "swap-fee",
  // token
  tokens = "tokens",
  tokenPrices = "token_prices",
  tokenPricesByPath = "token_prices_by_path",
  tokenDetails = "token_details",
  chain = "chain",
  tokenByPath = "token",
  tokenBalancesByAddress = "balances",

  // launchpad
  launchpadSummary = "launchpad_summary",
  launchpadActiveProjects = "launchpad_active_projects",
  launchpadProjects = "launchpad_projects",
  launchpadProjectDetails = "launchpad_project_details",
  launchpadParticipationInfos = "launchpad_participation_infos",

  // gas
  gasPrice = "gas_price",
  gasInfo = "gas_info",

  // faucet
  faucetNativeIsSupported = "faucetNative/isSupported",
  faucetGRC20IsSupported = "faucetGRC20/isSupported",
}

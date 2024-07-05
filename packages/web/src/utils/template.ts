export const mapMessageByTemplate = (template: string, data: object) => {
  let mappedTemplate = template;
  // Replace placeholders in the template with data values
  for (const [key, value] of Object.entries(data)) {
    mappedTemplate = mappedTemplate.replace(`{${key}}`, value);
  }
  return mappedTemplate;
};

export const PEDING_NOTIFICATION_CLAIM_MESSAGE_TEMPLATE = `
  <div>
    Claiming 
    <span>{amount}</span>
  </div>
  `;
export const SUCCESS_NOTIFICATION_CLAIM_MESSAGE_TEMPLATE = `
  <div>
    Claimed 
    <span>{amount}</span>
  </div>
  `;
export const ERROR_NOTIFICATION_CLAIM_MESSAGE_TEMPLATE = `
  <div>
    Failed to Claim 
    <span>{amount}</span>
  </div>
  `;
/* SWAP */
export const PEDING_NOTIFICATION_SWAP_MESSAGE_TEMPLATE = `
  <div>
    Swapping 
    <span>{tokenA}</span> 
    <span>{tokenASymbol}</span> 
    and 
    <span>{tokenB}</span> 
    <span>{tokenBSymbol}</span>
  </div>
  `;
export const SUCCESS_NOTIFICATION_SWAP_MESSAGE_TEMPLATE = `
  <div>
    Swapped 
    <span>{tokenA}</span> 
    <span>{tokenASymbol}</span> 
    and 
    <span>{tokenB}</span> 
    <span>{tokenBSymbol}</span>
  </div>
  `;
export const ERROR_NOTIFICATION_SWAP_MESSAGE_TEMPLATE = `
  <div>
    Failed to swap 
    <span>{tokenA}</span> 
    <span>{tokenASymbol}</span> 
    and 
    <span>{tokenB}</span> 
    <span>{tokenBSymbol}</span>
  </div>
  `;

/* STAKE */
export const PEDING_NOTIFICATION_STAKE_MESSAGE_TEMPLATE = `
  <div>
    Staking 
    <span>{tokenAAmount}</span> 
    <span>{tokenASymbol}</span> 
    and 
    <span>{tokenBAmount}</span> 
    <span>{tokenBSymbol}</span>
  </div>
  `;
export const SUCCESS_NOTIFICATION_STAKE_MESSAGE_TEMPLATE = `
  <div>
    Staked 
    <span>{tokenAAmount}</span> 
    <span>{tokenASymbol}</span> 
    and 
    <span>{tokenBAmount}</span> 
    <span>{tokenBSymbol}</span>
  </div>
  `;
export const ERROR_NOTIFICATION_STAKE_MESSAGE_TEMPLATE = `
  <div>
    Failed to stake 
    <span>{tokenAAmount}</span> 
    <span>{tokenASymbol}</span> 
    and 
    <span>{tokenBAmount}</span> 
    <span>{tokenBSymbol}</span>
  </div>
  `;

/* UNSTAKE */
export const PEDING_NOTIFICATION_UNSTAKE_MESSAGE_TEMPLATE = `
  <div>
    Unstaking 
    <span>{tokenAAmount}</span> 
    <span>{tokenASymbol}</span> 
    and 
    <span>{tokenBAmount}</span> 
    <span>{tokenBSymbol}</span>
  </div>
  `;
export const SUCCESS_NOTIFICATION_UNSTAKE_MESSAGE_TEMPLATE = `
  <div>
    Unstaked 
    <span>{tokenAAmount}</span> 
    <span>{tokenASymbol}</span> 
    and 
    <span>{tokenBAmount}</span> 
    <span>{tokenBSymbol}</span>
  </div>
  `;
export const ERROR_NOTIFICATION_UNSTAKE_MESSAGE_TEMPLATE = `
  <div>
    Failed to unstake 
    <span>{tokenAAmount}</span> 
    <span>{tokenASymbol}</span> 
    and 
    <span>{tokenBAmount}</span> 
    <span>{tokenBSymbol}</span>
  </div>
  `;

/* REMOVE */
export const PEDING_NOTIFICATION_REMOVE_MESSAGE_TEMPLATE = `
  <div>
    Removing 
    <span>{tokenAAmount}</span> 
    <span>{tokenASymbol}</span> 
    and 
    <span>{tokenBAmount}</span> 
    <span>{tokenBSymbol}</span>
  </div>
  `;
export const SUCCESS_NOTIFICATION_REMOVE_MESSAGE_TEMPLATE = `
  <div>
    Removed 
    <span>{tokenAAmount}</span> 
    <span>{tokenASymbol}</span> 
    and 
    <span>{tokenBAmount}</span> 
    <span>{tokenBSymbol}</span>
  </div>
  `;
export const ERROR_NOTIFICATION_REMOVE_MESSAGE_TEMPLATE = `
  <div>
    Failed to remove 
    <span>{tokenAAmount}</span> 
    <span>{tokenASymbol}</span> 
    and 
    <span>{tokenBAmount}</span> 
    <span>{tokenBSymbol}</span>
  </div>
  `;

/* ADD_INCENTIVIZE */
export const PEDING_NOTIFICATION_ADD_INCENTIVIZE_MESSAGE_TEMPLATE = `
  <div>
    Adding 
    <span>{tokenAmount}</span> 
    <span>{tokenSymbol}</span> 
    as incentives
  </div>
  `;
export const SUCCESS_NOTIFICATION_ADD_INCENTIVIZE_MESSAGE_TEMPLATE = `
  <div>
    Added 
    <span>{tokenAmount}</span> 
    <span>{tokenSymbol}</span> 
    as incentives
  </div>
  `;
export const ERROR_NOTIFICATION_ADD_INCENTIVIZE_MESSAGE_TEMPLATE = `
  <div>
    Failed to add 
    <span>{tokenAmount}</span> 
    <span>{tokenSymbol}</span> 
    as incentives
  </div>
  `;

/* WITHDRAW */
export const PEDING_NOTIFICATION_WITHDRAW_MESSAGE_TEMPLATE = `
  <div>
    Sending 
    <span>{tokenAmount}</span> 
    <span>{tokenSymbol}</span>
  </div>
  `;
export const SUCCESS_NOTIFICATION_WITHDRAW_MESSAGE_TEMPLATE = `
  <div>
    Sent 
    <span>{tokenAmount}</span> 
    <span>{tokenSymbol}</span>
  </div>
  `;
export const ERROR_NOTIFICATION_WITHDRAW_MESSAGE_TEMPLATE = `
  <div>
    Failed to send 
    <span>{tokenAmount}</span> 
    <span>{tokenSymbol}</span>
  </div>
  `;

/* ADD_LIQUIDITY */
export const PEDING_NOTIFICATION_ADD_LIQUIDITY_MESSAGE_TEMPLATE = `
  Adding 
    <span>{tokenAAmount}</span> 
    <span>{tokenASymbol}</span> 
    and 
    <span>{tokenBAmount}</span> 
    <span>{tokenBSymbol}</span>
  `;
export const SUCCESS_NOTIFICATION_ADD_LIQUIDITY_MESSAGE_TEMPLATE = `
  <div>
    Added 
    <span>{tokenAAmount}</span> 
    <span>{tokenASymbol}</span> 
    and 
    <span>{tokenBAmount}</span> 
    <span>{tokenBSymbol}</span>
  </div>
  `;
export const ERROR_NOTIFICATION_ADD_LIQUIDITY_MESSAGE_TEMPLATE = `
  <div>
    Failed to add 
    <span>{tokenAAmount}</span> 
    <span>{tokenASymbol}</span> 
    and 
    <span>{tokenBAmount}</span> 
    <span>{tokenBSymbol}</span>
  </div>
  `;

/* WRAP TOKEN */
export const PEDING_NOTIFICATION_WRAP_TOKEN_MESSAGE_TEMPLATE = `
  Wrapping
    <span>{tokenAAmount}</span> 
    <span>{tokenASymbol}</span> 
    to 
    <span>{tokenBAmount}</span> 
    <span>{tokenBSymbol}</span>
  `;
export const SUCCESS_NOTIFICATION_WRAP_TOKEN_MESSAGE_TEMPLATE = `
  <div>
    Wrapped 
    <span>{tokenAAmount}</span> 
    <span>{tokenASymbol}</span> 
    to 
    <span>{tokenBAmount}</span> 
    <span>{tokenBSymbol}</span>
  </div>
  `;
export const ERROR_NOTIFICATION_WRAP_TOKEN_MESSAGE_TEMPLATE = `
  <div>
    Failed to wrap 
    <span>{tokenAAmount}</span> 
    <span>{tokenASymbol}</span> 
    to 
    <span>{tokenBAmount}</span> 
    <span>{tokenBSymbol}</span>
  </div>
  `;

/* UNWRAP TOKEN */
export const PEDING_NOTIFICATION_UNWRAP_TOKEN_MESSAGE_TEMPLATE = `
  Unwrapping
    <span>{tokenAAmount}</span> 
    <span>{tokenASymbol}</span> 
    to 
    <span>{tokenBAmount}</span> 
    <span>{tokenBSymbol}</span>
  `;
export const SUCCESS_NOTIFICATION_UNWRAP_TOKEN_MESSAGE_TEMPLATE = `
  <div>
    Unwrapped 
    <span>{tokenAAmount}</span> 
    <span>{tokenASymbol}</span> 
    to 
    <span>{tokenBAmount}</span> 
    <span>{tokenBSymbol}</span>
  </div>
  `;
export const ERROR_NOTIFICATION_UNWRAP_TOKEN_MESSAGE_TEMPLATE = `
  <div>
    Failed to unwrap 
    <span>{tokenAAmount}</span> 
    <span>{tokenASymbol}</span> 
    to 
    <span>{tokenBAmount}</span> 
    <span>{tokenBSymbol}</span>
  </div>
  `;

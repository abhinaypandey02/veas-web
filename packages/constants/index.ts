export enum ChatStreamRole {
  Tool = 0,
  Response = 1,
  Error = 2,
}

export const MESSAGE_CHAR_LIMIT = 200;
export const MAX_TOKEN_LIMIT = 450;

export const MAXIMUM_MESSAGES = {
  FREE_TIER: 5,
  FREE_DAILY_LIMIT: 1,
  PRO_DAILY_LIMIT: 10,
};

export const ERROR_MESSAGES = {
  FREE_LIMIT_REACHED: "FREE_LIMIT_REACHED",
  PRO_LIMIT_REACHED: "PRO_LIMIT_REACHED",
};

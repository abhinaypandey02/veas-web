export enum ChatStreamRole {
  Tool = 0,
  Response = 1,
  Error = 2,
}

export const MAXIMUM_MESSAGES = {
  BETA: 5,
};

export const ERROR_MESSAGES = {
  BETA: "BETA_LIMIT_REACHED",
};

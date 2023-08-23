import { get_encoding } from "@dqbd/tiktoken";

const PARENT_MAX_TOKENS = Number(process.env.PARENT_MAX_TOKENS);

const countTokens = (content: string): number => {
  const encoding = get_encoding("cl100k_base");
  const numTokens = encoding.encode(content).length;
  encoding.free();
  return numTokens;
};

export const isExcedesMaxTokens = (content: string): boolean => {
  const numTokens = countTokens(content);
  return numTokens > PARENT_MAX_TOKENS;
};

export const countWords = (content: string): number => {
  return content.trim().split(/\s+/).length;
};

export const regex = {
  evmAddress: /^(\b0x[a-fA-F0-9]{40}\b)/g,
  number: /^([1-9]|[1-9]\d{1,3}|10000)$/g,
  slug: /^[a-z0-9]+-?(?:-[a-z0-9]+-?)*$/g,
  handle: /^(\w+|@?\w+|@)$/g,
  alphanumeric: /^\w+$/g,
  website:
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
  bytecode: /a264[a-zA-Z0-9]{98}0033$/g,
  cleanBytecode: /a264[a-zA-Z0-9]{98}0033$/g,
};

export type Crypto = {
  name?: string;
  holdings?: number;
  price?: number;
  total?: number;
};

export type CryptoWithToken = {
  [key: string]: Crypto;
};

export type BalanceTotalsResponse = {
  currencies: CryptoWithToken;
  total: number;
};

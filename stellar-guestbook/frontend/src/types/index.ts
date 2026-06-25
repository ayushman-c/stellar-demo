export interface GuestbookMessage {
  wallet: string;
  text: string;
  timestamp: number;
  txHash?: string;
}

export interface WalletInfo {
  address: string;
  network: string;
  balance: string;
}

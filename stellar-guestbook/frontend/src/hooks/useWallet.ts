import { useState, useCallback, useEffect } from "react";
import { WalletInfo } from "../types";
import {
  checkFreighterConnection,
  requestWalletAccess,
  getWalletAddress,
  getNetworkDetails,
} from "../utils/freighter";

const HORIZON_URL =
  import.meta.env.VITE_HORIZON_URL || "https://horizon-testnet.stellar.org";

export function useWallet() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const connected = await checkFreighterConnection();
    if (connected) {
      try {
        const address = await getWalletAddress();
        if (!address) return;
        const { network } = await getNetworkDetails();
        const balance = await fetchBalance(address);
        setWalletInfo({ address, network, balance });
      } catch {
        // Not connected
      }
    }
  };

  const fetchBalance = async (address: string): Promise<string> => {
    try {
      const res = await fetch(`${HORIZON_URL}/accounts/${address}`);
      if (!res.ok) return "0.0000 XLM";
      const data = await res.json();
      const nativeBalance = data.balances?.find(
        (b: { asset_type: string }) => b.asset_type === "native"
      );
      return nativeBalance
        ? parseFloat(nativeBalance.balance).toFixed(4) + " XLM"
        : "0.0000 XLM";
    } catch {
      return "0.0000 XLM";
    }
  };

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const connected = await checkFreighterConnection();
      if (!connected) {
        throw new Error(
          "Freighter wallet not detected. Please install Freighter."
        );
      }
      const address = await requestWalletAccess();
      const { network } = await getNetworkDetails();
      const balance = await fetchBalance(address);
      setWalletInfo({ address, network, balance });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWalletInfo(null);
  }, []);

  return { walletInfo, isConnecting, error, connect, disconnect };
}

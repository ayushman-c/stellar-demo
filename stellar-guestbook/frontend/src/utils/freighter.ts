import {
  isConnected,
  requestAccess,
  getAddress,
  getNetworkDetails as getFreighterNetworkDetails,
} from "@stellar/freighter-api";

export const checkFreighterConnection = async (): Promise<boolean> => {
  try {
    const result = await isConnected();
    return result.isConnected;
  } catch {
    return false;
  }
};

export const requestWalletAccess = async (): Promise<string> => {
  try {
    const result = await requestAccess();
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.address;
  } catch (e) {
    throw new Error("Failed to connect wallet: " + (e as Error).message);
  }
};

export const getWalletAddress = async (): Promise<string> => {
  try {
    const { address, error } = await getAddress();
    if (error) {
      throw new Error(error.message);
    }
    return address;
  } catch (e) {
    throw new Error("Failed to get wallet address: " + (e as Error).message);
  }
};

export const getNetworkDetails = async (): Promise<{
  network: string;
  networkPassphrase: string;
  sorobanRpcUrl?: string;
}> => {
  try {
    const details = await getFreighterNetworkDetails();
    return {
      network: details.network ?? "TESTNET",
      networkPassphrase:
        details.networkPassphrase ??
        "Test SDF Network ; September 2015",
      sorobanRpcUrl: details.sorobanRpcUrl,
    };
  } catch {
    return {
      network: "TESTNET",
      networkPassphrase: "Test SDF Network ; September 2015",
    };
  }
};

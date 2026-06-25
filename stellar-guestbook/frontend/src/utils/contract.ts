import {
  rpc,
  Contract,
  TransactionBuilder,
  BASE_FEE,
  nativeToScVal,
  scValToNative,
} from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";
import { GuestbookMessage } from "../types";

const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID || "";
const RPC_URL =
  import.meta.env.VITE_RPC_URL || "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE =
  import.meta.env.VITE_NETWORK_PASSPHRASE ||
  "Test SDF Network ; September 2015";
const FALLBACK_ACCOUNT =
  import.meta.env.VITE_FALLBACK_ACCOUNT ||
  "GCWBVEJQTGKPZUUDAV6UOP7GCFJMNSJIKYSAFX72RK22ZQXHJGDXOSO7";

const server = new rpc.Server(RPC_URL);
const contract = new Contract(CONTRACT_ID);

export const addMessage = async (
  walletAddress: string,
  text: string
): Promise<string> => {
  if (!CONTRACT_ID) {
    throw new Error("Contract not deployed. Set VITE_CONTRACT_ID in .env");
  }

  const timestamp = BigInt(Math.floor(Date.now() / 1000));

  const account = await server.getAccount(walletAddress);

  const operation = contract.call(
    "add_message",
    nativeToScVal(walletAddress),
    nativeToScVal(text),
    nativeToScVal(timestamp, { type: "u64" })
  );

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build();

  const preparedTx = await server.prepareTransaction(transaction);

  const { signedTxXdr, error: signError } = await signTransaction(
    preparedTx.toXDR(),
    {
      networkPassphrase: NETWORK_PASSPHRASE,
    }
  );

  if (signError) {
    throw new Error("Transaction signing failed: " + signError.message);
  }

  const signedTransaction = TransactionBuilder.fromXDR(
    signedTxXdr,
    NETWORK_PASSPHRASE
  );

  const sendResponse = await server.sendTransaction(signedTransaction);

  if (sendResponse.status === "ERROR") {
    throw new Error("Transaction submission failed");
  }

  return sendResponse.hash;
};

export const getMessages = async (
  walletAddress: string
): Promise<GuestbookMessage[]> => {
  if (!CONTRACT_ID) {
    return [];
  }

  try {
    let account;
    try {
      account = await server.getAccount(walletAddress);
    } catch {
      account = await server.getAccount(FALLBACK_ACCOUNT);
    }

    const operation = contract.call("get_messages");

    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    const sim = await server.simulateTransaction(transaction);

    if ("error" in sim) return [];
    if (!sim.result?.retval) {
      return [];
    }

    const raw = scValToNative(sim.result.retval) as Array<{
      wallet: string;
      text: string;
      timestamp: number | bigint;
    }>;

    return raw.map((entry) => ({
      wallet: entry.wallet,
      text: entry.text,
      timestamp: Number(entry.timestamp),
    }));
  } catch (e) {
    console.error("Failed to fetch messages:", e);
    return [];
  }
};

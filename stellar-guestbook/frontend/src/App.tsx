import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "./hooks/useWallet";
import { addMessage } from "./utils/contract";
import Layout from "./components/Layout";
import ConnectWallet from "./components/ConnectWallet";
import WalletInfo from "./components/WalletInfo";
import MessageInput from "./components/MessageInput";
import MessageFeed from "./components/MessageFeed";

export default function App() {
  const { walletInfo, isConnecting, error, connect, disconnect } =
    useWallet();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState<string | null>(null);

  const submitMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!walletInfo) throw new Error("Wallet not connected");
      await addMessage(walletInfo.address, message);
    },
    onSuccess: () => {
      setSuccess("Message submitted to the blockchain!");
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      setTimeout(() => setSuccess(null), 5000);
    },
    onError: (err: Error) => {
      setSuccess(null);
      alert("Failed to submit: " + err.message);
    },
  });

  return (
    <Layout>
      {success && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          {success}
        </div>
      )}

      {!walletInfo ? (
        <ConnectWallet
          onConnect={connect}
          isConnecting={isConnecting}
          error={error}
        />
      ) : (
        <>
          <WalletInfo info={walletInfo} onDisconnect={disconnect} />
          <MessageInput
            onSubmit={(msg) => submitMutation.mutateAsync(msg)}
            isSubmitting={submitMutation.isPending}
          />
          <MessageFeed walletAddress={walletInfo.address} />
        </>
      )}
    </Layout>
  );
}

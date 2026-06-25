interface ConnectWalletProps {
  onConnect: () => void;
  isConnecting: boolean;
  error: string | null;
}

export default function ConnectWallet({
  onConnect,
  isConnecting,
  error,
}: ConnectWalletProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center mb-6">
        <span className="text-3xl">✍️</span>
      </div>
      <h2 className="text-3xl font-bold mb-2">Stellar Guestbook</h2>
      <p className="text-gray-400 text-center max-w-md mb-8">
        Leave your message permanently on the Stellar Blockchain
      </p>
      <button
        onClick={onConnect}
        disabled={isConnecting}
        className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 shadow-lg shadow-purple-600/25"
      >
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>
      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm max-w-md">
          {error}
        </div>
      )}
      <div className="mt-6 flex gap-2 text-xs text-gray-600">
        <span>Powered by</span>
        <a
          href="https://freighter.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 underline"
        >
          Freighter Wallet
        </a>
        <span>&</span>
        <a
          href="https://stellar.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline"
        >
          Stellar
        </a>
      </div>
    </div>
  );
}

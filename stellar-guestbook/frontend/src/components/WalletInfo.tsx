import { WalletInfo as WalletInfoType } from "../types";

interface WalletInfoProps {
  info: WalletInfoType;
  onDisconnect: () => void;
}

export default function WalletInfo({ info, onDisconnect }: WalletInfoProps) {
  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 mb-8">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          Wallet
        </h3>
        <button
          onClick={onDisconnect}
          className="text-xs text-gray-500 hover:text-red-400 transition-colors"
        >
          Disconnect
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-sm font-mono text-gray-300">
            {shortenAddress(info.address)}
          </span>
          <button
            onClick={() => navigator.clipboard.writeText(info.address)}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            title="Copy address"
          >
            📋
          </button>
        </div>
        <div className="flex gap-6">
          <div>
            <span className="text-xs text-gray-500">Network</span>
            <p className="text-sm font-medium text-cyan-400">{info.network}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Balance</span>
            <p className="text-sm font-medium text-purple-400">
              {info.balance}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

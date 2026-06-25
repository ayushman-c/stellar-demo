import { GuestbookMessage } from "../types";

interface MessageCardProps {
  message: GuestbookMessage;
  index: number;
}

export default function MessageCard({ message, index }: MessageCardProps) {
  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const formatTimestamp = (ts: number): string => {
    const date = new Date(ts * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 hover:bg-white/[0.06] transition-all duration-300 animate-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center text-xs font-bold text-gray-300">
            {shortenAddress(message.wallet).slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-mono text-gray-400">
              {shortenAddress(message.wallet)}
            </p>
          </div>
        </div>
        <span className="text-xs text-gray-500">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
      <p className="text-gray-200 leading-relaxed">{message.text}</p>
      {message.txHash && (
        <p className="mt-3 text-xs text-gray-600 font-mono truncate">
          tx: {message.txHash}
        </p>
      )}
    </div>
  );
}

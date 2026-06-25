import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../utils/contract";
import MessageCard from "./MessageCard";

interface MessageFeedProps {
  walletAddress: string;
}

export default function MessageFeed({ walletAddress }: MessageFeedProps) {
  const {
    data: messages,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["messages"],
    queryFn: () => getMessages(walletAddress),
    enabled: !!walletAddress,
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
          Guestbook Feed
        </h3>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 animate-pulse"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-white/5" />
              <div className="h-4 w-32 bg-white/5 rounded" />
            </div>
            <div className="h-4 w-full bg-white/5 rounded mb-2" />
            <div className="h-4 w-3/4 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6">
        <p className="text-red-400 text-sm">
          Failed to load messages.{" "}
          <button
            onClick={() => refetch()}
            className="underline hover:text-red-300"
          >
            Try again
          </button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          Guestbook Feed
        </h3>
        <button
          onClick={() => refetch()}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          title="Refresh"
        >
          ↻ Refresh
        </button>
      </div>
      {messages && messages.length > 0 ? (
        <div className="space-y-4">
          {[...messages].reverse().map((msg, i) => (
            <MessageCard key={i} message={msg} index={i} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-12 text-center">
          <p className="text-gray-500 text-sm">
            No messages yet. Be the first to sign!
          </p>
        </div>
      )}
    </div>
  );
}

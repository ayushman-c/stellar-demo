import { useState } from "react";

interface MessageInputProps {
  onSubmit: (message: string) => Promise<void>;
  isSubmitting: boolean;
}

const MAX_MESSAGE_LENGTH = 200;

export default function MessageInput({
  onSubmit,
  isSubmitting,
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;
    await onSubmit(message.trim());
    setMessage("");
  };

  const charsRemaining = MAX_MESSAGE_LENGTH - message.length;
  const isValid = message.trim().length > 0 && charsRemaining >= 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 mb-8"
    >
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
        Write a Message
      </h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Leave your message on the blockchain..."
        maxLength={MAX_MESSAGE_LENGTH}
        rows={3}
        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
      />
      <div className="flex items-center justify-between mt-3">
        <span
          className={`text-xs ${
            charsRemaining < 20
              ? "text-red-400"
              : charsRemaining < 50
                ? "text-yellow-400"
                : "text-gray-500"
          }`}
        >
          {charsRemaining} characters remaining
        </span>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-all duration-200 shadow-lg shadow-purple-600/25"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </span>
          ) : (
            "Submit to Blockchain"
          )}
        </button>
      </div>
    </form>
  );
}

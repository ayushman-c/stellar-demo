import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <header className="border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-lg font-bold">
              ✦
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Stellar Guestbook
              </h1>
              <p className="text-xs text-gray-500">
                Leave your message permanently on the Stellar Blockchain
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

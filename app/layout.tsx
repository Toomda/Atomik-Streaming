import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/next-auth";
import dynamic from "next/dynamic";
import { DirectMessageProvider } from "@/context/direct-message-context";
import { getDirectMessages } from "@/actions/direct-message";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Atomik Streaming",
  description: "Let's Play",
};

const SocketConnection = dynamic(() => import("./socket-connection"), {
  ssr: false,
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SocketConnection username={session?.user.username} />
        <DirectMessageProvider username={session?.user.username}>
          <SessionProvider session={session}>
            <ThemeProvider
              attribute="class"
              forcedTheme="dark"
              storageKey="atomik-theme"
            >
              <Toaster theme="light" position="bottom-center" />
              {children}
            </ThemeProvider>
          </SessionProvider>
        </DirectMessageProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Orbitron, Roboto } from "next/font/google";
import "./globals.scss";
import styles from "@/app/_styles/rootLayout.module.scss";
import { ThemeProvider } from "next-themes";
import Header from "./_ui/Header";
import { Toaster } from "react-hot-toast";
import { QueryClient } from "@tanstack/react-query";
import ReactQueryProvider from "./_context/ReactQueryProvider";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { template: "%s - The Game List", default: "The Game List" },
  description: "Browse thousands of games, courtesy of IGDB, and track them in a list!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // time until data re-fetch in miliseconds
      },
    },
  });
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} ${orbitron.variable}`}>
        <ReactQueryProvider>
          <ThemeProvider>
            <div className={styles.layout}>
              <Header />
              <main className={styles.main}>
                <div className={styles.container}>{children}</div>
              </main>
            </div>
          </ThemeProvider>
          <Toaster
            position="bottom-right"
            gutter={12}
            containerStyle={{ margin: "8px" }}
            toastOptions={{
              success: { duration: 3000 },
              error: { duration: 6000 },
              style: {
                fontSize: "16px",
                maxWidth: "500px",
                padding: "16px 24px",
                backgroundColor: "var(--color-grey-200)",
                color: "var(--color-grey-900)",
              },
            }}
          />
          <div id="hoverTooltip"></div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

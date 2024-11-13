import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "~/lib/utils";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Kanapa",
  description:
    "A syntax highlighting code block component based on shiki for use with React Server Components",
  authors: [{ name: "Matt Hamlin", url: "https://matthamlin.me" }],
};

function themeCheck() {
  let prefersDarkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  let preferred = prefersDarkModeQuery.matches ? "dark" : "light";
  document.documentElement.classList.add(preferred);
  prefersDarkModeQuery.addEventListener("change", (e) => {
    let newPreferred = e.matches ? "dark" : "light";
    document.documentElement.classList.remove(preferred);
    document.documentElement.classList.add(newPreferred);
    preferred = newPreferred;
  });
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          suppressHydrationWarning
          // biome-ignore lint/security/noDangerouslySetInnerHtml: need to inject the script contents
          dangerouslySetInnerHTML={{
            __html: `(${themeCheck.toString()})()`,
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}

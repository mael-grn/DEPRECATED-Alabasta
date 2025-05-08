import type { Metadata } from "next";
import "./globals.css";
import TransitionWrapper from "@/app/components/transitions";

export const metadata: Metadata = {
  title: "Alabasta",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
      >
      <TransitionWrapper>
          {children}
      </TransitionWrapper>

      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import NavSidebar from "@/components/NavSidebar";
import SearchBar from "@/components/SearchBar";
import AuthGate from "@/components/AuthGate";

export const metadata: Metadata = {
  title: "ZoomRx Knowledge Portal",
  description: "Account & TA Intelligence Hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthGate>
          <Header />
          <NavSidebar />
          <SearchBar />
          <div className="app-main">{children}</div>
        </AuthGate>
      </body>
    </html>
  );
}

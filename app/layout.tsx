import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: "Network Engineer Virtual Lab",
  description:
    "Platform belajar networking dari nol sampai enterprise network virtual — GNS3, MikroTik CHR, FortiGate, VLAN, fiber optic, Zabbix, Grafana, dan network automation.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id">
      <body>
        <TopNav />
        {children}
      </body>
    </html>
  );
}

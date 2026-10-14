"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/kurikulum", label: "Kurikulum" },
  { href: "/part-01", label: "Part 01" },
];

export default function TopNav() {
  const pathname = usePathname();
  return (
    <nav className="topnav">
      <div className="topnav-in">
        <Link className="brand" href="/">
          NE·VirtualLab
        </Link>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={"nl" + (pathname === l.href ? " on" : "")}
          >
            {l.label}
          </Link>
        ))}
        <span className="dbtag">PostgreSQL · lokal</span>
      </div>
    </nav>
  );
}

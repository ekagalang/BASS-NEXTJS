"use client";

import Link from "next/link";
import { useState } from "react";

interface HoverLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  hoverColor?: string;
  defaultColor?: string;
}

export default function HoverLink({
  href,
  children,
  className = "",
  hoverColor = "#DA1E1E",
  defaultColor = "inherit",
}: HoverLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      className={className}
      style={{
        color: isHovered ? hoverColor : defaultColor,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}

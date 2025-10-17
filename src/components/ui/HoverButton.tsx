"use client";

import Link from "next/link";
import { useState } from "react";

interface HoverButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  defaultBg?: string;
  hoverBg?: string;
  style?: React.CSSProperties;
}

export function HoverButton({
  href,
  children,
  className = "",
  defaultBg = "#DA1E1E",
  hoverBg = "#D91E43",
  style = {},
}: HoverButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      className={className}
      style={{
        ...style,
        backgroundColor: isHovered ? hoverBg : defaultBg,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}

interface HoverAnchorProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  defaultBg?: string;
  hoverBg?: string;
  defaultColor?: string;
  hoverColor?: string;
  target?: string;
  rel?: string;
  style?: React.CSSProperties;
}

export function HoverAnchor({
  href,
  children,
  className = "",
  defaultBg = "transparent",
  hoverBg = "white",
  defaultColor = "white",
  hoverColor = "#DA1E1E",
  target,
  rel,
  style = {},
}: HoverAnchorProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={className}
      style={{
        ...style,
        backgroundColor: isHovered ? hoverBg : defaultBg,
        color: isHovered ? hoverColor : defaultColor,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </a>
  );
}

// ============================================
// LOADING COMPONENT
// Reusable loading spinner
// ============================================

import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function Loading({ size = "md", text }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-primary-600`}
      />
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
}

// Full page loading
export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loading size="lg" text="Memuat..." />
    </div>
  );
}

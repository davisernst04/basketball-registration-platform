"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface UserAvatarProps {
  src?: string | null;
  fallback?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function UserAvatar({ src, fallback, className, size = "md" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 28,
    xl: 40,
  };

  return (
    <Avatar className={cn(sizeClasses[size], "border border-white/10 bg-zinc-900", className)}>
      <AvatarImage src={src || ""} className="object-cover" />
      <AvatarFallback className="bg-zinc-900 text-zinc-500">
        <User size={iconSizes[size]} strokeWidth={1.5} />
      </AvatarFallback>
    </Avatar>
  );
}
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setRole(profile?.role || "parent");
      }
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        getUser();
      } else {
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      className="border-b border-red-900/30 bg-black/70 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 h-16 md:h-20"
    >
      <div className="h-full mx-auto px-6 md:px-16 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src="/logo.jpg"
            alt="Shadow Basketball Logo"
            width={50}
            height={50}
            className="object-contain md:w-[60px]"
          />
          <span className="font-impact text-xl md:text-2xl text-white tracking-wider hidden sm:inline-block">
            SHADOW BASKETBALL
          </span>
        </div>

        <nav className="flex items-center gap-4 md:gap-6">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    href={role === "admin" ? "/dashboard" : "/parent-dashboard"}
                    className={`text-sm font-medium transition-colors hover:text-red-500 ${
                      pathname.includes("dashboard")
                        ? "text-red-500"
                        : "text-gray-300"
                    }`}
                  >
                    Dashboard
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="h-8 w-8 cursor-pointer border border-red-900/50">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-red-950 text-red-500 text-xs">
                          {user.email?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-zinc-950 border-zinc-800 text-zinc-300"
                    >
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <DropdownMenuItem
                        className="cursor-pointer focus:bg-red-950 focus:text-white"
                        onClick={() =>
                          router.push(
                            role === "admin"
                              ? "/dashboard"
                              : "/parent-dashboard",
                          )
                        }
                      >
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer focus:bg-red-950 focus:text-white"
                        onClick={() => router.push("/profile")}
                      >
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer focus:bg-red-950 focus:text-white"
                        onClick={() => router.push("/tryouts")}
                      >
                        Tryouts
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <DropdownMenuItem
                        className="cursor-pointer text-red-500 focus:bg-red-950 focus:text-red-400"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div 
                  className="flex items-center gap-2 md:gap-3"
                >
                  <Button
                    onClick={() => router.push("/sign-in")}
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-zinc-900 text-sm md:text-base px-4"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => router.push("/sign-up")}
                    size="sm"
                    className="bg-red-600 text-white hover:bg-red-700 text-sm md:text-base px-4 rounded-lg"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
}

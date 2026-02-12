"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/shadow/UserAvatar";
import { User } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{
    role: string;
    avatarUrl: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("role, avatar_url")
          .eq("id", user.id)
          .single();

        if (profileData) {
          setProfile({
            role: profileData.role || "parent",
            avatarUrl: profileData.avatar_url,
          });
        }
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
        setUser(null);
        setProfile(null);
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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-white/5 bg-black/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 h-16 md:h-20"
    >
      <div className="h-full max-w-8xl mx-auto px-6 md:px-16 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-3 group transition-opacity active:opacity-80"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Image
              src="/logo.jpg"
              alt="Shadow Basketball Logo"
              width={60}
              height={60}
              className="object-contain md:w-[50px]"
            />
          </motion.div>
          <span className="font-impact text-xl md:text-2xl text-white tracking-widest uppercase hidden sm:inline-block">
            SHADOW <span className="text-primary">BASKETBALL</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 md:gap-8">
          {!loading && (
            <AnimatePresence mode="wait">
              {user ? (
                <motion.div
                  key="user-nav"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-6"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="cursor-pointer"
                      >
                        <UserAvatar
                          src={profile?.avatarUrl}
                          fallback={user.email}
                          size="sm"
                        />
                      </motion.div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-card border-border text-zinc-300"
                    >
                      <DropdownMenuLabel className="text-zinc-500 text-[10px] uppercase tracking-widest font-black">
                        My Account
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-zinc-800/50" />
                      <DropdownMenuItem
                        className="cursor-pointer  uppercase font-impact tracking-wider"
                        onClick={() => router.push("/profile")}
                      >
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer  uppercase font-impact tracking-wider"
                        onClick={() =>
                          router.push(
                            profile?.role === "admin"
                              ? "/dashboard"
                              : "/dashboard",
                          )
                        }
                      >
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-800/50" />
                      <DropdownMenuItem
                        className="cursor-pointer text-primary  uppercase font-impact tracking-wider"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ) : (
                <motion.div
                  key="guest-nav"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3"
                >
                  <Button
                    onClick={() => router.push("/sign-in")}
                    variant="outline"
                    size="sm"
                    className="text-zinc-400 text-xs uppercase font-bold tracking-widest px-4"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => router.push("/sign-up")}
                    size="sm"
                    className="bg-primary text-white text-xs uppercase font-bold tracking-widest px-6"
                  >
                    Sign Up
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </nav>
      </div>
    </motion.header>
  );
}

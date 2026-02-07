"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message || "Something went wrong.");
      setLoading(false);
    } else {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();
      
      const target = profile?.role === 'admin' ? "/dashboard" : "/parent-dashboard";
      router.push(target);
      router.refresh();
    }
  }

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-8 cursor-pointer" 
        onClick={() => router.push("/")}
      >
        <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-md" />
        <span className="font-impact text-2xl text-white tracking-widest uppercase">SHADOW BASKETBALL</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md"
      >
        <Card className="bg-zinc-950 border-zinc-800 rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1 p-8 border-b border-zinc-900">
            <CardTitle className="text-3xl font-impact tracking-wider text-white text-center uppercase">Welcome Back</CardTitle>
            <CardDescription className="text-zinc-500 text-center uppercase text-[10px] font-bold tracking-[0.2em] mt-2">
              Athletes start their journey here
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 p-8">
              {error && (
                <div className="bg-red-950/30 border border-red-900 p-4 rounded-xl flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-wide">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest ml-1">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@email.com"
                  required
                  className="bg-black border-zinc-800 text-white focus:border-red-600 h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest ml-1">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="bg-black border-zinc-800 text-white focus:border-red-600 h-12 rounded-xl"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-6 p-8 bg-zinc-900/30 border-t border-zinc-900">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-impact text-xl h-14 rounded-xl transition-all active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" /> : "SIGN IN"}
              </Button>
              <div className="text-xs text-center text-zinc-500 uppercase font-bold tracking-widest">
                Need an account?{" "}
                <Link href="/sign-up" className="text-red-500 hover:text-red-400">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </main>
  );
}
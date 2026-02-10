"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SignUpPage() {
 const router = useRouter();
 const [error, setError] = useState<string | null>(null);
 const [success, setSuccess] = useState(false);
 const [loading, setLoading] = useState(false);
 const supabase = createClient();

 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError(null);
  setLoading(true);

  const formData = new FormData(e.currentTarget);
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signUp({
   email,
   password,
   options: {
    data: {
     full_name: name,
    },
   },
  });

  if (error) {
   setError(error.message || "Something went wrong.");
   setLoading(false);
  } else {
   setSuccess(true);
   setLoading(false);
   setTimeout(() => router.push("/parent-dashboard"), 3000);
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
    <Card className="bg-card border-border rounded-2xl overflow-hidden">
     <CardHeader className="space-y-1 p-8 border-b border-zinc-900">
      <CardTitle className="text-3xl font-impact tracking-wider text-white text-center uppercase">Create Account</CardTitle>
      <CardDescription className="text-zinc-500 text-center uppercase text-[10px] font-bold tracking-[0.2em] mt-2">
       Join the Shadow legacy today
      </CardDescription>
     </CardHeader>
     {success ? (
      <CardContent className="space-y-6 p-12 text-center">
       <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-green-950/30 border border-green-900 p-8 rounded-3xl flex flex-col items-center gap-4 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.1)]"
       >
        <CheckCircle2 size={64} strokeWidth={1.5} />
        <div className="space-y-2">
         <h3 className="text-2xl font-impact tracking-wide uppercase">Elite Access Granted</h3>
         <p className="text-sm text-green-600/80 font-medium">Your account has been created. We are preparing your personal dashboard...</p>
        </div>
       </motion.div>
       <Button 
        className="w-full bg-zinc-800 text-white font-bold h-12 rounded-xl" 
        onClick={() => router.push("/parent-dashboard")}
       >
        GO TO DASHBOARD
       </Button>
      </CardContent>
     ) : (
      <form onSubmit={handleSubmit}>
       <CardContent className="space-y-6 p-8">
        {error && (
         <div className="bg-red-950/30 border border-red-900 p-4 rounded-xl flex items-center gap-3 text-primary text-xs font-bold uppercase tracking-wide">
          <AlertCircle size={18} />
          {error}
         </div>
        )}
        <div className="space-y-2">
         <Label htmlFor="name" className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest ml-1">Full Name</Label>
         <Input
          id="name"
          name="name"
          placeholder="Coach John"
          required
          className="bg-black border-border text-white focus:border-primary h-12 rounded-xl"
         />
        </div>
        <div className="space-y-2">
         <Label htmlFor="email" className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest ml-1">Email Address</Label>
         <Input
          id="email"
          name="email"
          type="email"
          placeholder="m@example.com"
          required
          className="bg-black border-border text-white focus:border-primary h-12 rounded-xl"
         />
        </div>
        <div className="space-y-2">
         <Label htmlFor="password" className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest ml-1">Secure Password</Label>
         <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="bg-black border-border text-white focus:border-primary h-12 rounded-xl"
         />
         <p className="text-[10px] text-zinc-700 uppercase font-black tracking-tighter px-1">Min. 8 characters required</p>
        </div>
       </CardContent>
       <CardFooter className="flex flex-col space-y-6 p-8 bg-black border-t border-zinc-900">
        <Button
         type="submit"
         disabled={loading}
         className="w-full bg-primary text-white font-impact text-xl h-14 rounded-xl transition-all active:scale-[0.98]"
        >
         {loading ? <Loader2 className="animate-spin" /> : "JOIN THE CLUB"}
        </Button>
        <div className="text-xs text-center text-zinc-500 uppercase font-bold tracking-widest">
         Member already?{" "}
         <Link href="/sign-in" className="text-primary ">
          Sign in
         </Link>
        </div>
       </CardFooter>
      </form>
     )}
    </Card>
   </motion.div>
  </main>
 );
}
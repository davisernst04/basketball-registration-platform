"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const storedEmail = localStorage.getItem("signupEmail");
    if (storedEmail && email === null) setEmail(storedEmail);
  }, [email]);

  const resendDisabled = countdown > 0;

  const handleResendEmail = async () => {
    if (!email) return;
    
    setCountdown(60);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });

    if (error) {
      toast.error("Failed to resend email: " + error.message);
      setCountdown(0);
    } else {
      toast.success("Verification email resent!");
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-black selection:bg-primary/30 selection:text-white">
      <Navbar />

      <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-zinc-800/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="bg-zinc-950/80 backdrop-blur-xl border-zinc-800 shadow-2xl overflow-hidden rounded-[2rem]">
            <CardHeader className="space-y-2 p-10 pb-2 border-b border-zinc-900/50">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-impact tracking-wider text-white text-center uppercase leading-none">
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-zinc-500 text-center font-medium tracking-wide">
                We&apos;ve sent a verification link to your email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-10 pt-8 text-center">
              <div className="space-y-2">
                <p className="text-zinc-300">
                  Please check your inbox and click the link to activate your account.
                </p>
                {email && (
                  <p className="text-zinc-500 text-sm font-bold bg-zinc-900/50 py-2 px-4 rounded-lg inline-block">
                    {email}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <Button
                  onClick={() => router.push("/sign-in")}
                  variant="outline"
                  className="w-full h-14 rounded-xl border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white font-bold tracking-wider uppercase"
                >
                  Confirmed email? Sign in here
                </Button>
                
                <div className="text-sm text-zinc-500">
                  Didn&apos;t receive the email?
                  <Button
                    variant="link"
                    disabled={resendDisabled || !email}
                    onClick={handleResendEmail}
                    className="text-primary hover:text-primary/80 font-bold ml-1 p-0 h-auto"
                  >
                    {resendDisabled ? `Resend in ${countdown}s` : "Resend"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

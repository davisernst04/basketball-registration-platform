"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle2, LayoutDashboard, Home } from "lucide-react";
import { Suspense } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");
  
  const isExistingUser = status === "EXISTING_USER_FOUND";
  const isNewUser = status === "NEW_USER_CREATED";
  const isLoggedIn = status === "LOGGED_IN";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-zinc-900 border-zinc-800 text-white">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="mx-auto bg-primary/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4"
          >
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </motion.div>
          <CardTitle className="text-3xl font-impact tracking-wide uppercase">
            Player Registered
          </CardTitle>
          <CardDescription className="text-zinc-400 text-lg">
            Registration has been successfully received.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-black/40 p-4 rounded-lg border border-zinc-800 text-center text-zinc-300">
             {isNewUser ? (
              <p>Please check your email to set up your account password to manage this registration.</p>
            ) : isExistingUser ? (
              <p>We found your existing account. Please sign in to link this registration to your profile.</p>
            ) : isLoggedIn ? (
              <p>This registration has been added to your dashboard.</p>
            ) : (
               <p>A confirmation email has been sent to the provided address.</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {(isLoggedIn || isExistingUser) && (
              <Button 
                onClick={() => router.push(isExistingUser ? "/sign-in" : "/dashboard")}
                className="w-full bg-primary hover:bg-primary/90 font-impact tracking-wide text-lg h-12"
              >
                <LayoutDashboard className="mr-2 w-5 h-5" />
                {isExistingUser ? "Sign In" : "View Dashboard"}
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => router.push("/")}
              className="w-full border-zinc-700 hover:bg-zinc-800 hover:text-white font-impact tracking-wide text-lg h-12"
            >
              <Home className="mr-2 w-5 h-5" />
              Return Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, Loader2, ClipboardCheck, User, ShieldCheck, Zap } from "lucide-react";
import { createRegistration } from "../actions";
import { Tryout, RegistrationFormData, Profile } from "@/types";

interface RegisterFormProps {
  tryouts: Tryout[];
  initialUser: {
    email?: string;
    user_metadata?: {
      full_name?: string;
    };
  } | null;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function RegisterForm({ tryouts, initialUser }: RegisterFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<RegistrationFormData>({
    parentName: initialUser?.user_metadata?.full_name || "",
    parentEmail: initialUser?.email || "",
    parentPhone: "",
    playerName: "",
    playerAge: "",
    playerGrade: "",
    medicalInfo: "",
    emergencyContact: "",
    emergencyPhone: "",
    tryoutId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await createRegistration(formData);

      if (result.success) {
        toast.success(result.message, {
          description: "We've received your application. Redirecting...",
          icon: <CheckCircle2 className="text-green-500" />
        });
        
        // Redirect to parent dashboard if logged in
        if (initialUser) {
          setTimeout(() => router.push("/parent-dashboard"), 2000);
        } else {
          router.push("/");
        }
      } else {
        toast.error("Registration failed", {
          description: result.message || "Please check your information and try again.",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="bg-zinc-950 border-zinc-800 rounded-3xl overflow-hidden">
      <CardHeader className="text-center p-12 border-b border-zinc-800">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-zinc-900 p-4 rounded-2xl">
            <ClipboardCheck className="text-red-600" size={40} />
          </div>
        </motion.div>
        <CardTitle className="text-5xl md:text-6xl font-impact tracking-wider text-white uppercase leading-none">
          TRYOUT <span className="text-red-600">REGISTRATION</span>
        </CardTitle>
        <CardDescription className="text-zinc-500 mt-4 text-xl font-light">
          Join the Shadow Basketball legacy. Complete the fields below to register your player.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-10 md:p-16">
        <form onSubmit={handleSubmit}>
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-16"
          >
            {/* Section 1: Parent */}
            <motion.div variants={fadeInUp} className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-red-600 w-1.5 h-10 rounded-full "></div>
                <h3 className="text-2xl font-impact text-white uppercase tracking-wider flex items-center gap-3">
                  <User className="text-red-600" size={20} />
                  Guardian Profile
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="parentName" className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Full Name</Label>
                  <Input
                    id="parentName"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="bg-zinc-900/50 border-zinc-800 text-white focus:border-red-600 h-14 rounded-2xl transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="parentEmail" className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Email Address</Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    required
                    value={formData.parentEmail}
                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                    className="bg-zinc-900/50 border-zinc-800 text-white focus:border-red-600 h-14 rounded-2xl transition-all"
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="parentPhone" className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Phone Number</Label>
                  <Input
                    id="parentPhone"
                    type="tel"
                    required
                    placeholder="(555) 000-0000"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="bg-zinc-900/50 border-zinc-800 text-white focus:border-red-600 h-14 rounded-2xl transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* Section 2: Player */}
            <motion.div variants={fadeInUp} className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-red-600 w-1.5 h-10 rounded-full "></div>
                <h3 className="text-2xl font-impact text-white uppercase tracking-wider flex items-center gap-3">
                  <Zap className="text-red-600" size={20} />
                  Athlete Information
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="playerName" className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Player Full Name</Label>
                  <Input
                    id="playerName"
                    required
                    value={formData.playerName}
                    onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                    className="bg-zinc-900/50 border-zinc-800 text-white focus:border-red-600 h-14 rounded-2xl transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="playerAge" className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Age</Label>
                  <Input
                    id="playerAge"
                    type="number"
                    required
                    min="5"
                    max="18"
                    value={formData.playerAge}
                    onChange={(e) => setFormData({ ...formData, playerAge: e.target.value })}
                    className="bg-zinc-900/50 border-zinc-800 text-white focus:border-red-600 h-14 rounded-2xl transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="playerGrade" className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Current Grade</Label>
                  <Input
                    id="playerGrade"
                    required
                    placeholder="e.g. 8th Grade"
                    value={formData.playerGrade}
                    onChange={(e) => setFormData({ ...formData, playerGrade: e.target.value })}
                    className="bg-zinc-900/50 border-zinc-800 text-white focus:border-red-600 h-14 rounded-2xl transition-all"
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="medicalInfo" className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Medical Info / Allergies</Label>
                  <Input
                    id="medicalInfo"
                    placeholder="Optional: Any conditions our staff should know"
                    value={formData.medicalInfo}
                    onChange={(e) => setFormData({ ...formData, medicalInfo: e.target.value })}
                    className="bg-zinc-900/50 border-zinc-800 text-white focus:border-red-600 h-14 rounded-2xl transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* Section 3: Emergency */}
            <motion.div variants={fadeInUp} className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-red-600 w-1.5 h-10 rounded-full "></div>
                <h3 className="text-2xl font-impact text-white uppercase tracking-wider flex items-center gap-3">
                  <ShieldCheck className="text-red-600" size={20} />
                  Emergency Contact
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="emergencyContact" className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    required
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="bg-zinc-900/50 border-zinc-800 text-white focus:border-red-600 h-14 rounded-2xl transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="emergencyPhone" className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    required
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    className="bg-zinc-900/50 border-zinc-800 text-white focus:border-red-600 h-14 rounded-2xl transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* Section 4: Selection */}
            <motion.div variants={fadeInUp} className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-red-600 w-1.5 h-10 rounded-full "></div>
                <h3 className="text-2xl font-impact text-white uppercase tracking-wider flex items-center gap-3">
                  Select Tryout Session
                </h3>
              </div>

              {tryouts.length === 0 ? (
                <div className="p-12 bg-zinc-900/30 rounded-[2rem] border border-zinc-900 text-center">
                  <p className="text-zinc-600 font-bold uppercase tracking-widest italic text-sm">No active tryout sessions found</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {tryouts.map((tryout) => (
                    <label
                      key={tryout.id}
                      className={`relative block p-8 border rounded-[2rem] cursor-pointer transition-all duration-500 ${
                        formData.tryoutId === tryout.id
                          ? "border-red-600 bg-red-950/10 shadow-[0_0_30px_rgba(220,38,38,0.15)] ring-1 ring-red-600/50"
                          : "border-zinc-900 bg-black hover:border-zinc-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="tryout"
                        value={tryout.id}
                        checked={formData.tryoutId === tryout.id}
                        onChange={(e) => setFormData({ ...formData, tryoutId: e.target.value })}
                        className="sr-only"
                        required
                      />
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <p className="text-white font-impact text-2xl uppercase tracking-wider group-hover:text-red-500 transition-colors">
                            {tryout.ageGroup}
                          </p>
                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-zinc-500 font-medium">
                            <span className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-red-600"></div>
                              {new Date(tryout.date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                            </span>
                            <span className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-red-600"></div>
                              {tryout.startTime} - {tryout.endTime}
                            </span>
                          </div>
                        </div>
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                          formData.tryoutId === tryout.id ? "bg-red-600 border-red-600" : "border-zinc-800"
                        }`}>
                          {formData.tryoutId === tryout.id && <CheckCircle2 size={18} className="text-white" />}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div variants={fadeInUp} className="pt-10 border-t border-zinc-800">
              <Button
                type="submit"
                disabled={submitting || tryouts.length === 0}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-impact text-3xl h-24 rounded-2xl group transition-colors duration-200"
              >
                {submitting ? (
                  <div className="flex items-center gap-4 uppercase tracking-tighter">
                    <Loader2 className="animate-spin" size={32} /> SUBMITTING...
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    COMPLETE REGISTRATION <CheckCircle2 />
                  </div>
                )}
              </Button>
              <p className="text-center text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em] mt-8 leading-loose">
                Official Shadow Basketball registration portal • &copy; 2026 Season
              </p>
            </motion.div>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
}

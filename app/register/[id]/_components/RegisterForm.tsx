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
import {
  CheckCircle2,
  Loader2,
  ClipboardCheck,
  User,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { createRegistration } from "../../actions";
import { Tryout, RegistrationFormData } from "@/types";

interface RegisterFormProps {
  tryout: Tryout;
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
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function RegisterForm({
  tryout,
  initialUser,
}: RegisterFormProps) {
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
    tryoutId: tryout.id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await createRegistration(formData);

      if (result.success) {
        let status = result.status || (initialUser ? "LOGGED_IN" : "SUCCESS");
        
        // If the server didn't explicitly return LOGGED_IN but we have a user and it's just SUCCESS, upgrade it
        if (initialUser && status === "REGISTRATION_SUCCESS") {
            status = "LOGGED_IN";
        }

        router.push(`/confirmation?status=${status}`);
      } else {
        toast.error("Registration failed", {
          description:
            result.message || "Please check your information and try again.",
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
    <Card className="bg-card border-border rounded-3xl overflow-hidden py-0">
      <CardHeader className="border-b border-border  md:px-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-6"
        ></motion.div>
        <CardTitle className="text-5xl md:text-6xl font-impact tracking-wider text-white uppercase leading-none">
          {tryout.ageGroup} <span className="text-primary">REGISTRATION</span>
        </CardTitle>
        <CardDescription className="text-zinc-500 mt-4 text-xl font-light">
          Registering for tryout session at {tryout.location} on{" "}
          {new Date(tryout.date).toLocaleDateString()}
        </CardDescription>
      </CardHeader>

      <CardContent className="md:px-16">
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
                <div className="bg-primary w-1.5 h-10 rounded-full "></div>
                <h3 className="text-2xl font-impact text-white uppercase tracking-wider flex items-center gap-3">
                  <User className="text-primary" size={20} />
                  Guardian Profile
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label
                    htmlFor="parentName"
                    className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="parentName"
                    required
                    value={formData.parentName}
                    onChange={(e) =>
                      setFormData({ ...formData, parentName: e.target.value })
                    }
                    className="bg-zinc-900/50 border-border text-white focus:border-primary h-14 rounded-2xl transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="parentEmail"
                    className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    required
                    value={formData.parentEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, parentEmail: e.target.value })
                    }
                    className="bg-zinc-900/50 border-border text-white focus:border-primary h-14 rounded-2xl transition-all"
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label
                    htmlFor="parentPhone"
                    className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="parentPhone"
                    type="tel"
                    required
                    placeholder="(555) 000-0000"
                    value={formData.parentPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, parentPhone: e.target.value })
                    }
                    className="bg-zinc-900/50 border-border text-white focus:border-primary h-14 rounded-2xl transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* Section 2: Player */}
            <motion.div variants={fadeInUp} className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-primary w-1.5 h-10 rounded-full "></div>
                <h3 className="text-2xl font-impact text-white uppercase tracking-wider flex items-center gap-3">
                  <Zap className="text-primary" size={20} />
                  Athlete Information
                </h3>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-3 md:col-span-2">
                  <Label
                    htmlFor="playerName"
                    className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1"
                  >
                    Player Full Name
                  </Label>
                  <Input
                    id="playerName"
                    required
                    value={formData.playerName}
                    onChange={(e) =>
                      setFormData({ ...formData, playerName: e.target.value })
                    }
                    className="bg-zinc-900/50 border-border text-white focus:border-primary h-14 rounded-2xl transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="playerAge"
                    className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1"
                  >
                    Age
                  </Label>
                  <Input
                    id="playerAge"
                    type="number"
                    required
                    min="5"
                    max="18"
                    value={formData.playerAge}
                    onChange={(e) =>
                      setFormData({ ...formData, playerAge: e.target.value })
                    }
                    className="bg-zinc-900/50 border-border text-white focus:border-primary h-14 rounded-2xl transition-all"
                  />
                </div>

                <div className="space-y-3 md:col-span-3">
                  <Label
                    htmlFor="medicalInfo"
                    className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1"
                  >
                    Medical Info / Allergies
                  </Label>
                  <Input
                    id="medicalInfo"
                    placeholder="Optional: Any conditions our staff should know"
                    value={formData.medicalInfo}
                    onChange={(e) =>
                      setFormData({ ...formData, medicalInfo: e.target.value })
                    }
                    className="bg-zinc-900/50 border-border text-white focus:border-primary h-14 rounded-2xl transition-all"
                  />
                </div>
              </div>
            </motion.div>

            {/* Section 3: Emergency */}
            <motion.div variants={fadeInUp} className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-primary w-1.5 h-10 rounded-full "></div>
                <h3 className="text-2xl font-impact text-white uppercase tracking-wider flex items-center gap-3">
                  <ShieldCheck className="text-primary" size={20} />
                  Emergency Contact
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label
                    htmlFor="emergencyContact"
                    className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1"
                  >
                    Contact Name
                  </Label>
                  <Input
                    id="emergencyContact"
                    required
                    value={formData.emergencyContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: e.target.value,
                      })
                    }
                    className="bg-zinc-900/50 border-border text-white focus:border-primary h-14 rounded-2xl transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="emergencyPhone"
                    className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1"
                  >
                    Contact Phone
                  </Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    required
                    value={formData.emergencyPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyPhone: e.target.value,
                      })
                    }
                    className="bg-zinc-900/50 border-border text-white focus:border-primary h-14 rounded-2xl transition-all"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="pt-10 border-t border-border"
            >
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary  text-white font-impact text-xl md:text-3xl h-auto py-6 rounded-2xl group transition-all duration-200 whitespace-normal"
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
              <p className="text-center text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em] my-8 leading-loose">
                Official Shadow Basketball registration portal • &copy; 2026
                Season
              </p>
            </motion.div>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
}

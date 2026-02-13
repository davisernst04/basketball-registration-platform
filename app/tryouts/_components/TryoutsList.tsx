"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Tryout } from "@/types";

interface TryoutWithStats extends Tryout {
  _count?: {
    registrations: number;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function TryoutsList({ tryouts, isAuthenticated }: { tryouts: TryoutWithStats[], isAuthenticated: boolean }) {
  const router = useRouter();

  const handleRegister = (tryoutId: string) => {
    if (!isAuthenticated) {
        const returnUrl = encodeURIComponent(`/register/${tryoutId}`);
        router.push(`/sign-in?next=${returnUrl}`);
    } else {
        router.push(`/register/${tryoutId}`);
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid md:grid-cols-2 gap-8"
    >
      {tryouts.map((tryout) => (
        <motion.div key={tryout.id} variants={itemVariants}>
          <Card className="bg-zinc-950 border-zinc-800 overflow-hidden rounded-[2rem] relative group hover:border-primary/50 transition-colors duration-300 py-0">
            <CardContent className="p-0">
              {/* Header Strip */}
              <div className="bg-zinc-900/50 p-6 md:p-8 flex justify-between items-start border-b border-zinc-900">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                      Open Session
                    </span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-impact tracking-wide text-white uppercase leading-none">
                    {tryout.ageGroup}
                  </h3>
                </div>

                {tryout.maxCapacity && tryout._count !== undefined && (
                  <Badge
                    className={`${
                      tryout.maxCapacity - tryout._count.registrations <= 5
                        ? "bg-primary text-white"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700"
                    } font-bold px-3 py-1 rounded-md text-[10px] tracking-widest uppercase`}
                  >
                    {tryout.maxCapacity - tryout._count.registrations <= 5
                      ? "Limited Spots"
                      : "Register Now"}
                  </Badge>
                )}
              </div>

              {/* Info Grid */}
              <div className="p-6 md:p-8 space-y-8">
                <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-zinc-600 mb-1">
                      <Calendar size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Date
                      </span>
                    </div>
                    <p className="text-white font-bold text-lg uppercase font-impact tracking-wide">
                      {new Date(tryout.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-zinc-600 mb-1">
                      <Clock size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Register By
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-white font-bold text-lg uppercase font-impact tracking-wide">
                        {new Date(
                          tryout.registrationDeadline,
                        ).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-zinc-500 text-xs font-bold uppercase">
                        {new Date(
                          tryout.registrationDeadline,
                        ).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 space-y-1">
                    <div className="flex items-center gap-2 text-zinc-600 mb-1">
                      <MapPin size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Location
                      </span>
                    </div>
                    <p className="text-zinc-300 font-medium text-lg truncate">
                      {tryout.location}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {tryout.notes && (
                    <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-900 flex gap-3 items-start">
                      <Info
                        size={16}
                        className="text-zinc-500 shrink-0 mt-0.5"
                      />
                      <p className="text-xs text-zinc-400 italic leading-relaxed">
                        {tryout.notes}
                      </p>
                    </div>
                  )}

                  <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-900 flex gap-3 items-start">
                    <AlertTriangle
                      size={16}
                      className="text-primary shrink-0 mt-0.5"
                    />
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Specific session times will be emailed to registered
                      players after the deadline.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleRegister(tryout.id)}
                  className="w-full bg-white text-black hover:bg-zinc-200 font-impact text-xl h-16 rounded-xl transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                  disabled={
                    tryout.maxCapacity !== null &&
                    tryout._count !== undefined &&
                    tryout._count.registrations >= tryout.maxCapacity
                  }
                >
                  {tryout.maxCapacity !== null &&
                  tryout._count !== undefined &&
                  tryout._count.registrations >= tryout.maxCapacity ? (
                    <span className="opacity-50">SESSION FULL</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      SECURE SPOT{" "}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
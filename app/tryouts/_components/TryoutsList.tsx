"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Trophy, ArrowRight, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Tryout {
  id: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  ageGroup: string;
  maxCapacity: number | null;
  notes: string | null;
  _count?: {
    registrations: number;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

export default function TryoutsList({ tryouts }: { tryouts: Tryout[] }) {
  const router = useRouter();

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid md:grid-cols-2 gap-10"
    >
      {tryouts.map((tryout) => (
        <motion.div key={tryout.id} variants={itemVariants}>
          <Card
            className="bg-zinc-950 border-zinc-800 overflow-hidden rounded-[2.5rem] relative"
          >
            <CardHeader className="border-b border-zinc-800 p-8">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-4xl font-impact tracking-wider text-white uppercase">
                    {tryout.ageGroup}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">
                    <Trophy size={12} className="text-red-600" />
                    COMPETITIVE ELITE
                  </div>
                </div>
                {tryout.maxCapacity && tryout._count !== undefined && (
                  <div className="text-right">
                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Status</div>
                    <Badge className={`${
                      tryout.maxCapacity - tryout._count.registrations <= 5 
                        ? "bg-red-600 text-white" 
                        : "bg-zinc-800 text-zinc-300"
                    } font-bold px-3 py-1 rounded-md`}>
                      {tryout.maxCapacity - tryout._count.registrations <= 5 ? "LIMITED" : "OPEN"}
                    </Badge>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="p-8 space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-red-600 text-[10px] font-black uppercase tracking-[0.2em]">
                    <Calendar size={12} /> The Date
                  </div>
                  <p className="text-white font-bold text-xl uppercase font-impact tracking-tight">
                    {new Date(tryout.date).toLocaleDateString(undefined, { 
                      weekday: 'short', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-red-600 text-[10px] font-black uppercase tracking-[0.2em]">
                    <Clock size={12} /> The Time
                  </div>
                  <p className="text-white font-bold text-xl uppercase font-impact tracking-tight">
                    {tryout.startTime} - {tryout.endTime}
                  </p>
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <div className="flex items-center gap-2 text-red-600 text-[10px] font-black uppercase tracking-[0.2em]">
                    <MapPin size={12} /> The Location
                  </div>
                  <p className="text-zinc-300 font-medium text-lg border-l-2 border-zinc-800 pl-4 py-1">
                    {tryout.location}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-900 flex flex-col gap-6">
                {tryout.notes && (
                  <div className="flex gap-3 text-sm text-zinc-500 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-900 italic">
                    <Info size={16} className="text-red-600 shrink-0" />
                    <span>&quot;{tryout.notes}&quot;</span>
                  </div>
                )}

                                        <Button
                                          onClick={() => router.push("/register")}
                                          className="w-full bg-zinc-900 hover:bg-red-600 text-white font-impact text-2xl h-20 rounded-2xl transition-colors duration-300"
                                          disabled={
                                            tryout.maxCapacity !== null &&
                                            tryout._count !== undefined &&
                                            tryout._count.registrations >= tryout.maxCapacity
                                          }
                                        >
                                          {tryout.maxCapacity !== null &&
                                          tryout._count !== undefined &&
                                          tryout._count.registrations >= tryout.maxCapacity
                                            ? "SESSION FULL"
                                            : "SECURE MY SPOT"}
                                          <ArrowRight className="ml-3 h-6 w-6" />
                                        </Button>              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

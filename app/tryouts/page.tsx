"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Trophy, ArrowRight, Info, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

export default function TryoutsPage() {
  const router = useRouter();
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tryouts")
      .then((res) => res.json())
      .then((data) => {
        setTryouts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setTryouts([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600/30 selection:text-white">
      <Navbar />

      {/* Tryouts Header */}
      <div className="relative pt-40 pb-20 bg-zinc-950 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <Badge className="bg-red-600 hover:bg-red-600 text-white font-bold px-6 py-1.5 rounded-full tracking-widest text-xs">SEASON 2026</Badge>
            <h1 className="text-6xl md:text-8xl font-impact tracking-tighter uppercase leading-[0.9]">
              JOIN THE <br/><span className="text-red-600">ELITE LEGACY</span>
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
              We are looking for dedicated players who are ready to push their limits. 
              Our tryout sessions are designed to identify talent, drive, and character.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tryouts Grid */}
      <div className="container mx-auto px-6 py-24 relative">
        <div className="absolute top-0 left-1/4 w-px h-full bg-zinc-900/50 -z-10 hidden lg:block"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-zinc-900/50 -z-10 hidden lg:block"></div>

        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-10">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-zinc-900/50 rounded-3xl animate-pulse border border-zinc-800" />
              ))}
            </div>
          ) : tryouts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-950 border border-zinc-800 border-dashed py-32 text-center rounded-[3rem]"
            >
              <div className="space-y-6">
                <Calendar className="mx-auto text-zinc-800" size={80} strokeWidth={1} />
                <div className="space-y-2">
                  <p className="text-zinc-400 text-2xl font-impact uppercase tracking-wider">No Sessions Scheduled</p>
                  <p className="text-zinc-600">Please check back later or follow our social media for updates.</p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="border-2 border-zinc-700 bg-transparent text-zinc-300 rounded-full px-10 h-12 hover:bg-white hover:text-black hover:border-white" onClick={() => router.push("/")}>
                    RETURN HOME
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
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
                    className="bg-zinc-950 border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all duration-300 group rounded-[2.5rem] relative"
                  >
                    
                    <CardHeader className="border-b border-zinc-800 p-8">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <CardTitle className="text-4xl font-impact tracking-wider text-white uppercase group-hover:text-red-500 transition-colors">
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

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            onClick={() => router.push("/register")}
                            className="w-full bg-white hover:bg-red-600 text-black hover:text-white font-impact text-2xl h-20 rounded-2xl transition-colors duration-300"
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
                            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <section className="bg-zinc-950 py-32 border-t border-zinc-900 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-16"
            >
              <div className="space-y-8 p-10 bg-black rounded-3xl border border-zinc-800">
                <div className="bg-zinc-900 w-16 h-16 flex items-center justify-center rounded-2xl">
                  <Trophy className="text-red-600" size={32} />
                </div>
                <h3 className="text-3xl font-impact tracking-wider uppercase text-white">What to prepare?</h3>
                <ul className="space-y-4">
                  {[
                    "Full basketball attire & performance shoes",
                    "Individual 32oz water bottle (minimum)",
                    "A focused, high-energy mindset",
                    "Arrive 20 minutes early for check-in"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 items-center group">
                      <div className="h-2 w-2 rounded-full bg-red-600 group-hover:scale-150 transition-transform"></div> 
                      <span className="text-zinc-400 text-lg group-hover:text-white transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-8 p-10 bg-zinc-900/30 rounded-3xl border border-zinc-800 flex flex-col justify-center">
                <div className="bg-zinc-900 w-16 h-16 flex items-center justify-center rounded-2xl">
                  <Clock className="text-red-600" size={32} />
                </div>
                <h3 className="text-3xl font-impact tracking-wider uppercase text-white">The Results</h3>
                <p className="text-zinc-500 text-xl leading-relaxed font-light italic">
                  &quot;Staff will evaluate performance metrics including footwork, shooting mechanics, defensive IQ, and coachability.&quot;
                </p>
                <div className="flex items-start gap-4 p-6 bg-black/50 rounded-2xl border border-zinc-800">
                  <AlertCircle className="text-red-600 shrink-0 mt-1" size={20} />
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Official placement notifications will be sent via the Parent Dashboard and email within 72 hours of the final session completion.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

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
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  AlertCircle,
  ChevronRight,
  PlusCircle,
  Trophy,
  History
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Toaster, toast } from "sonner";

interface Registration {
  id: string;
  parentName: string;
  playerName: string;
  playerAge: number;
  playerGrade: string;
  medicalInfo: string | null;
  createdAt: string;
  tryout: {
    ageGroup: string;
    date: string;
    location: string;
    startTime: string;
    endTime: string;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function ParentDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/sign-in");
        return;
      }

      setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || "Parent");

      try {
        const response = await fetch("/api/registrations");
        if (response.ok) {
          const data = await response.json();
          // Filter already done in API now, but keeping client check for robustness
          const myRegs = data.filter((reg: any) => reg.userId === user.id || reg.parentEmail === user.email);
          setRegistrations(myRegs);
        }
      } catch (error) {
        console.error("Error loading registrations:", error);
        toast.error("Failed to load your registrations");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Toaster position="top-center" richColors />
      
      <main className="container mx-auto px-4 pt-32 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto space-y-8"
        >
          {/* Header Card */}
          <div className="relative overflow-hidden bg-zinc-950 p-8 md:p-12 rounded-3xl border border-zinc-800">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-3">
                <Badge className="bg-zinc-900 text-red-500 border-zinc-800 px-3 py-1 font-bold tracking-widest">PARENT PORTAL</Badge>
                <h1 className="text-4xl md:text-6xl font-impact tracking-wider uppercase">
                  Welcome, <span className="text-red-600">{userName}</span>
                </h1>
                <p className="text-zinc-500 max-w-xl text-lg">
                  Track your player&apos;s progress and upcoming tryout sessions all in one place.
                </p>
              </div>
              <Button 
                onClick={() => router.push("/register")}
                className="bg-red-600 hover:bg-red-700 text-white font-bold h-16 px-8 rounded-2xl transition-colors"
              >
                <PlusCircle className="mr-2 h-6 w-6" /> 
                REGISTER NEW PLAYER
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* My Registrations List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <History className="text-red-600" size={24} />
                  <h2 className="text-2xl font-impact tracking-wide uppercase">Active Registrations</h2>
                </div>
                <Badge variant="outline" className="border-zinc-800 text-zinc-500">
                  {registrations.length} Applications
                </Badge>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-48 bg-zinc-900 rounded-2xl animate-pulse border border-zinc-800" />
                  ))}
                </div>
              ) : registrations.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="bg-zinc-950 border-zinc-800 border-dashed py-20 text-center rounded-3xl">
                    <CardContent className="space-y-6">
                      <div className="bg-zinc-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-zinc-700 border border-zinc-800">
                        <AlertCircle size={40} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-white text-2xl font-bold">No Registrations Yet</h3>
                        <p className="text-zinc-500 max-w-xs mx-auto text-lg">Your journey with Shadow Basketball starts here. Register your first player today!</p>
                      </div>
                      <Button 
                        size="lg"
                        className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl px-8"
                        onClick={() => router.push("/register")}
                      >
                        Start Registration
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {registrations.map((reg) => (
                    <motion.div key={reg.id} variants={itemVariants}>
                      <Card className="bg-zinc-950 border-zinc-800 overflow-hidden transition-colors rounded-2xl shadow-lg">
                        <div className="flex flex-col md:flex-row">
                          <div className="bg-gradient-to-br from-red-900/20 to-transparent p-8 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-zinc-900 md:w-1/3">
                            <div className="bg-red-600/10 p-4 rounded-2xl mb-4 border border-red-600/20">
                              <Trophy className="text-red-600 w-8 h-8" />
                            </div>
                            <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Elite Player</span>
                            <span className="text-3xl font-impact text-white uppercase mt-1">{reg.playerName}</span>
                            <Badge variant="outline" className="mt-3 border-zinc-800 text-zinc-400 px-4 py-1">
                              {reg.playerGrade}
                            </Badge>
                          </div>
                          
                          <div className="p-8 flex-1 space-y-6 flex flex-col justify-center">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <h4 className="text-2xl font-bold text-white uppercase tracking-tight">
                                  {reg.tryout.ageGroup}
                                </h4>
                                <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">OFFICIAL TRYOUT SESSION</p>
                              </div>
                              <div className="text-right hidden sm:block">
                                <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest block mb-1">Status</span>
                                <Badge className="bg-green-600/10 text-green-500 border-green-600/20">CONFIRMED</Badge>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-red-600 text-[10px] font-bold uppercase tracking-widest">
                                  <Calendar size={12} /> Date
                                </div>
                                <p className="text-zinc-300 font-bold text-sm">
                                  {new Date(reg.tryout.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-red-600 text-[10px] font-bold uppercase tracking-widest">
                                  <Clock size={12} /> Time
                                </div>
                                <p className="text-zinc-300 font-bold text-sm">{reg.tryout.startTime} - {reg.tryout.endTime}</p>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-red-600 text-[10px] font-bold uppercase tracking-widest">
                                  <MapPin size={12} /> Location
                                </div>
                                <p className="text-zinc-300 font-bold text-sm line-clamp-1">{reg.tryout.location}</p>
                              </div>
                            </div>

                            {reg.medicalInfo && (
                              <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex items-start gap-3">
                                <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-zinc-500"><span className="text-zinc-400 font-semibold mr-1 uppercase">Note:</span> {reg.medicalInfo}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Sidebar info */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-zinc-950 border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
                  <CardHeader className="bg-zinc-900/50 border-b border-zinc-800">
                    <CardTitle className="text-xl font-impact tracking-wider text-white uppercase flex items-center gap-2">
                      <PlusCircle size={18} className="text-red-600" /> Quick Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-between text-zinc-400 hover:text-white hover:bg-zinc-900 group h-auto py-4 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-zinc-900 rounded-xl group-hover:bg-red-950 transition-colors">
                          <Calendar size={20} className="text-zinc-500 group-hover:text-red-500" />
                        </div>
                        <div className="text-left">
                          <span className="block font-bold">Upcoming Schedule</span>
                          <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-tighter">View all dates</span>
                        </div>
                      </div>
                      <ChevronRight size={16} />
                    </Button>
                    
                    <Button variant="ghost" className="w-full justify-between text-zinc-400 hover:text-white hover:bg-zinc-900 group h-auto py-4 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-zinc-900 rounded-xl group-hover:bg-red-950 transition-colors">
                          <User size={20} className="text-zinc-500 group-hover:text-red-500" />
                        </div>
                        <div className="text-left">
                          <span className="block font-bold">Coach Directory</span>
                          <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-tighter">Meet the staff</span>
                        </div>
                      </div>
                      <ChevronRight size={16} />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-zinc-950 border-zinc-800 p-8 rounded-3xl relative overflow-hidden">
                  <div className="relative z-10 space-y-6">
                    <h3 className="text-2xl font-impact tracking-wider text-white uppercase">Shadow <br/>Legacy</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      Excellence is not an act, but a habit. We are dedicated to providing the best basketball experience for your family.
                    </p>
                    <div className="pt-4">
                      <Button variant="link" className="text-red-500 p-0 hover:text-red-400 font-bold flex items-center gap-2 group">
                        FOLLOW OUR JOURNEY <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function ArrowRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
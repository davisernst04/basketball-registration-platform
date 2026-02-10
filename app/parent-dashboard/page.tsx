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
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
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
 parentEmail: string;
 playerName: string;
 playerAge: number;
 playerGrade: string;
 medicalInfo: string | null;
 createdAt: string;
 userId: string | null;
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

   setUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "Parent");

   try {
    const response = await fetch("/api/registrations");
    if (response.ok) {
     const data = await response.json();
     const myRegs = data.filter((reg: Registration) => reg.userId === user.id || reg.parentEmail === user.email);
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
     <div className="relative overflow-hidden bg-card p-8 md:p-12 rounded-3xl border border-border shadow-2xl">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
       <div className="space-y-3">
        <Badge className="bg-zinc-900 text-primary border-border px-3 py-1 font-bold tracking-widest uppercase text-[10px]">PARENT PORTAL</Badge>
        <h1 className="text-4xl md:text-6xl font-impact tracking-wider uppercase leading-none">
         Welcome, <span className="text-primary">{userName}</span>
        </h1>
        <p className="text-zinc-500 max-w-xl text-lg font-light leading-relaxed">
         Track your player&apos;s progress and upcoming tryout sessions all in one place.
        </p>
       </div>
       <Button 
        onClick={() => router.push("/tryouts")}
        className="bg-primary text-white font-impact text-xl h-16 px-10 rounded-2xl transition-all active:scale-95 shadow-xl"
       >
        <PlusCircle className="mr-3 h-6 w-6" /> 
        REGISTER NEW PLAYER
       </Button>
      </div>
     </div>

     <div className="flex items-center justify-between px-2 mb-2">
      <div className="flex items-center gap-3">
       <History className="text-primary" size={24} />
       <h2 className="text-2xl font-impact tracking-wide uppercase text-white">Active Registrations</h2>
      </div>
      <Badge variant="outline" className="border-border text-zinc-500 uppercase text-[10px] font-black tracking-widest">
       {registrations.length} Applications
      </Badge>
     </div>

     <div className="grid lg:grid-cols-3 gap-8">
      {/* My Registrations List */}
      <div className="lg:col-span-2 space-y-4">
       {loading ? (
        <div className="space-y-4">
         {[1, 2].map((i) => (
          <div key={i} className="h-48 bg-zinc-900 rounded-2xl animate-pulse border border-border" />
         ))}
        </div>
       ) : registrations.length === 0 ? (
        <motion.div
         initial={{ opacity: 0, scale: 0.98 }}
         animate={{ opacity: 1, scale: 1 }}
        >
         <Card className="bg-card border-border border-dashed py-20 text-center rounded-3xl">
          <CardContent className="space-y-6">
           <div className="bg-zinc-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-zinc-700 border border-border">
            <AlertCircle size={40} />
           </div>
           <div className="space-y-2">
            <h3 className="text-white text-2xl font-impact uppercase">No Registrations Yet</h3>
            <p className="text-zinc-500 max-w-xs mx-auto text-lg font-light">Your journey with Shadow Basketball starts here. Register your first player today!</p>
           </div>
           <Button 
            size="lg"
            className="bg-zinc-800 text-white rounded-xl px-10 font-bold uppercase tracking-widest text-xs"
            onClick={() => router.push("/tryouts")}
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
           <Card className="bg-card border-border overflow-hidden transition-all rounded-2xl shadow-xl group">
            <div className="flex flex-col md:flex-row">
             <div className="bg-black/50 p-8 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-border md:w-1/3 ">
              <div className="bg-primary/10 p-4 rounded-2xl mb-4 border border-primary/20 transition-transform group-hover:scale-110">
               <Trophy className="text-primary w-8 h-8" />
              </div>
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Elite Athlete</span>
              <span className="text-3xl font-impact text-white uppercase mt-1 tracking-wider">{reg.playerName}</span>
              <Badge variant="outline" className="mt-3 border-border text-zinc-400 px-4 py-1 uppercase text-[10px] font-bold tracking-tighter">
               {reg.playerGrade}
              </Badge>
             </div>
             
             <div className="p-8 flex-1 space-y-6 flex flex-col justify-center">
              <div className="flex justify-between items-start">
               <div className="space-y-1">
                <h4 className="text-2xl font-impact text-white uppercase tracking-wider">
                 {reg.tryout.ageGroup}
                </h4>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">OFFICIAL EVALUATION SESSION</p>
               </div>
               <div className="text-right hidden sm:block">
                <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest block mb-1">Status</span>
                <Badge className="bg-primary/10 text-primary border-primary/20 font-bold text-[10px]">CONFIRMED</Badge>
               </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
               <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest">
                 <Calendar size={12} /> The Date
                </div>
                <p className="text-zinc-300 font-bold text-sm uppercase tracking-tight">
                 {new Date(reg.tryout.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>
               </div>
               <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest">
                 <Clock size={12} /> The Time
                </div>
                <p className="text-zinc-300 font-bold text-sm uppercase tracking-tight">{reg.tryout.startTime} - {reg.tryout.endTime}</p>
               </div>
               <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest">
                 <MapPin size={12} /> The Arena
                </div>
                <p className="text-zinc-300 font-bold text-sm line-clamp-1 uppercase tracking-tight">{reg.tryout.location}</p>
               </div>
              </div>

              {reg.medicalInfo && (
               <div className="bg-black/30 p-4 rounded-xl border border-border flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-zinc-500"><span className="text-zinc-400 font-black mr-1 uppercase">MEDICAL NOTE:</span> {reg.medicalInfo}</p>
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
        <Card className="bg-card border-border rounded-3xl overflow-hidden shadow-2xl transition-all /20">
         <CardHeader className="bg-black/50 border-b border-border p-6">
          <CardTitle className="text-xl font-impact tracking-wider text-white uppercase flex items-center gap-3">
           <PlusCircle size={18} className="text-primary" /> Quick Actions
          </CardTitle>
         </CardHeader>
         <CardContent className="p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-between text-zinc-400  group h-auto py-5 rounded-2xl transition-all">
           <div className="flex items-center gap-4">
            <div className="p-2.5 bg-zinc-900 rounded-xl duration-300">
             <Calendar size={20} className="text-zinc-500 group-" />
            </div>
            <div className="text-left">
             <span className="block font-bold text-sm uppercase tracking-tight">Full Schedule</span>
             <span className="text-[10px] text-zinc-600 uppercase font-black tracking-tighter">View all evaluation dates</span>
            </div>
           </div>
           <ChevronRight size={16} className="text-zinc-700 " />
          </Button>
          
          <Button variant="ghost" className="w-full justify-between text-zinc-400  group h-auto py-5 rounded-2xl transition-all">
           <div className="flex items-center gap-4">
            <div className="p-2.5 bg-zinc-900 rounded-xl duration-300">
             <User size={20} className="text-zinc-500 group-" />
            </div>
            <div className="text-left">
             <span className="block font-bold text-sm uppercase tracking-tight">Contact Coaches</span>
             <span className="text-[10px] text-zinc-600 uppercase font-black tracking-tighter">Speak with our evaluation staff</span>
            </div>
           </div>
           <ChevronRight size={16} className="text-zinc-700 " />
          </Button>
         </CardContent>
        </Card>
       </motion.div>

       <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
       >
        <Card className="bg-card border-border p-10 rounded-3xl relative overflow-hidden shadow-2xl">
         {/* Decorative element */}
         <div className="absolute -right-10 -bottom-10 text-primary/5 font-impact text-9xl pointer-events-none">SBC</div>
         
         <div className="relative z-10 space-y-6">
          <h3 className="text-3xl font-impact tracking-widest text-white uppercase leading-none">Shadow <br/>Legacy</h3>
          <p className="text-zinc-500 text-sm leading-relaxed font-light">
           Excellence is not an act, but a habit. We are dedicated to providing the premier youth basketball experience.
          </p>
          <div className="pt-4">
           <Button variant="link" className="text-primary p-0 font-impact text-sm uppercase tracking-[0.2em] flex items-center gap-3 group transition-all">
            THE JOURNEY <History size={16} className="group-hover:rotate-180 transition-transform duration-700" />
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
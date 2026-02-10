"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
 Card,
 CardContent,
 CardDescription,
 CardHeader,
 CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
 Users, 
 Calendar, 
 PlusCircle, 
 Search, 
 Edit2, 
 Trash2, 
 MapPin, 
 Clock,
 LayoutDashboard,
 ChevronDown,
 ChevronUp,
 ArrowLeft,
 Mail,
 Phone,
 User as UserIcon,
 AlertCircle,
 RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Toaster, toast } from "sonner";
import { createTryout, updateTryout, deleteTryout } from "./actions";
import { Tryout, Registration, TryoutFormData } from "@/types";

interface ExtendedRegistration extends Registration {
 createdAt: string | Date;
 tryout: {
  ageGroup: string;
  date: string | Date;
  location: string;
  startTime: string;
  endTime: string;
 };
}

interface ExtendedTryout extends Tryout {
 _count: {
  registrations: number;
 };
}

type TabType = "schedule" | "create";

export default function DashboardPage() {
 const [registrations, setRegistrations] = useState<ExtendedRegistration[]>([]);
 const [tryouts, setTryouts] = useState<ExtendedTryout[]>([]);
 const [loading, setLoading] = useState(true);
 const [activeTab, setActiveTab] = useState<TabType>("schedule");
 const [selectedTryoutId, setSelectedTryoutId] = useState<string | null>(null);
 const [searchTerm, setSearchTerm] = useState("");
 const [editingTryout, setEditingTryout] = useState<ExtendedTryout | null>(null);
 const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);

 const [newTryout, setNewTryout] = useState<TryoutFormData>({
  location: "",
  date: "",
  startTime: "",
  endTime: "",
  ageGroup: "",
  maxCapacity: "",
  notes: "",
 });

 const loadData = useCallback(async (silent = false) => {
  if (!silent) setLoading(true);
  try {
   const [regRes, tryRes] = await Promise.all([
    fetch("/api/registrations", { cache: 'no-store' }),
    fetch("/api/tryouts", { cache: 'no-store' }),
   ]);

   const [regData, tryData] = await Promise.all([
    regRes.ok ? regRes.json() : [],
    tryRes.ok ? tryRes.json() : [],
   ]);

   setRegistrations(regData);
   setTryouts(tryData);
  } catch (error) {
   console.error("Error loading data:", error);
   if (!silent) toast.error("Failed to load dashboard data");
  } finally {
   if (!silent) setLoading(false);
  }
 }, []);

 useEffect(() => {
  loadData();
 }, [loadData]);

 const handleCreateTryout = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
   const result = await createTryout({
    ...newTryout,
    date: new Date(newTryout.date).toISOString(),
   });

   if (result.success) {
    toast.success(result.message);
    setNewTryout({
     location: "",
     date: "",
     startTime: "",
     endTime: "",
     ageGroup: "",
     maxCapacity: "",
     notes: "",
    });
    loadData();
    setActiveTab("schedule");
   } else {
    toast.error(result.message || "Failed to create tryout session", {
      description: result.error
    });
   }
  } catch (error) {
   console.error(error);
   toast.error("An error occurred. Please try again.");
  }
 };

 const handleUpdateTryout = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editingTryout) return;

  try {
   const result = await updateTryout({
    id: editingTryout.id,
    ...newTryout,
    date: new Date(newTryout.date).toISOString(),
   });

   if (result.success) {
    toast.success(result.message);
    setEditingTryout(null);
    setNewTryout({
     location: "",
     date: "",
     startTime: "",
     endTime: "",
     ageGroup: "",
     maxCapacity: "",
     notes: "",
    });
    loadData();
    setActiveTab("schedule");
   } else {
    toast.error(result.message || "Failed to update tryout session", {
      description: result.error
    });
   }
  } catch (error) {
   console.error("Error updating tryout:", error);
   toast.error("Error updating tryout session");
  }
 };

 const handleDeleteTryout = async (id: string) => {
  if (
   !confirm(
    "Are you sure you want to delete this tryout session? This will also delete all registrations associated with it.",
   )
  ) {
   return;
  }

  try {
   const result = await deleteTryout(id);

   if (result.success) {
    toast.success(result.message);
    if (selectedTryoutId === id) setSelectedTryoutId(null);
    loadData();
   } else {
    toast.error(result.message || "Failed to delete tryout session");
   }
  } catch (error) {
   console.error("Error deleting tryout:", error);
   toast.error("Error deleting tryout session");
  }
 };

 const startEditingTryout = (tryout: ExtendedTryout) => {
  setEditingTryout(tryout);
  setNewTryout({
   location: tryout.location,
   date: new Date(tryout.date).toISOString().split("T")[0],
   startTime: tryout.startTime,
   endTime: tryout.endTime,
   ageGroup: tryout.ageGroup,
   maxCapacity: tryout.maxCapacity?.toString() || "",
   notes: tryout.notes || "",
  });
  setActiveTab("create");
 };

 const cancelEditing = () => {
  setEditingTryout(null);
  setNewTryout({
   location: "",
   date: "",
   startTime: "",
   endTime: "",
   ageGroup: "",
   maxCapacity: "",
   notes: "",
  });
  setActiveTab("schedule");
 };

 const selectedTryout = tryouts.find(t => t.id === selectedTryoutId);
 const filteredRegistrations = registrations.filter(
  (reg) =>
   reg.tryoutId === selectedTryoutId &&
   (reg.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
   reg.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
   reg.parentEmail.toLowerCase().includes(searchTerm.toLowerCase()))
 );

 return (
  <div className="min-h-screen bg-black text-white">
   <Navbar />
   <Toaster position="top-center" richColors />

   <main className="mx-auto px-6 md:px-16 pt-28 pb-12">
    <motion.div 
     initial={{ opacity: 0, y: -20 }}
     animate={{ opacity: 1, y: 0 }}
     className="space-y-8"
    >
     {/* Admin Header & Stats */}
     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-2 bg-card p-8 rounded-2xl border border-border flex items-center justify-between shadow-xl">
       <div className="space-y-1">
        <h1 className="text-3xl font-impact tracking-wider uppercase">ADMIN <span className="text-primary">PANEL</span></h1>
        <p className="text-muted-foreground text-sm">Organize tryouts and manage registrations.</p>
       </div>
       <div className="bg-zinc-900 p-3 rounded-xl border border-border">
        <LayoutDashboard className="text-primary" size={24} />
       </div>
      </div>
      
      <div className="bg-card p-6 rounded-2xl border border-border flex flex-col justify-center shadow-lg">
       <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Total Registrations</span>
       <div className="flex items-end gap-2">
        <span className="text-3xl font-impact text-white">{registrations.length}</span>
        <Users className="text-primary mb-1" size={18} />
       </div>
      </div>

      <div className="bg-card p-6 rounded-2xl border border-border flex flex-col justify-center shadow-lg">
       <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Active Sessions</span>
       <div className="flex items-end gap-2">
        <span className="text-3xl font-impact text-white">{tryouts.length}</span>
        <Calendar className="text-primary mb-1" size={18} />
       </div>
      </div>
     </div>

     {/* Navigation Tabs */}
     <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-2">
      <div className="flex gap-2">
       {[
        { id: "schedule", label: "Schedule", icon: Calendar },
        { id: "create", label: editingTryout ? "Edit" : "New Session", icon: PlusCircle },
       ].map((tab) => (
        <button
         key={tab.id}
         onClick={() => {
          setActiveTab(tab.id as TabType);
          if (tab.id === "schedule") setSelectedTryoutId(null);
         }}
         className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold uppercase tracking-wider text-[10px] transition-all ${
          activeTab === tab.id
           ? "bg-primary text-white shadow-[0_-4px_15_rgba(220,38,38,0.2)]"
           : "text-muted-foreground "
         }`}
        >
         <tab.icon size={14} />
         {tab.label}
        </button>
       ))}
      </div>

      <Button 
       variant="ghost" 
       size="sm" 
       onClick={() => loadData()}
       className="text-muted-foreground mb-2 gap-2"
      >
       <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
       <span className="text-[10px] font-bold uppercase">Refresh Data</span>
      </Button>
     </div>

     {/* Tab Content */}
     <AnimatePresence mode="wait">
      {activeTab === "schedule" && !selectedTryoutId && (
       <motion.div
        key="schedule-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
       >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         {loading ? (
          [1, 2, 3].map(i => (
           <div key={i} className="h-64 bg-zinc-900 rounded-xl animate-pulse border border-border" />
          ))
         ) : tryouts.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-card rounded-2xl border border-border border-dashed">
           <Calendar className="mx-auto text-zinc-800 mb-4" size={48} />
           <p className="text-muted-foreground uppercase font-bold tracking-widest text-sm">No tryout sessions scheduled.</p>
          </div>
         ) : (
          tryouts.map((tryout, index) => (
           <motion.div 
            key={tryout.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
           >
            <Card className="bg-card border-border h-full flex flex-col shadow-md">
             <CardHeader className="border-b border-zinc-900 pb-4">
              <div className="flex justify-between items-start">
               <div className="space-y-1">
                <CardTitle className="text-2xl font-impact tracking-wider text-white uppercase">
                 {tryout.ageGroup}
                </CardTitle>
                <Badge className="bg-zinc-900 text-red-500 border-border text-[10px] font-black uppercase">Active</Badge>
               </div>
               <div className="flex gap-1">
                <button 
                 onClick={(e) => { e.stopPropagation(); startEditingTryout(tryout); }}
                 className="p-2 text-muted-foreground  rounded-lg "
                 title="Edit Tryout"
                >
                 <Edit2 size={14} />
                </button>
                <button 
                 onClick={(e) => { e.stopPropagation(); handleDeleteTryout(tryout.id); }}
                 className="p-2 text-muted-foreground  rounded-lg "
                 title="Delete Tryout"
                >
                 <Trash2 size={14} />
                </button>
               </div>
              </div>
             </CardHeader>
             <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
               <div className="flex items-center gap-3 text-zinc-400">
                <Calendar size={16} className="text-primary" />
                <span className="text-sm font-bold text-white uppercase">{new Date(tryout.date).toLocaleDateString()}</span>
               </div>
               <div className="flex items-center gap-3 text-zinc-400">
                <Clock size={16} className="text-primary" />
                <span className="text-sm font-bold text-white uppercase">{tryout.startTime} - {tryout.endTime}</span>
               </div>
               <div className="flex items-center gap-3 text-zinc-400">
                <MapPin size={16} className="text-primary" />
                <span className="text-sm font-bold text-zinc-300 uppercase line-clamp-1">{tryout.location}</span>
               </div>
              </div>

              <div className="pt-4 border-t border-zinc-900">
               <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Roster Fill</span>
                <span className="text-[10px] font-black text-zinc-400 uppercase">
                 {tryout._count.registrations} / {tryout.maxCapacity || "∞"}
                </span>
               </div>
               <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${Math.min(100, (tryout._count.registrations / (Number(tryout.maxCapacity) || 100)) * 100)}%` }}
                 className="h-full bg-primary " 
                />
               </div>
               <Button 
                onClick={() => setSelectedTryoutId(tryout.id)}
                className="w-full mt-6 bg-white text-black font-bold h-10 rounded-lg text-xs uppercase tracking-widest transition-all"
               >
                View Player List
               </Button>
              </div>
             </CardContent>
            </Card>
           </motion.div>
          ))
         )}
        </div>
       </motion.div>
      )}

      {activeTab === "schedule" && selectedTryoutId && (
       <motion.div
        key="schedule-roster"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
       >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-center gap-4">
          <Button 
           variant="outline" 
           size="icon" 
           onClick={() => setSelectedTryoutId(null)}
           className="rounded-full border-border text-zinc-400 "
          >
           <ArrowLeft size={18} />
          </Button>
          <div>
           <h2 className="text-2xl font-impact tracking-wide uppercase text-white">
            {selectedTryout?.ageGroup} <span className="text-primary">Roster</span>
           </h2>
           <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
            {selectedTryout?.location} • {new Date(selectedTryout?.date || '').toLocaleDateString()}
           </p>
          </div>
         </div>
         
         <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
           placeholder="Search players or parents..."
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="bg-card border-border pl-10 focus:border-primary h-10 w-full rounded-full"
          />
         </div>
        </div>

        {loading ? (
         <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-zinc-900 rounded-xl animate-pulse border border-border" />)}
         </div>
        ) : filteredRegistrations.length === 0 ? (
         <div className="py-20 text-center bg-card rounded-2xl border border-border border-dashed">
          <Users className="mx-auto text-zinc-800 mb-4" size={48} />
          <p className="text-muted-foreground uppercase font-bold tracking-widest text-sm">No players registered for this session yet.</p>
         </div>
        ) : (
         <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-xl">
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-8 py-4 bg-zinc-900/50 border-b border-border text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
           <div className="col-span-4">Player Name</div>
           <div className="col-span-2">Grade</div>
           <div className="col-span-2">Age</div>
           <div className="col-span-3">Parent Name</div>
           <div className="col-span-1 text-right"></div>
          </div>

          <div className="divide-y divide-zinc-900">
           {filteredRegistrations.map((reg, index) => {
            const isExpanded = expandedPlayerId === reg.id;
            
            return (
             <motion.div 
              key={reg.id} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              className="group"
             >
              {/* Main Row */}
              <div 
               onClick={() => setExpandedPlayerId(isExpanded ? null : reg.id)}
               className={`grid grid-cols-2 lg:grid-cols-12 gap-4 px-8 py-5 cursor-pointer transition-colors hover:bg-white/[0.02] items-center ${isExpanded ? 'bg-white/[0.03]' : ''}`}
              >
               <div className="col-span-1 lg:col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] font-black text-primary border border-border group-hover:border-primary/50 transition-colors">
                 {reg.playerName.substring(0, 2).toUpperCase()}
                </div>
                <span className="font-impact uppercase tracking-wider text-white text-lg">{reg.playerName}</span>
               </div>
               
               <div className="hidden lg:block lg:col-span-2">
                <Badge variant="secondary" className="bg-zinc-900 text-zinc-400 border-border text-[10px] uppercase font-bold">{reg.playerGrade}</Badge>
               </div>
               
               <div className="hidden lg:block lg:col-span-2">
                <span className="text-sm font-bold text-zinc-400 uppercase">{reg.playerAge} Yrs</span>
               </div>
               
               <div className="hidden lg:block lg:col-span-3">
                <span className="text-sm text-zinc-300 font-medium">{reg.parentName}</span>
               </div>

               <div className="col-span-1 lg:col-span-1 flex justify-end">
                {isExpanded ? <ChevronUp size={18} className="text-primary" /> : <ChevronDown size={18} className="text-zinc-600" />}
               </div>

               {/* Mobile visible info */}
               <div className="lg:hidden col-span-2 mt-2 flex gap-2">
                <Badge variant="secondary" className="bg-zinc-900 text-zinc-400 border-border text-[10px] uppercase font-bold">{reg.playerGrade}</Badge>
                <Badge variant="secondary" className="bg-zinc-900 text-zinc-400 border-border text-[10px] uppercase font-bold">{reg.playerAge} Yrs</Badge>
               </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
               {isExpanded && (
                <motion.div
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: "auto", opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 className="overflow-hidden bg-black/40"
                >
                 <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-zinc-900">
                  <div className="space-y-4">
                   <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest">
                    <UserIcon size={12} /> Contact Information
                   </div>
                   <div className="space-y-3">
                    <div className="p-3 bg-zinc-900/50 rounded-xl border border-border">
                     <p className="text-[10px] text-zinc-600 uppercase font-black mb-1">Parent Name</p>
                     <p className="text-sm font-bold text-white uppercase">{reg.parentName}</p>
                    </div>
                    <div className="p-3 bg-zinc-900/50 rounded-xl border border-border">
                     <p className="text-[10px] text-zinc-600 uppercase font-black mb-1">Email Address</p>
                     <a href={`mailto:${reg.parentEmail}`} className="text-sm font-bold text-primary hover:underline">{reg.parentEmail}</a>
                    </div>
                    <div className="p-3 bg-zinc-900/50 rounded-xl border border-border">
                     <p className="text-[10px] text-zinc-600 uppercase font-black mb-1">Phone Number</p>
                     <a href={`tel:${reg.parentPhone}`} className="text-sm font-bold text-white">{reg.parentPhone}</a>
                    </div>
                   </div>
                  </div>

                  <div className="space-y-4">
                   <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest">
                    <AlertCircle size={12} /> Emergency Contact
                   </div>
                   <div className="space-y-3">
                    <div className="p-3 bg-zinc-900/50 rounded-xl border border-border">
                     <p className="text-[10px] text-zinc-600 uppercase font-black mb-1">Contact Name</p>
                     <p className="text-sm font-bold text-white uppercase">{reg.emergencyContact}</p>
                    </div>
                    <div className="p-3 bg-zinc-900/50 rounded-xl border border-border">
                     <p className="text-[10px] text-zinc-600 uppercase font-black mb-1">Emergency Phone</p>
                     <a href={`tel:${reg.emergencyPhone}`} className="text-sm font-bold text-white">{reg.emergencyPhone}</a>
                    </div>
                   </div>
                  </div>

                  <div className="space-y-4">
                   <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest">
                    <LayoutDashboard size={12} /> Medical & Extra Info
                   </div>
                   <div className="p-5 bg-zinc-900/50 rounded-2xl border border-border min-h-[120px]">
                    {reg.medicalInfo ? (
                     <p className="text-sm text-zinc-400 italic leading-relaxed">&quot;{reg.medicalInfo}&quot;</p>
                    ) : (
                     <p className="text-sm text-zinc-600 uppercase font-black tracking-widest text-center mt-8">No medical info provided</p>
                    )}
                   </div>
                  </div>
                 </div>
                </motion.div>
               )}
              </AnimatePresence>
             </motion.div>
            );
           })}
          </div>
         </div>
        )}
       </motion.div>
      )}

      {activeTab === "create" && (
       <motion.div
        key="create"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="max-w-3xl mx-auto"
       >
        <Card className="bg-card border-border rounded-3xl overflow-hidden">
         <CardHeader className="border-b border-zinc-900 p-8">
          <CardTitle className="text-3xl font-impact tracking-wider text-white uppercase">
           {editingTryout ? "EDIT SESSION" : "NEW TRYOUT SESSION"}
          </CardTitle>
          <CardDescription className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest mt-2">
           Official Shadow Basketball schedule configuration
          </CardDescription>
         </CardHeader>
         <CardContent className="p-10">
          <form onSubmit={editingTryout ? handleUpdateTryout : handleCreateTryout} className="space-y-8">
           <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
             <Label htmlFor="ageGroup" className="text-muted-foreground uppercase text-[10px] font-bold tracking-[0.2em] ml-1">Age Group *</Label>
             <Input
              id="ageGroup"
              required
              placeholder="e.g. U12 BOYS"
              value={newTryout.ageGroup}
              onChange={(e) => setNewTryout({ ...newTryout, ageGroup: e.target.value })}
              className="bg-black border-border text-white focus:border-primary h-12 rounded-xl"
             />
            </div>
            <div className="space-y-3">
             <Label htmlFor="date" className="text-muted-foreground uppercase text-[10px] font-bold tracking-[0.2em] ml-1">Date *</Label>
             <Input
              id="date"
              type="date"
              required
              value={newTryout.date as string}
              onChange={(e) => setNewTryout({ ...newTryout, date: e.target.value })}
              className="bg-black border-border text-white focus:border-primary h-12 rounded-xl"
             />
            </div>
            <div className="space-y-3">
             <Label htmlFor="startTime" className="text-muted-foreground uppercase text-[10px] font-bold tracking-[0.2em] ml-1">Start Time *</Label>
             <Input
              id="startTime"
              type="time"
              required
              value={newTryout.startTime}
              onChange={(e) => setNewTryout({ ...newTryout, startTime: e.target.value })}
              className="bg-black border-border text-white focus:border-primary h-12 rounded-xl"
             />
            </div>
            <div className="space-y-3">
             <Label htmlFor="endTime" className="text-muted-foreground uppercase text-[10px] font-bold tracking-[0.2em] ml-1">End Time *</Label>
             <Input
              id="endTime"
              type="time"
              required
              value={newTryout.endTime}
              onChange={(e) => setNewTryout({ ...newTryout, endTime: e.target.value })}
              className="bg-black border-border text-white focus:border-primary h-12 rounded-xl"
             />
            </div>
            <div className="space-y-3">
             <Label htmlFor="location" className="text-muted-foreground uppercase text-[10px] font-bold tracking-[0.2em] ml-1">Location *</Label>
             <Input
              id="location"
              required
              placeholder="Gym Court 1"
              value={newTryout.location}
              onChange={(e) => setNewTryout({ ...newTryout, location: e.target.value })}
              className="bg-black border-border text-white focus:border-primary h-12 rounded-xl"
             />
            </div>
            <div className="space-y-3">
             <Label htmlFor="maxCapacity" className="text-muted-foreground uppercase text-[10px] font-bold tracking-[0.2em] ml-1">Max Capacity</Label>
             <Input
              id="maxCapacity"
              type="number"
              placeholder="Unlimited"
              value={newTryout.maxCapacity as string}
              onChange={(e) => setNewTryout({ ...newTryout, maxCapacity: e.target.value })}
              className="bg-black border-border text-white focus:border-primary h-12 rounded-xl"
             />
            </div>
           </div>
           <div className="space-y-3">
            <Label htmlFor="notes" className="text-muted-foreground uppercase text-[10px] font-bold tracking-[0.2em] ml-1">Additional Notes</Label>
            <Input
             id="notes"
             placeholder="Instructions for parents..."
             value={newTryout.notes}
             onChange={(e) => setNewTryout({ ...newTryout, notes: e.target.value })}
             className="bg-black border-border text-white focus:border-primary h-12 rounded-xl"
            />
           </div>
           <div className="flex gap-4 pt-6">
            <Button
             type="submit"
             className="flex-1 bg-primary text-white font-bold h-14 text-lg rounded-2xl transition-all active:scale-[0.98]"
            >
             {editingTryout ? "SAVE CHANGES" : "PUBLISH SESSION"}
            </Button>
            {editingTryout && (
             <Button
              type="button"
              onClick={cancelEditing}
              variant="outline"
              className="flex-1 border-border text-zinc-400  h-14 text-lg rounded-2xl transition-all"
             >
              CANCEL
             </Button>
            )}
           </div>
          </form>
         </CardContent>
        </Card>
       </motion.div>
      )}
     </AnimatePresence>
    </motion.div>
   </main>
  </div>
 );
}

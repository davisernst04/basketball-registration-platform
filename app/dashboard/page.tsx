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
  ChevronRight, 
  MapPin, 
  Clock,
  LayoutDashboard,
  ArrowLeft,
  Mail,
  Phone,
  User as UserIcon,
  AlertCircle,
  Filter
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function DashboardPage() {
  const [registrations, setRegistrations] = useState<ExtendedRegistration[]>([]);
  const [tryouts, setTryouts] = useState<ExtendedTryout[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "registrations" | "tryouts" | "create"
  >("registrations");
  const [selectedTryoutId, setSelectedTryoutId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTryout, setEditingTryout] = useState<ExtendedTryout | null>(null);

  const [newTryout, setNewTryout] = useState<TryoutFormData>({
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    ageGroup: "",
    maxCapacity: "",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [regRes, tryRes] = await Promise.all([
        fetch("/api/registrations"),
        fetch("/api/tryouts"),
      ]);

      if (regRes.ok) {
        const regData = await regRes.json();
        setRegistrations(regData);
      }

      if (tryRes.ok) {
        const tryData = await tryRes.json();
        setTryouts(tryData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

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
        setActiveTab("tryouts");
      } else {
        toast.error(result.message || "Failed to create tryout session");
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
        setActiveTab("tryouts");
      } else {
        toast.error(result.message || "Failed to update tryout session");
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
    setActiveTab("tryouts");
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

      <main className="container mx-auto px-4 pt-28 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Admin Header & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 bg-zinc-950 p-8 rounded-2xl border border-zinc-800 flex items-center justify-between shadow-xl">
              <div className="space-y-1">
                <h1 className="text-3xl font-impact tracking-wider uppercase">ADMIN <span className="text-red-600">PANEL</span></h1>
                <p className="text-zinc-500 text-sm">Organize tryouts and manage registrations.</p>
              </div>
              <div className="bg-red-600/10 p-3 rounded-xl border border-red-600/20">
                <LayoutDashboard className="text-red-600" size={24} />
              </div>
            </div>
            
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 flex flex-col justify-center shadow-lg">
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Total Registrations</span>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-impact text-white">{registrations.length}</span>
                <Users className="text-red-600 mb-1" size={18} />
              </div>
            </div>

            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 flex flex-col justify-center shadow-lg">
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Active Sessions</span>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-impact text-white">{tryouts.length}</span>
                <Calendar className="text-red-600 mb-1" size={18} />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-2">
            <div className="flex gap-2">
              {[
                { id: "registrations", label: "Players", icon: Users },
                { id: "tryouts", label: "Schedule", icon: Calendar },
                { id: "create", label: editingTryout ? "Edit" : "New Session", icon: PlusCircle },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (tab.id !== "registrations") setSelectedTryoutId(null);
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold uppercase tracking-wider text-[10px] transition-all ${
                    activeTab === tab.id
                      ? "bg-red-600 text-white shadow-[0_-4px_15px_rgba(220,38,38,0.2)]"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "registrations" && (
              <motion.div
                key="registrations"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                {!selectedTryoutId ? (
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="col-span-full mb-2">
                      <h2 className="text-2xl font-impact tracking-wide uppercase flex items-center gap-3">
                        <Filter className="text-red-600" size={20} />
                        Select Tryout to View Players
                      </h2>
                    </div>
                    {tryouts.map((tryout) => (
                      <motion.div key={tryout.id} variants={itemVariants}>
                        <Card 
                          className="bg-zinc-950 border-zinc-800 cursor-pointer transition-colors shadow-md"
                          onClick={() => setSelectedTryoutId(tryout.id)}
                        >
                          <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl font-impact tracking-wider text-white uppercase">
                                {tryout.ageGroup}
                              </CardTitle>
                              <Badge className="bg-zinc-900 text-zinc-400 border-zinc-800">
                                {tryout._count.registrations} Players
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
                              <Calendar size={14} className="text-red-600" />
                              {new Date(tryout.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Manage List</span>
                              <ChevronRight className="text-zinc-700" size={18} />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => setSelectedTryoutId(null)}
                          className="rounded-full border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
                        >
                          <ArrowLeft size={18} />
                        </Button>
                        <div>
                          <h2 className="text-2xl font-impact tracking-wide uppercase text-white">
                            {selectedTryout?.ageGroup} <span className="text-red-600">Roster</span>
                          </h2>
                          <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">
                            {selectedTryout?.location} • {new Date(selectedTryout?.date || '').toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <Input
                          placeholder="Search players or parents..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="bg-zinc-950 border-zinc-800 pl-10 focus:border-red-600 h-10 w-full rounded-full"
                        />
                      </div>
                    </div>

                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-zinc-900 rounded-xl animate-pulse border border-zinc-800" />)}
                      </div>
                    ) : filteredRegistrations.length === 0 ? (
                      <div className="py-20 text-center bg-zinc-950 rounded-2xl border border-zinc-800 border-dashed">
                        <Users className="mx-auto text-zinc-800 mb-4" size={48} />
                        <p className="text-zinc-500 uppercase font-bold tracking-widest text-sm">No players registered for this session yet.</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {filteredRegistrations.map((reg) => (
                          <motion.div key={reg.id} variants={itemVariants}>
                            <Card className="bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-all overflow-hidden shadow-sm">
                              <div className="flex flex-col lg:flex-row items-stretch">
                                <div className="p-6 lg:w-1/4 border-b lg:border-b-0 lg:border-r border-zinc-900 flex flex-col justify-center bg-gradient-to-br from-zinc-900/50 to-transparent">
                                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1">Player</span>
                                  <h3 className="text-xl font-impact uppercase text-white">{reg.playerName}</h3>
                                  <div className="flex gap-2 mt-2">
                                    <Badge variant="secondary" className="bg-zinc-900 text-zinc-400 border-zinc-800 text-[10px] uppercase font-bold tracking-tighter">{reg.playerGrade}</Badge>
                                    <Badge variant="secondary" className="bg-zinc-900 text-zinc-400 border-zinc-800 text-[10px] uppercase font-bold tracking-tighter">{reg.playerAge} Yrs</Badge>
                                  </div>
                                </div>
                                
                                <div className="p-6 lg:w-2/4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                                      <UserIcon size={10} /> Parent / Guardian
                                    </span>
                                    <p className="text-sm font-bold text-zinc-300">{reg.parentName}</p>
                                    <div className="space-y-1">
                                      <a href={`mailto:${reg.parentEmail}`} className="text-xs text-zinc-500 hover:text-red-500 flex items-center gap-2 transition-colors">
                                        <Mail size={12} /> {reg.parentEmail}
                                      </a>
                                      <a href={`tel:${reg.parentPhone}`} className="text-xs text-zinc-500 hover:text-red-500 flex items-center gap-2 transition-colors">
                                        <Phone size={12} /> {reg.parentPhone}
                                      </a>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                                      <AlertCircle size={10} /> Emergency Contact
                                    </span>
                                    <p className="text-sm font-bold text-zinc-300">{reg.emergencyContact}</p>
                                    <a href={`tel:${reg.emergencyPhone}`} className="text-xs text-zinc-500 hover:text-red-500 flex items-center gap-2 transition-colors">
                                      <Phone size={12} /> {reg.emergencyPhone}
                                    </a>
                                  </div>
                                </div>

                                <div className="p-6 lg:w-1/4 bg-zinc-900/20 flex flex-col justify-center">
                                  {reg.medicalInfo ? (
                                    <div className="space-y-1">
                                      <span className="text-[10px] font-bold text-yellow-600/70 uppercase tracking-widest">Medical Info</span>
                                      <p className="text-xs text-zinc-500 line-clamp-3 italic">&quot;{reg.medicalInfo}&quot;</p>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">No Medical Notes</span>
                                  )}
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "tryouts" && (
              <motion.div
                key="tryouts"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {loading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-64 bg-zinc-900 rounded-xl animate-pulse border border-zinc-800" />)
                ) : tryouts.length === 0 ? (
                  <div className="col-span-full py-20 text-center bg-zinc-950 rounded-2xl border border-zinc-800 border-dashed">
                    <Calendar className="mx-auto text-zinc-800 mb-4" size={48} />
                    <p className="text-zinc-500 uppercase font-bold tracking-widest text-sm">No tryout sessions scheduled.</p>
                  </div>
                ) : (
                  tryouts.map((tryout) => (
                    <motion.div key={tryout.id} variants={itemVariants}>
                      <Card className="bg-zinc-950 border-zinc-800 transition-colors h-full flex flex-col shadow-md">
                        <CardHeader className="border-b border-zinc-900 pb-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <CardTitle className="text-2xl font-impact tracking-wider text-white uppercase">
                                {tryout.ageGroup}
                              </CardTitle>
                              <Badge className="bg-red-600/10 text-red-500 border-red-600/20 text-[10px] font-black uppercase">Active</Badge>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                onClick={(e) => { e.stopPropagation(); startEditingTryout(tryout); }}
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800"
                              >
                                <Edit2 size={14} />
                              </Button>
                              <Button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteTryout(tryout.id); }}
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-zinc-500 hover:text-red-500 hover:bg-red-950/20"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 text-zinc-400">
                              <Calendar size={16} className="text-red-600" />
                              <span className="text-sm font-bold text-white uppercase">{new Date(tryout.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-400">
                              <Clock size={16} className="text-red-600" />
                              <span className="text-sm font-bold text-white uppercase">{tryout.startTime} - {tryout.endTime}</span>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-400">
                              <MapPin size={16} className="text-red-600" />
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
                                animate={{ width: `${Math.min(100, (tryout._count.registrations / (tryout.maxCapacity || 100)) * 100)}%` }}
                                className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" 
                              />
                            </div>
                            <Button 
                              onClick={() => { setSelectedTryoutId(tryout.id); setActiveTab("registrations"); }}
                              className="w-full mt-6 bg-white hover:bg-red-600 text-black hover:text-white font-bold h-10 rounded-lg text-xs uppercase tracking-widest transition-all"
                            >
                              View Player List
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
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
                <Card className="bg-zinc-950 border-zinc-800 rounded-3xl overflow-hidden">
                  <CardHeader className="border-b border-zinc-900 p-8">
                    <CardTitle className="text-3xl font-impact tracking-wider text-white uppercase">
                      {editingTryout ? "EDIT SESSION" : "NEW TRYOUT SESSION"}
                    </CardTitle>
                    <CardDescription className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest mt-2">
                      Official Shadow Basketball schedule configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-10">
                    <form onSubmit={editingTryout ? handleUpdateTryout : handleCreateTryout} className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="ageGroup" className="text-zinc-500 uppercase text-[10px] font-bold tracking-[0.2em] ml-1">Age Group *</Label>
                          <Input
                            id="ageGroup"
                            required
                            placeholder="e.g. U12 BOYS"
                            value={newTryout.ageGroup}
                            onChange={(e) => setNewTryout({ ...newTryout, ageGroup: e.target.value })}
                            className="bg-black border-zinc-800 text-white focus:border-red-600 h-12 rounded-xl"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="date" className="text-zinc-500 uppercase text-[10px] font-bold tracking-[0.2em] ml-1">Date *</Label>
                          <Input
                            id="date"
                            type="date"
                            required
                            value={newTryout.date as string}
                            onChange={(e) => setNewTryout({ ...newTryout, date: e.target.value })}
                            className="bg-black border-zinc-800 text-white focus:border-red-600 h-12 rounded-xl"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="startTime" className="text-zinc-500 uppercase text-[10px] font-bold tracking-[0.2em] ml-1">Start Time *</Label>
                          <Input
                            id="startTime"
                            type="time"
                            required
                            value={newTryout.startTime}
                            onChange={(e) => setNewTryout({ ...newTryout, startTime: e.target.value })}
                            className="bg-black border-zinc-800 text-white focus:border-red-600 h-12 rounded-xl"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="endTime" className="text-zinc-500 uppercase text-[10px] font-bold tracking-[0.2em] ml-1">End Time *</Label>
                          <Input
                            id="endTime"
                            type="time"
                            required
                            value={newTryout.endTime}
                            onChange={(e) => setNewTryout({ ...newTryout, endTime: e.target.value })}
                            className="bg-black border-zinc-800 text-white focus:border-red-600 h-12 rounded-xl"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="location" className="text-zinc-500 uppercase text-[10px] font-bold tracking-[0.2em] ml-1">Location *</Label>
                          <Input
                            id="location"
                            required
                            placeholder="Gym Court 1"
                            value={newTryout.location}
                            onChange={(e) => setNewTryout({ ...newTryout, location: e.target.value })}
                            className="bg-black border-zinc-800 text-white focus:border-red-600 h-12 rounded-xl"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="maxCapacity" className="text-zinc-500 uppercase text-[10px] font-bold tracking-[0.2em] ml-1">Max Capacity</Label>
                          <Input
                            id="maxCapacity"
                            type="number"
                            placeholder="Unlimited"
                            value={newTryout.maxCapacity as string}
                            onChange={(e) => setNewTryout({ ...newTryout, maxCapacity: e.target.value })}
                            className="bg-black border-zinc-800 text-white focus:border-red-600 h-12 rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="notes" className="text-zinc-500 uppercase text-[10px] font-bold tracking-[0.2em] ml-1">Additional Notes</Label>
                        <Input
                          id="notes"
                          placeholder="Instructions for parents..."
                          value={newTryout.notes}
                          onChange={(e) => setNewTryout({ ...newTryout, notes: e.target.value })}
                          className="bg-black border-zinc-800 text-white focus:border-red-600 h-12 rounded-xl"
                        />
                      </div>
                      <div className="flex gap-4 pt-6">
                        <Button
                          type="submit"
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold h-14 text-lg rounded-2xl transition-all active:scale-[0.98]"
                        >
                          {editingTryout ? "SAVE CHANGES" : "PUBLISH SESSION"}
                        </Button>
                        {editingTryout && (
                          <Button
                            type="button"
                            onClick={cancelEditing}
                            variant="outline"
                            className="flex-1 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 h-14 text-lg rounded-2xl transition-all"
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
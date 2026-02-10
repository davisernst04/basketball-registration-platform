"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
 Card,
 CardContent,
 CardHeader,
 CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { User as UserIcon, ShieldCheck, Mail, Loader2, Save } from "lucide-react";
import { updateProfile } from "../actions";
import { Profile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserProfileProps {
 profile: Profile;
}

export default function UserProfile({ profile }: UserProfileProps) {
 const [loading, setLoading] = useState(false);
 const [formData, setFormData] = useState({
  fullName: profile.fullName || "",
  username: profile.username || "",
 });

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
   const result = await updateProfile(formData);
   if (result.success) {
    toast.success(result.message);
   } else {
    toast.error(result.message);
   }
  } catch (err) {
   toast.error("An unexpected error occurred");
  } finally {
   setLoading(false);
  }
 };

 return (
  <motion.div
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   className="max-w-4xl mx-auto"
  >
   <Card className="bg-card border-border rounded-3xl overflow-hidden shadow-2xl">
    <div className="h-32 bg-primary relative">
     <div className="absolute -bottom-16 left-8 md:left-12">
      <Avatar className="h-32 w-32 border-4 border-black shadow-xl">
       <AvatarImage src={profile.avatarUrl || ""} />
       <AvatarFallback className="bg-zinc-900 text-primary text-3xl font-impact">
        {profile.email?.substring(0, 2).toUpperCase()}
       </AvatarFallback>
      </Avatar>
     </div>
    </div>

    <CardHeader className="pt-20 pb-8 px-8 md:px-12 border-b border-border">
     <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-1">
       <CardTitle className="text-4xl font-impact tracking-wider text-white uppercase">
        {profile.fullName || "New Athlete"}
       </CardTitle>
       <div className="flex items-center gap-3">
        <span className="text-zinc-500 text-sm font-medium">@{profile.username || "athlete"}</span>
        <Badge className="bg-zinc-900 text-primary border-border px-3 py-0.5 font-bold tracking-widest text-[10px] uppercase">
         {profile.role}
        </Badge>
       </div>
      </div>
     </div>
    </CardHeader>

    <CardContent className="p-8 md:p-12">
     <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid md:grid-cols-2 gap-8">
       <div className="space-y-3">
        <Label htmlFor="fullName" className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Full Name</Label>
        <Input
         id="fullName"
         value={formData.fullName}
         onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
         className="bg-black border-border text-white focus:border-primary h-14 rounded-2xl transition-all"
         required
        />
       </div>

       <div className="space-y-3">
        <Label htmlFor="username" className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Username</Label>
        <Input
         id="username"
         value={formData.username}
         onChange={(e) => setFormData({ ...formData, username: e.target.value })}
         className="bg-black border-border text-white focus:border-primary h-14 rounded-2xl transition-all"
         required
        />
       </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-4">
       <div className="bg-black/30 p-6 rounded-2xl border border-border flex items-center gap-4">
        <div className="bg-zinc-900 p-3 rounded-xl">
         <Mail className="text-primary" size={20} />
        </div>
        <div>
         <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Primary Email</p>
         <p className="text-zinc-300 font-bold text-sm">{profile.email}</p>
        </div>
       </div>

       <div className="bg-black/30 p-6 rounded-2xl border border-border flex items-center gap-4">
        <div className="bg-zinc-900 p-3 rounded-xl">
         <ShieldCheck className="text-primary" size={20} />
        </div>
        <div>
         <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Account Role</p>
         <p className="text-zinc-300 font-bold text-sm uppercase">{profile.role} Access</p>
        </div>
       </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
       <Button
        type="submit"
        disabled={loading}
        className="flex-1 bg-primary text-white font-impact text-xl h-14 rounded-2xl gap-2 transition-all active:scale-95"
       >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
        SAVE CHANGES
       </Button>
      </div>
     </form>
    </CardContent>
   </Card>
  </motion.div>
 );
}

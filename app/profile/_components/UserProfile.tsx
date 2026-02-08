"use client";

import { useState } from "react";
import { Profile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Shield, Edit2, Save, X, Camera, Loader2 } from "lucide-react";
import { updateProfile } from "../actions";
import { toast } from "sonner";

interface UserProfileProps {
  initialProfile: Profile;
}

export default function UserProfile({ initialProfile }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [formData, setFormData] = useState({
    username: initialProfile.username || "",
    fullName: initialProfile.fullName || "",
    avatarUrl: initialProfile.avatarUrl || "",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfile(formData);
      if (result.success && result.data) {
        setProfile(result.data);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating your profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div
      >
        <Card className="bg-zinc-950 border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="h-32 bg-gradient-to-r from-red-900 to-black relative">
             <div className="absolute -bottom-16 left-8 md:left-12">
                <div className="relative group">
                    <Avatar className="h-32 w-32 border-4 border-zinc-950 shadow-xl">
                        <AvatarImage src={isEditing ? formData.avatarUrl : profile.avatarUrl || undefined} />
                        <AvatarFallback className="bg-zinc-900 text-red-600 text-3xl font-impact">
                            {profile.email?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="text-white" size={24} />
                        </div>
                    )}
                </div>
             </div>
          </div>

          <CardHeader className="pt-20 pb-8 px-8 md:px-12 border-b border-zinc-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <CardTitle className="text-4xl md:text-5xl font-impact tracking-wider text-white uppercase">
                  {profile.fullName || "SHADOW ATHLETE"}
                </CardTitle>
                <div className="flex items-center gap-3">
                    <Badge className="bg-red-600/10 text-red-500 border-red-600/20 px-3 py-0.5 font-bold tracking-widest text-[10px] uppercase">
                        {profile.role}
                    </Badge>
                    <span className="text-zinc-500 text-sm font-medium">@{profile.username || "athlete"}</span>
                </div>
              </div>
              {!isEditing && (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 rounded-xl px-6 h-12 gap-2"
                >
                  <Edit2 size={16} /> EDIT PROFILE
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.form
                  key="edit"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleUpdate}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="fullName" className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="bg-zinc-900/50 border-zinc-800 text-white focus:border-red-600 h-14 rounded-2xl transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="username" className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="bg-zinc-900/50 border-zinc-800 text-white focus:border-red-600 h-14 rounded-2xl transition-all"
                        placeholder="johndoe"
                      />
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <Label htmlFor="avatarUrl" className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Avatar URL</Label>
                      <Input
                        id="avatarUrl"
                        value={formData.avatarUrl}
                        onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                        className="bg-zinc-900/50 border-zinc-800 text-white focus:border-red-600 h-14 rounded-2xl transition-all"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-zinc-900">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-impact text-xl h-14 rounded-2xl gap-2"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                      SAVE CHANGES
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          username: profile.username || "",
                          fullName: profile.fullName || "",
                          avatarUrl: profile.avatarUrl || "",
                        });
                      }}
                      variant="outline"
                      className="flex-1 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 h-14 rounded-2xl gap-2"
                    >
                      <X size={20} /> CANCEL
                    </Button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-red-600">
                        <Mail size={18} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Contact Information</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-zinc-500 text-xs">Primary Email</p>
                        <p className="text-white text-lg font-medium">{profile.email}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-red-600">
                        <Shield size={18} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Account Security</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-zinc-500 text-xs">Access Level</p>
                        <p className="text-white text-lg font-medium capitalize">{profile.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-10 border-t border-zinc-900">
                     <div className="bg-zinc-900/30 p-8 rounded-2xl border border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h4 className="text-white font-bold uppercase tracking-wider">Member Since</h4>
                            <p className="text-zinc-500 text-sm italic">Joined the Shadow Basketball Season 2026</p>
                        </div>
                        <Button variant="link" className="text-red-600 p-0 font-bold uppercase tracking-widest text-xs hover:text-red-500 transition-colors">
                            VIEW ACCOMPLISHMENTS
                        </Button>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ShieldCheck, Mail, Loader2, Save, Upload } from "lucide-react";
import { updateProfile } from "../actions";
import { Profile } from "@/types";
import { UserAvatar } from "@/components/shadow/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client";

interface UserProfileProps {
  profile: Profile;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function UserProfile({ profile }: UserProfileProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile.fullName || "",
    avatarUrl: profile.avatarUrl || "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(
        "Invalid file type. Please upload a JPEG, PNG or WebP image.",
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Maximum size is 2MB.");
      return;
    }

    setUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, avatarUrl: publicUrl }));
      toast.success("Photo uploaded successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload photo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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

  const displayName =
    profile.fullName || (profile.role === "admin" ? "Admin" : "Parent");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-card border-border rounded-3xl overflow-hidden shadow-2xl relative py-0">
        {/* Cool Gradient Banner */}
        <div className="h-32 bg-linear-to-r from-primary via-black to-zinc-900 relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="px-8 pb-6 border-b border-border relative">
          {/* Avatar positioned to overlap the banner */}
          <div className="absolute -top-12 left-8 z-20">
            <div className="relative group">
              <UserAvatar
                src={formData.avatarUrl}
                fallback={profile.email || ""}
                size="xl"
                className="h-24 w-24 border-4 border-black shadow-xl"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full border-4 border-transparent"
              >
                {uploading ? (
                  <Loader2 className="animate-spin text-white" size={24} />
                ) : (
                  <Upload className="text-white" size={24} />
                )}
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
          </div>

          <div className="pt-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-3xl font-impact tracking-wider text-white uppercase">
                  {displayName}
                </CardTitle>
                <Badge className="bg-zinc-900 text-primary border-border px-3 py-0.5 font-bold tracking-widest text-[10px] uppercase">
                  {profile.role}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence>
              {uploading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-center gap-4 mb-4"
                >
                  <Loader2 className="animate-spin text-primary" size={20} />
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">
                      Uploading Image...
                    </p>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: "linear" }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="fullName"
                  className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] ml-1"
                >
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Enter your full name"
                  className="bg-black border-border text-white focus:border-primary h-12 rounded-xl transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-xl border border-border flex items-center gap-3">
                <div className="bg-zinc-900 p-2 rounded-lg">
                  <Mail className="text-primary" size={16} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">
                    Email
                  </p>
                  <p className="text-zinc-300 font-bold text-xs truncate">
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="bg-black/30 p-4 rounded-xl border border-border flex items-center gap-3">
                <div className="bg-zinc-900 p-2 rounded-lg">
                  <ShieldCheck className="text-primary" size={16} />
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">
                    Role
                  </p>
                  <p className="text-zinc-300 font-bold text-xs uppercase">
                    {profile.role}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading || uploading}
                className="w-full bg-primary text-white font-impact text-lg h-12 rounded-xl gap-2 transition-all active:scale-95"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                SAVE PROFILE
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}


"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import HeroSlideshow from "@/components/HeroSlideshow";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Trophy,
  ArrowRight,
  Award,
  Zap,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Home() {
  const router = useRouter();
  const [featuredTryouts, setFeaturedTryouts] = useState<any[]>([]);
  const [loadingTryouts, setLoadingTryouts] = useState(true);

  useEffect(() => {
    async function fetchTryouts() {
      try {
        const response = await fetch("/api/tryouts");
        if (response.ok) {
          const data = await response.json();
          setFeaturedTryouts(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching tryouts:", error);
      } finally {
        setLoadingTryouts(false);
      }
    }
    fetchTryouts();
  }, []);

  return (
    <main className="bg-black min-h-screen selection:bg-primary/30 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen pt-16 md:pt-20 flex items-center overflow-hidden">
        {/* Background Slideshow - Floats to the right on desktop */}
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-[50vh] md:h-full z-0">
          <HeroSlideshow />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black md:bg-linear-to-r md:from-black md:via-black/20 md:to-transparent pointer-events-none"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-16 w-full relative z-10">
          <div className="md:w-1/2 pt-64 md:pt-0">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.div variants={fadeInUp} className="space-y-2">
                <span className="text-primary font-bold tracking-[0.3em] text-sm md:text-base uppercase inline-block border-l-2 border-primary pl-4">
                  EST. 2018
                </span>
                <h1 className="font-impact text-6xl md:text-8xl lg:text-9xl text-white leading-[0.85] tracking-tight uppercase">
                  SHADOW
                  <br />
                  <span className="text-primary">BASKETBALL</span>
                </h1>
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className="text-zinc-400 text-lg md:text-xl max-w-lg mb-8 leading-relaxed"
              >
                Saskatoon&apos;s premier youth basketball club, dedicated to
                developing elite athletes through world-class training and
                competition.
              </motion.p>

              <motion.div variants={fadeInUp} className="pt-4 max-w-md">
                <Button
                  onClick={() => router.push("/tryouts")}
                  size="lg"
                  className="font-impact bg-primary text-white text-xl md:text-2xl px-10 py-10 w-full rounded-2xl shadow-xl transition-all active:scale-[0.98] group"
                >
                  TRYOUTS
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section - Redesigned for impact and alignment */}
      <section className="py-40 bg-black relative overflow-hidden">
        {/* Large Decorative Text */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 select-none pointer-events-none opacity-[0.02] hidden lg:block">
          <h2 className="font-impact text-[30rem] text-white leading-none">
            SHADOW
          </h2>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            {/* Image Composition */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 relative group"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                <Image
                  src="/action_shot_1.jpg"
                  alt="Shadow Basketball Action"
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
                
                {/* Floating Info Badge on Image */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <p className="text-primary font-impact text-xl uppercase tracking-widest mb-1">Impact Player Development</p>
                    <p className="text-zinc-400 text-sm font-medium uppercase tracking-tighter">Elite Coaching • National Competition • Leadership</p>
                  </div>
                </div>
              </div>

              {/* Decorative Accent */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
            </motion.div>

            {/* Mission Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 space-y-12"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-white/10 rounded-full">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    Our Philosophy
                  </span>
                </div>
                <h2 className="font-impact text-7xl md:text-9xl text-white uppercase leading-[0.85] tracking-tighter">
                  OUR <br />
                  <span className="text-primary">MISSION</span>
                </h2>
                <p className="text-zinc-400 text-xl leading-relaxed font-light max-w-xl">
                  Founded in 2018,{" "}
                  <span className="text-white font-semibold underline decoration-primary underline-offset-8 decoration-2">
                    Shadow Basketball
                  </span>{" "}
                  is the region&apos;s premier destination for youth elite development. 
                  We forge the next generation of leaders through the crucible of competitive basketball.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="group flex gap-6 p-8 bg-zinc-900/30 border border-white/5 rounded-3xl hover:bg-zinc-900/60 hover:border-primary/20 transition-all duration-500">
                  <div className="bg-primary/10 w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500 text-primary">
                    <Zap size={32} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white font-impact text-2xl uppercase tracking-wider">
                      Elite Training
                    </h4>
                    <p className="text-zinc-500 text-base leading-relaxed">
                      High-intensity specialized workouts designed for maximum skill growth and athletic performance.
                    </p>
                  </div>
                </div>

                <div className="group flex gap-6 p-8 bg-zinc-900/30 border border-white/5 rounded-3xl hover:bg-zinc-900/60 hover:border-primary/20 transition-all duration-500">
                  <div className="bg-primary/10 w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500 text-primary">
                    <Award size={32} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white font-impact text-2xl uppercase tracking-wider">
                      National Stage
                    </h4>
                    <p className="text-zinc-500 text-base leading-relaxed">
                      We compete in the most prestigious tournaments nationwide, providing players maximum exposure.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Tryouts Section */}
      <section className="py-40 bg-zinc-950/50 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24 space-y-6"
          >
            <h2 className="font-impact text-7xl md:text-9xl text-white uppercase tracking-tighter leading-none">
              UPCOMING <span className="text-primary">TRYOUTS</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </motion.div>

          <div className="grid lg:grid-cols-1 gap-12 max-w-5xl mx-auto mb-20">
            {loadingTryouts ? (
              [1, 2].map((i) => (
                <div
                  key={i}
                  className="h-[400px] bg-zinc-900/50 rounded-[3rem] animate-pulse border border-white/5"
                />
              ))
            ) : featuredTryouts.length === 0 ? (
              <div className="py-32 text-center bg-zinc-900/20 rounded-[3rem] border border-white/5 border-dashed">
                <p className="text-zinc-500 font-impact text-3xl uppercase tracking-widest">
                  Registration Closed
                </p>
              </div>
            ) : (
              featuredTryouts.map((tryout, i) => (
                <motion.div
                  key={tryout.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border p-10 md:p-16 rounded-[3rem] flex flex-col md:flex-row justify-between items-stretch transition-all duration-500 group shadow-2xl relative overflow-hidden"
                >
                  {/* Decorative background number */}
                  <div className="absolute -bottom-10 -right-10 text-[15rem] font-impact text-white/[0.02] pointer-events-none">
                    0{i + 1}
                  </div>

                  <div className="flex flex-col justify-between space-y-12 md:space-y-0 md:w-3/5">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-primary text-white text-xs font-black px-4 py-1.5 tracking-tighter">
                          OPEN REGISTRATION
                        </Badge>
                        <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
                          Season 2026
                        </span>
                      </div>
                      <h3 className="text-6xl md:text-8xl font-impact text-white uppercase tracking-wider leading-none">
                        {tryout.ageGroup}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-primary text-xs font-black uppercase tracking-widest">
                          <Calendar size={18} /> The Date
                        </div>
                        <p className="text-white font-bold text-2xl uppercase font-impact tracking-tight">
                          {new Date(tryout.date).toLocaleDateString(undefined, {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-primary text-xs font-black uppercase tracking-widest">
                          <Clock size={18} /> The Time
                        </div>
                        <p className="text-white font-bold text-2xl uppercase font-impact tracking-tight">
                          {tryout.startTime} - {tryout.endTime}
                        </p>
                      </div>
                      <div className="sm:col-span-2 space-y-3">
                        <div className="flex items-center gap-3 text-primary text-xs font-black uppercase tracking-widest">
                          <MapPin size={18} /> The Arena
                        </div>
                        <p className="text-zinc-300 font-medium text-2xl border-l-4 border-primary pl-6 py-2 uppercase font-impact tracking-wider">
                          {tryout.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 md:mt-0 md:w-1/3 flex flex-col justify-end">
                    <Button
                      onClick={() => router.push("/register/" + tryout.id)}
                      className="w-full bg-white text-black font-impact text-3xl h-24 rounded-2xl transition-all active:scale-95 shadow-xl hover:bg-zinc-200"
                    >
                      SECURE SPOT
                    </Button>
                    <p className="text-center text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mt-6">
                      Limited Capacity • Saskatoon, SK
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="text-center">
            <Link
              href="/tryouts"
              className="inline-flex items-center gap-4 text-zinc-500 hover:text-primary transition-all font-impact uppercase tracking-[0.3em] text-lg group"
            >
              EXPLORE FULL CALENDAR{" "}
              <ArrowRight
                size={24}
                className="group-hover:translate-x-3 transition-transform duration-500"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-40 bg-black overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-6"
            >
              <h2 className="font-impact text-7xl md:text-9xl text-white uppercase tracking-tighter leading-none">
                REGISTRATION <br /> <span className="text-primary">PROCESS</span>
              </h2>
              <p className="text-zinc-500 max-w-xs text-lg font-light border-l-2 border-primary pl-6 mb-2">
                Simple steps to join the region&apos;s most competitive club.
              </p>
            </motion.div>

            <div className="grid gap-16 relative">
              <div className="absolute left-[2.4rem] md:left-[3.4rem] top-0 bottom-0 w-px bg-zinc-900 hidden sm:block"></div>

              {[
                {
                  step: "01",
                  title: "Create Account",
                  desc: "Sign up as a parent to manage your players and registrations safely.",
                },
                {
                  step: "02",
                  title: "Select Tryout",
                  desc: "View our upcoming schedule and choose the best session for your player.",
                },
                {
                  step: "03",
                  title: "Register Player",
                  desc: "Fill out the detailed registration form including medical and emergency info.",
                },
                {
                  step: "04",
                  title: "Compete",
                  desc: "Bring your player to the gym and let them showcase their talent to our staff.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex gap-10 items-start relative group"
                >
                  <div className="w-20 h-20 md:w-28 md:h-20 shrink-0 bg-black flex items-center justify-center z-10">
                    <div className="text-6xl md:text-8xl font-impact text-zinc-900 group-hover:text-primary transition-colors duration-500 tracking-tighter">
                      {item.step}
                    </div>
                  </div>
                  <div className="pt-4 space-y-3">
                    <h4 className="text-3xl md:text-4xl font-impact text-white uppercase tracking-wide group-hover:translate-x-2 transition-transform duration-500 flex items-center gap-3">
                      {item.title}
                      <CheckCircle2
                        className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        size={24}
                      />
                    </h4>
                    <p className="text-zinc-500 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 relative overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <Image
            src="/action_shot_5.jpg"
            alt=""
            fill
            className="object-cover opacity-15 grayscale transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/90"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-12"
          >
            <h2 className="font-impact text-7xl md:text-[10rem] text-white uppercase leading-[0.8] tracking-tighter">
              JOIN THE
              <br /> <span className="text-primary">SHADOW TODAY</span>
            </h2>
            <p className="text-2xl text-zinc-400 font-light max-w-2xl mx-auto italic">
              &quot;Don&apos;t practice until you get it right. Practice until
              you can&apos;t get it wrong.&quot;
            </p>
            <div className="pt-8 max-w-lg mx-auto">
              <Button
                onClick={() => router.push("/tryouts")}
                size="lg"
                className="w-full bg-primary text-white font-impact text-4xl py-12 rounded-3xl shadow-2xl transition-all active:scale-[0.98]"
              >
                TRYOUTS
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-black pt-32 pb-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 pb-24 border-b border-white/5">
            <div className="space-y-8 max-w-sm">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.jpg"
                  alt="Logo"
                  width={60}
                  height={60}
                  className="rounded-xl"
                />
                <span className="font-impact text-4xl text-white tracking-widest uppercase">
                  SHADOW
                </span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed uppercase tracking-widest font-bold">
                Excellence • Discipline • Leadership • Legacy
              </p>
              <div className="flex gap-4">
                {["Instagram", "Twitter", "Facebook"].map((social) => (
                  <button key={social} className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary transition-all">
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-current rounded-xs opacity-20"></div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
              <div className="space-y-6">
                <h5 className="text-white font-impact text-xl uppercase tracking-widest">
                  Platform
                </h5>
                <ul className="space-y-4">
                  {[
                    { label: "Tryouts", href: "/tryouts" },
                    { label: "Register", href: "/register" },
                    { label: "Programs", href: "/" },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-zinc-500 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <h5 className="text-white font-impact text-xl uppercase tracking-widest">
                  Club
                </h5>
                <ul className="space-y-4">
                  {[
                    { label: "About Us", href: "/" },
                    { label: "Coaching", href: "/" },
                    { label: "Contact", href: "/" },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-zinc-500 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-16 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-[0.5em]">
              &copy; 2026 Shadow Basketball Club. Saskatoon, SK.
            </p>
            <div className="flex gap-8">
              <button className="text-zinc-700 text-[10px] font-bold uppercase tracking-[0.3em] hover:text-zinc-500 transition-colors">Privacy Policy</button>
              <button className="text-zinc-700 text-[10px] font-bold uppercase tracking-[0.3em] hover:text-zinc-500 transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

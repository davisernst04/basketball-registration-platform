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
      <section className="min-h-screen md:h-screen flex flex-col md:grid md:grid-cols-2 relative pt-16 md:pt-20 overflow-hidden">
        <div className="flex flex-col justify-center items-start px-6 md:px-16 py-8 md:py-32 bg-black relative z-10 order-2 md:order-1">
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
              <h1 className="font-impact text-6xl md:text-8xl lg:text-9xl text-white leading-none tracking-tight uppercase">
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

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 pt-4 w-full"
            >
              <Button
                onClick={() => router.push("/tryouts")}
                size="lg"
                className="font-impact bg-primary text-white text-lg md:text-xl px-10 py-8 w-full sm:w-auto rounded-xl"
              >
                REGISTER NOW
              </Button>
              <Button
                onClick={() => router.push("/tryouts")}
                size="lg"
                variant="outline"
                className="font-impact border-2 border-zinc-700 bg-transparent text-white text-lg md:text-xl px-10 py-8 w-full sm:w-auto rounded-xl"
              >
                TRYOUT INFO
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <div className="relative h-[50vh] md:h-full order-1 md:order-2 flex-shrink-0">
          <HeroSlideshow />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black md:bg-linear-to-r md:from-black md:via-black/20 md:to-transparent pointer-events-none"></div>
        </div>
      </section>

      {/* About Us Section - Now immediately after Hero */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 relative"
            >
              <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-primary z-0"></div>
              <div className="relative z-10 group overflow-hidden rounded-2xl">
                <Image
                  src="/action_shot_1.jpg"
                  alt="Shadow Basketball Action"
                  width={800}
                  height={600}
                  className="rounded-2xl grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-primary z-0"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 space-y-10"
            >
              <div className="space-y-4">
                <h2 className="font-impact text-6xl md:text-8xl text-white uppercase leading-none tracking-tight">
                  OUR <span className="text-primary">MISSION</span>
                </h2>
                <div className="h-1 w-20 bg-primary"></div>
              </div>

              <p className="text-zinc-400 text-xl leading-relaxed font-light">
                Founded in 2018,{" "}
                <span className="text-white font-semibold underline decoration-primary underline-offset-4">
                  Shadow Basketball
                </span>{" "}
                has quickly become the region&apos;s premier destination for
                youth basketball development. We don&apos;t just teach the game;
                we mentor the next generation of leaders through discipline and
                dedication.
              </p>

              <div className="space-y-6 pt-4">
                <div className="space-y-4 p-8 bg-card border border-border  w-full rounded-2xl shadow-2xl">
                  <div className="bg-zinc-900 w-12 h-12 flex items-center justify-center rounded-xl">
                    <Zap className="text-primary" size={24} />
                  </div>
                  <h4 className="text-white font-bold text-lg uppercase tracking-wider">
                    Elite Training
                  </h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    High-intensity specialized workouts designed for maximum
                    skill growth and athletic performance.
                  </p>
                </div>
                <div className="space-y-4 p-8 bg-card border border-border  w-full rounded-2xl shadow-2xl">
                  <div className="bg-zinc-900 w-12 h-12 flex items-center justify-center rounded-xl">
                    <Award className="text-primary" size={24} />
                  </div>
                  <h4 className="text-white font-bold text-lg uppercase tracking-wider">
                    National Stage
                  </h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    We compete in the most prestigious tournaments nationwide,
                    giving players maximum exposure.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Tryouts Section - Large & Grand Cards */}
      <section className="py-32 bg-zinc-950/50 border-y border-white/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24 space-y-6"
          >
            <h2 className="font-impact text-7xl md:text-9xl text-white uppercase tracking-tight leading-none">
              UPCOMING <span className="text-primary">TRYOUTS</span>
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-xl font-light">
              Saskatchewan&apos;s most competitive evaluation process.
              <br className="hidden md:block" /> Are you ready to earn your
              spot?
            </p>
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
                      className="w-full bg-white text-black font-impact text-3xl h-24 rounded-2xl transition-all active:scale-95 shadow-xl"
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

          <div className="text-center pb-10">
            <Link
              href="/tryouts"
              className="inline-flex items-center gap-4 text-zinc-500 transition-all font-impact uppercase tracking-[0.3em] text-lg group"
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
      <section className="py-32 bg-black overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6"
            >
              <h2 className="font-impact text-6xl md:text-8xl text-white uppercase tracking-tight">
                REGISTRATION <span className="text-primary">PROCESS</span>
              </h2>
              <p className="text-zinc-500 max-w-sm text-lg font-light border-l-2 border-primary pl-6 mb-2">
                Simple steps to join the region&apos;s most competitive club.
              </p>
            </motion.div>

            <div className="grid gap-12 relative">
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
                    <div className="text-5xl md:text-7xl font-impact text-zinc-900 duration-500 tracking-tighter">
                      {item.step}
                    </div>
                  </div>
                  <div className="pt-4 space-y-2">
                    <h4 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide group-hover:translate-x-2 transition-transform duration-500 flex items-center gap-3">
                      {item.title}
                      <CheckCircle2
                        className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        size={20}
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
      <section className="py-40 relative overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <Image
            src="/action_shot_5.jpg"
            alt=""
            fill
            className="object-cover opacity-15 grayscale transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/90"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-12"
          >
            <h2 className="font-impact text-7xl md:text-9xl text-white uppercase leading-[0.8] tracking-tighter">
              JOIN THE
              <br /> <span className="text-primary">SHADOW TODAY</span>
            </h2>
            <p className="text-2xl text-zinc-400 font-light max-w-2xl mx-auto italic">
              &quot;Don&apos;t practice until you get it right. Practice until
              you can&apos;t get it wrong.&quot;
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
              <Button
                onClick={() => router.push("/tryouts")}
                size="lg"
                className="bg-primary text-white font-impact text-3xl px-16 py-10 rounded-2xl"
              >
                GET STARTED
              </Button>
              <Button
                onClick={() => router.push("/tryouts")}
                size="lg"
                variant="outline"
                className="border-2 border-zinc-700 bg-transparent text-white font-impact text-3xl px-16 py-10 rounded-2xl"
              >
                VIEW SCHEDULE
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-black pt-24 pb-12 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 pb-20 border-b border-white/5/50">
            <div className="space-y-6 text-center md:text-left">
              <div className="flex justify-center md:justify-start items-center gap-3">
                <Image
                  src="/logo.jpg"
                  alt="Logo"
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
                <span className="font-impact text-3xl text-white tracking-widest uppercase">
                  SHADOW BASKETBALL
                </span>
              </div>
              <p className="text-zinc-500 max-w-sm text-sm leading-relaxed uppercase tracking-wider font-bold">
                Excellence • Discipline • Leadership • Legacy
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-12">
              <div className="space-y-4">
                <h5 className="text-white font-bold text-xs uppercase tracking-[0.3em]">
                  Quick Links
                </h5>
                <ul className="space-y-2">
                  {[
                    { label: "Register", href: "/register" },
                    { label: "Tryouts", href: "/tryouts" },
                    { label: "Programs", href: "/" },
                    { label: "About", href: "/" },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-zinc-500  text-sm uppercase tracking-widest font-medium"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="text-white font-bold text-xs uppercase tracking-[0.3em]">
                  Social
                </h5>
                <ul className="space-y-2">
                  {["Instagram", "Twitter", "Facebook", "TikTok"].map(
                    (link) => (
                      <li key={link}>
                        <button className="text-zinc-500  text-sm uppercase tracking-widest font-medium">
                          {link}
                        </button>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-12 text-center">
            <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-[0.5em]">
              &copy; 2026 Shadow Basketball Club. Built for the next generation.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

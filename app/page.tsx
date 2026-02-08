"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import HeroSlideshow from "@/components/HeroSlideshow";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Users, 
  Target, 
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  const router = useRouter();

  return (
    <main className="bg-black min-h-screen selection:bg-red-600/30 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen md:h-screen flex flex-col md:grid md:grid-cols-2 relative pt-16 md:pt-20 overflow-hidden">
        <div className="flex flex-col justify-center items-start px-6 md:px-16 py-8 md:py-32 bg-gradient-to-b md:bg-gradient-to-r from-black via-black/95 to-black/80 relative z-10 order-2 md:order-1">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.div variants={fadeInUp} className="space-y-2">
              <span className="text-red-600 font-bold tracking-[0.3em] text-sm md:text-base uppercase inline-block border-l-2 border-red-600 pl-4">
                Premier Basketball Club
              </span>
              <h1 className="font-impact text-6xl md:text-8xl lg:text-9xl text-white leading-none tracking-tight uppercase">
                SHADOW
                <br />
                <span className="text-red-600">BASKETBALL</span>
              </h1>
            </motion.div>
            
            <motion.p variants={fadeInUp} className="text-zinc-400 text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
              Developing elite athletes through specialized training, competitive play, and a focus on character and leadership. Join the shadow legacy.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4 w-full">
              <Button
                onClick={() => router.push("/register")}
                size="lg"
                className="font-impact bg-red-600 hover:bg-red-700 text-white text-lg md:text-xl px-10 py-8 w-full sm:w-auto rounded-xl"
              >
                REGISTER NOW
              </Button>
              <Button
                onClick={() => router.push("/tryouts")}
                size="lg"
                variant="outline"
                className="font-impact border-2 border-zinc-700 bg-transparent text-white hover:bg-zinc-800 text-lg md:text-xl px-10 py-8 w-full sm:w-auto rounded-xl"
              >
                TRYOUT INFO
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <div className="relative h-[50vh] md:h-full order-1 md:order-2 flex-shrink-0">
          <HeroSlideshow />
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-l from-black/80 via-black/40 md:from-transparent md:via-black/20 to-transparent md:to-black pointer-events-none"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-zinc-950 border-y border-zinc-900">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-12"
          >
            {[
              { label: "Elite Teams", value: "15+", icon: <Users size={16} /> },
              { label: "Championships", value: "24", icon: <Award size={16} /> },
              { label: "Coaches", value: "12", icon: <Trophy size={16} /> },
              { label: "Athletes Placed", value: "150+", icon: <TrendingUp size={16} /> },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp} 
                className="text-center space-y-2 group cursor-default"
              >
                <div className="flex items-center justify-center gap-2 text-red-600/50 mb-1 group-hover:text-red-600 transition-colors">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-impact text-white tracking-wider">{stat.value}</div>
                <div className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
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
              <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-red-600 z-0"></div>
              <div className="relative z-10 group overflow-hidden rounded-2xl">
                <Image 
                  src="/action_shot_1.jpg" 
                  alt="Shadow Basketball Action" 
                  width={800} 
                  height={600} 
                  className="rounded-2xl grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-red-600 z-0"></div>
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
                  OUR <span className="text-red-600">MISSION</span>
                </h2>
                <div className="h-1 w-20 bg-red-600"></div>
              </div>
              
              <p className="text-zinc-400 text-xl leading-relaxed font-light">
                Founded in 2018, <span className="text-white font-semibold underline decoration-red-600 underline-offset-4">Shadow Basketball</span> has quickly become the region&apos;s premier destination for youth basketball development. We don&apos;t just teach the game; we mentor the next generation of leaders through discipline and dedication.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4 p-6 bg-zinc-950 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <div className="bg-zinc-900 w-12 h-12 flex items-center justify-center rounded-xl">
                    <Zap className="text-red-600" size={24} />
                  </div>
                  <h4 className="text-white font-bold text-lg uppercase tracking-wider">Elite Training</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">High-intensity specialized workouts designed for maximum skill growth and athletic performance.</p>
                </div>
                <div className="space-y-4 p-6 bg-zinc-950 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <div className="bg-zinc-900 w-12 h-12 flex items-center justify-center rounded-xl">
                    <Award className="text-red-600" size={24} />
                  </div>
                  <h4 className="text-white font-bold text-lg uppercase tracking-wider">National Stage</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">We compete in the most prestigious tournaments nationwide, giving players maximum exposure.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-32 bg-zinc-950">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24 space-y-4"
          >
            <h2 className="font-impact text-6xl md:text-8xl text-white uppercase tracking-tight">OUR PROGRAMS</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg">Specialized pathways for every stage of an athlete&apos;s development journey.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-10"
          >
            {[
              { 
                title: "Developmental", 
                desc: "Focus on fundamentals, footwork, and IQ for players ages 8-12.",
                icon: <Target className="w-10 h-10 text-red-600" />
              },
              { 
                title: "Competitive Elite", 
                desc: "High-intensity training and travel ball for dedicated middle school athletes.",
                icon: <Trophy className="w-10 h-10 text-red-600" />
              },
              { 
                title: "High School Prep", 
                desc: "Advanced skills and college recruitment preparation for high school players.",
                icon: <Users className="w-10 h-10 text-red-600" />
              },
            ].map((program, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                className="bg-black border border-zinc-800 p-10 rounded-3xl hover:border-zinc-700 transition-colors group relative overflow-hidden"
              >
                <div 
                  className="mb-8 bg-zinc-900 p-5 inline-block rounded-2xl group-hover:bg-red-600 transition-colors duration-300"
                >
                  <div className="text-white">
                    {program.icon}
                  </div>
                </div>
                <h3 className="text-3xl font-impact text-white mb-4 tracking-wider uppercase">{program.title}</h3>
                <p className="text-zinc-500 leading-relaxed mb-8 text-lg font-light">{program.desc}</p>
                <Button variant="link" className="text-red-600 p-0 hover:text-red-500 font-bold group-hover:pl-2 transition-all">
                  LEARN MORE <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
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
                REGISTRATION <span className="text-red-600">PROCESS</span>
              </h2>
              <p className="text-zinc-500 max-w-sm text-lg font-light border-l-2 border-red-600 pl-6 mb-2">Simple steps to join the region&apos;s most competitive club.</p>
            </motion.div>
            
            <div className="grid gap-12 relative">
              <div className="absolute left-[2.4rem] md:left-[3.4rem] top-0 bottom-0 w-px bg-zinc-900 hidden sm:block"></div>
              
              {[
                { step: "01", title: "Create Account", desc: "Sign up as a parent to manage your players and registrations safely." },
                { step: "02", title: "Select Tryout", desc: "View our upcoming schedule and choose the best session for your player." },
                { step: "03", title: "Register Player", desc: "Fill out the detailed registration form including medical and emergency info." },
                { step: "04", title: "Compete", desc: "Bring your player to the gym and let them showcase their talent to our staff." },
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
                    <div className="text-5xl md:text-7xl font-impact text-zinc-900 group-hover:text-red-600 transition-colors duration-500 tracking-tighter">{item.step}</div>
                  </div>
                  <div className="pt-4 space-y-2">
                    <h4 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide group-hover:translate-x-2 transition-transform duration-500 flex items-center gap-3">
                      {item.title}
                      <CheckCircle2 className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                    </h4>
                    <p className="text-zinc-500 text-lg md:text-xl font-light leading-relaxed max-w-2xl">{item.desc}</p>
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
          <Image src="/action_shot_5.jpg" alt="CTA BG" fill className="object-cover opacity-15 grayscale transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-black/80"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-12"
          >
            <h2 className="font-impact text-7xl md:text-9xl text-white uppercase leading-[0.8] tracking-tighter">
              READY TO <span className="text-red-600">DOMINATE?</span>
            </h2>
            <p className="text-2xl text-zinc-400 font-light max-w-2xl mx-auto italic">
              &quot;Don&apos;t practice until you get it right. Practice until you can&apos;t get it wrong.&quot;
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
              <Button 
                onClick={() => router.push("/register")}
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white font-impact text-3xl px-16 py-10 rounded-2xl"
              >
                GET STARTED
              </Button>
              <Button 
                onClick={() => router.push("/tryouts")}
                size="lg" 
                variant="outline"
                className="border-2 border-zinc-700 bg-transparent text-white hover:bg-zinc-800 font-impact text-3xl px-16 py-10 rounded-2xl"
              >
                VIEW SCHEDULE
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-zinc-900 bg-zinc-950 pt-24 pb-12 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 pb-20 border-b border-zinc-900/50">
            <div className="space-y-6 text-center md:text-left">
              <div className="flex justify-center md:justify-start items-center gap-3">
                <Image src="/logo.jpg" alt="Logo" width={50} height={50} className="rounded-lg" />
                <span className="font-impact text-3xl text-white tracking-widest uppercase">SHADOW BASKETBALL</span>
              </div>
              <p className="text-zinc-500 max-w-sm text-sm leading-relaxed uppercase tracking-wider font-bold">
                Excellence • Discipline • Leadership • Legacy
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-12">
              <div className="space-y-4">
                <h5 className="text-white font-bold text-xs uppercase tracking-[0.3em]">Quick Links</h5>
                <ul className="space-y-2">
                  {['Register', 'Tryouts', 'Programs', 'About'].map(link => (
                    <li key={link}>
                      <button className="text-zinc-500 hover:text-red-600 transition-colors text-sm uppercase tracking-widest font-medium">
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="text-white font-bold text-xs uppercase tracking-[0.3em]">Social</h5>
                <ul className="space-y-2">
                  {['Instagram', 'Twitter', 'Facebook', 'TikTok'].map(link => (
                    <li key={link}>
                      <button className="text-zinc-500 hover:text-red-600 transition-colors text-sm uppercase tracking-widest font-medium">
                        {link}
                      </button>
                    </li>
                  ))}
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
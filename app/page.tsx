"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import HeroSlideshow from "@/components/HeroSlideshow";

export default function Home() {
  const router = useRouter();

  return (
    <main className="bg-black">
      <header className="border-b border-red-900/30 bg-black/70 backdrop-blur-sm fixed top-0 left-0 right-0 z-20">
        <div className="mx-auto px-4 md:px-16 py-3 flex justify-between items-center">
          <Image
            src="/logo.jpg"
            alt="Shadow Basketball Logo"
            width={80}
            height={0}
            className="object-contain md:w-[100px]"
          />

          <div className="flex gap-2 md:gap-3">
            <Button
              onClick={() => router.push("/sign-in")}
              variant="outline"
              size="sm"
              className="border-red-600 text-red-500 hover:bg-red-950 hover:text-red-400 text-sm md:text-base px-4 md:px-6"
            >
              Sign In
            </Button>
            <Button
              onClick={() => router.push("/sign-up")}
              size="sm"
              className="bg-red-600 text-white hover:bg-red-700 text-sm md:text-base px-4 md:px-6"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      <section className="min-h-screen flex flex-col md:grid md:grid-cols-2 relative pt-16 md:pt-0">
        <div className="flex flex-col justify-center items-start px-6 md:px-16 py-4 md:py-32 bg-gradient-to-b md:bg-gradient-to-r from-black via-black/95 to-black/80 relative z-10 order-2 md:order-1">
          <h1 className="font-impact text-6xl md:text-8xl lg:text-9xl text-white leading-none tracking-tight">
            SHADOW
            <br />
            BASKETBALL
          </h1>
          <div className="flex flex-col gap-3 md:gap-4 pt-4 w-full">
            <Button
              onClick={() => router.push("/register")}
              size="lg"
              className="font-impact bg-red-600 hover:bg-red-700 text-white text-lg md:text-xl px-8 py-6 w-full md:w-auto"
            >
              REGISTER NOW
            </Button>
            <Button
              onClick={() => router.push("/tryouts")}
              size="lg"
              variant="outline"
              className="font-impact border-red-600 text-red-500 hover:bg-red-950 hover:text-red-400 text-lg md:text-xl px-8 py-6 w-full md:w-auto"
            >
              TRYOUT INFORMATION
            </Button>
          </div>
        </div>

        <div className="relative h-[70vh] md:h-screen order-1 md:order-2">
          <HeroSlideshow />
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-l from-black/80 via-black/40 md:from-transparent md:via-black/20 to-transparent md:to-black pointer-events-none"></div>
        </div>
      </section>

      <footer className="border-t border-red-900/30 bg-black/40 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p>&copy; 2026 Shadow Basketball. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

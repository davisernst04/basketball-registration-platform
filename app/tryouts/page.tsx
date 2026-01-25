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

interface Tryout {
  id: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  ageGroup: string;
  maxCapacity: number | null;
  notes: string | null;
  _count?: {
    registrations: number;
  };
}

export default function TryoutsPage() {
  const router = useRouter();
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tryouts")
      .then((res) => res.json())
      .then((data) => {
        setTryouts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setTryouts([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-red-900/30 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1
            className="text-2xl font-bold text-white cursor-pointer"
            onClick={() => router.push("/")}
          >
            Shadow Basketball
          </h1>
          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/register")}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Register Now
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="border-red-600 text-red-500 hover:bg-red-950 hover:text-red-400"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Tryouts Schedule */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Tryout Schedule
            </h2>
            <p className="text-gray-400 text-lg">
              Choose a session that works best for your schedule
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                Loading tryout sessions...
              </p>
            </div>
          ) : tryouts.length === 0 ? (
            <Card className="bg-black/60 border-red-900/30 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <p className="text-gray-400 text-lg">
                  No tryout sessions scheduled at this time.
                </p>
                <p className="text-gray-500 mt-2">
                  Please check back later or contact us for more information.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {tryouts.map((tryout) => (
                <Card
                  key={tryout.id}
                  className="bg-black/60 border-red-900/30 backdrop-blur-sm hover:border-red-700 transition-all"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl text-white">
                          {tryout.ageGroup}
                        </CardTitle>
                        <CardDescription className="text-gray-400 mt-2">
                          {new Date(tryout.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </CardDescription>
                      </div>
                      {tryout.maxCapacity && tryout._count && (
                        <div className="text-right">
                          <p className="text-sm text-gray-400">
                            Spots Available
                          </p>
                          <p className="text-2xl font-bold text-red-500">
                            {tryout.maxCapacity - tryout._count.registrations}
                            <span className="text-lg text-gray-400">
                              /{tryout.maxCapacity}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="text-red-500">⏰</span>
                        <span>
                          {tryout.startTime} - {tryout.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="text-red-500">📍</span>
                        <span>{tryout.location}</span>
                      </div>
                      {tryout.notes && (
                        <div className="flex items-start gap-2 text-gray-400 mt-4 pt-4 border-t border-red-900/30">
                          <span className="text-red-500">ℹ️</span>
                          <span className="text-sm">{tryout.notes}</span>
                        </div>
                      )}
                      <div className="pt-4">
                        <Button
                          onClick={() => router.push("/register")}
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                          disabled={
                            tryout.maxCapacity !== null &&
                            tryout._count !== undefined &&
                            tryout._count.registrations >= tryout.maxCapacity
                          }
                        >
                          {tryout.maxCapacity !== null &&
                          tryout._count !== undefined &&
                          tryout._count.registrations >= tryout.maxCapacity
                            ? "Session Full"
                            : "Register for This Session"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

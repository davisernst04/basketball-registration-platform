"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
}

export default function RegisterPage() {
  const router = useRouter();
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    playerName: "",
    playerAge: "",
    playerGrade: "",
    medicalInfo: "",
    emergencyContact: "",
    emergencyPhone: "",
    tryoutId: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          playerAge: parseInt(formData.playerAge),
        }),
      });

      if (response.ok) {
        setMessage(
          "Registration successful! We'll contact you with more details.",
        );
        setFormData({
          parentName: "",
          parentEmail: "",
          parentPhone: "",
          playerName: "",
          playerAge: "",
          playerGrade: "",
          medicalInfo: "",
          emergencyContact: "",
          emergencyPhone: "",
          tryoutId: "",
        });
      } else {
        const error = await response.json();
        setMessage(error.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="border-red-600 text-red-500 hover:bg-red-950 hover:text-red-400"
          >
            Back to Home
          </Button>
        </div>
      </header>

      {/* Registration Form */}
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto bg-black/60 border-red-900/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white">
              Tryout Registration
            </CardTitle>
            <CardDescription className="text-gray-400">
              Register your child for Shadow Basketball tryouts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Parent Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-red-500">
                  Parent/Guardian Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="parentName" className="text-white">
                    Full Name *
                  </Label>
                  <Input
                    id="parentName"
                    required
                    value={formData.parentName}
                    onChange={(e) =>
                      setFormData({ ...formData, parentName: e.target.value })
                    }
                    className="bg-black/40 border-red-900/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentEmail" className="text-white">
                    Email *
                  </Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    required
                    value={formData.parentEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, parentEmail: e.target.value })
                    }
                    className="bg-black/40 border-red-900/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentPhone" className="text-white">
                    Phone Number *
                  </Label>
                  <Input
                    id="parentPhone"
                    type="tel"
                    required
                    value={formData.parentPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, parentPhone: e.target.value })
                    }
                    className="bg-black/40 border-red-900/30 text-white"
                  />
                </div>
              </div>

              {/* Player Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-red-500">
                  Player Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="playerName" className="text-white">
                    Player Full Name *
                  </Label>
                  <Input
                    id="playerName"
                    required
                    value={formData.playerName}
                    onChange={(e) =>
                      setFormData({ ...formData, playerName: e.target.value })
                    }
                    className="bg-black/40 border-red-900/30 text-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="playerAge" className="text-white">
                      Age *
                    </Label>
                    <Input
                      id="playerAge"
                      type="number"
                      required
                      min="5"
                      max="18"
                      value={formData.playerAge}
                      onChange={(e) =>
                        setFormData({ ...formData, playerAge: e.target.value })
                      }
                      className="bg-black/40 border-red-900/30 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="playerGrade" className="text-white">
                      Grade *
                    </Label>
                    <Input
                      id="playerGrade"
                      required
                      placeholder="e.g., 5th Grade"
                      value={formData.playerGrade}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          playerGrade: e.target.value,
                        })
                      }
                      className="bg-black/40 border-red-900/30 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalInfo" className="text-white">
                    Medical Information
                  </Label>
                  <Input
                    id="medicalInfo"
                    placeholder="Any allergies, conditions, or medications"
                    value={formData.medicalInfo}
                    onChange={(e) =>
                      setFormData({ ...formData, medicalInfo: e.target.value })
                    }
                    className="bg-black/40 border-red-900/30 text-white"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-red-500">
                  Emergency Contact
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact" className="text-white">
                    Contact Name *
                  </Label>
                  <Input
                    id="emergencyContact"
                    required
                    value={formData.emergencyContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: e.target.value,
                      })
                    }
                    className="bg-black/40 border-red-900/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone" className="text-white">
                    Contact Phone *
                  </Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    required
                    value={formData.emergencyPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyPhone: e.target.value,
                      })
                    }
                    className="bg-black/40 border-red-900/30 text-white"
                  />
                </div>
              </div>

              {/* Tryout Selection */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-red-500">
                  Select Tryout Session *
                </h3>

                {loading ? (
                  <p className="text-gray-400">Loading tryout sessions...</p>
                ) : tryouts.length === 0 ? (
                  <p className="text-gray-400">
                    No tryout sessions available at this time.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {tryouts.map((tryout) => (
                      <label
                        key={tryout.id}
                        className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.tryoutId === tryout.id
                            ? "border-red-600 bg-red-950/30"
                            : "border-red-900/30 bg-black/20 hover:border-red-800"
                        }`}
                      >
                        <input
                          type="radio"
                          name="tryout"
                          value={tryout.id}
                          checked={formData.tryoutId === tryout.id}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tryoutId: e.target.value,
                            })
                          }
                          className="sr-only"
                          required
                        />
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-semibold">
                              {tryout.ageGroup}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {new Date(tryout.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {tryout.startTime} - {tryout.endTime}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {tryout.location}
                            </p>
                            {tryout.notes && (
                              <p className="text-gray-500 text-xs mt-1">
                                {tryout.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {message && (
                <div
                  className={`p-4 rounded-lg ${
                    message.includes("successful")
                      ? "bg-green-900/30 border border-green-700 text-green-400"
                      : "bg-red-900/30 border border-red-700 text-red-400"
                  }`}
                >
                  {message}
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting || loading || tryouts.length === 0}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6"
              >
                {submitting ? "Submitting..." : "Complete Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

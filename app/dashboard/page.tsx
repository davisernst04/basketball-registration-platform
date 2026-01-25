"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Registration {
  id: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  playerName: string;
  playerAge: number;
  playerGrade: string;
  medicalInfo: string | null;
  emergencyContact: string;
  emergencyPhone: string;
  createdAt: string;
  tryout: {
    ageGroup: string;
    date: string;
    location: string;
    startTime: string;
    endTime: string;
  };
}

interface Tryout {
  id: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  ageGroup: string;
  maxCapacity: number | null;
  notes: string | null;
  _count: {
    registrations: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"registrations" | "tryouts" | "create">("registrations");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");

  const [newTryout, setNewTryout] = useState({
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
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTryout = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/tryouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTryout,
          maxCapacity: newTryout.maxCapacity ? parseInt(newTryout.maxCapacity) : null,
          date: new Date(newTryout.date).toISOString(),
        }),
      });

      if (response.ok) {
        setMessage("Tryout session created successfully!");
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
        setTimeout(() => setActiveTab("tryouts"), 1500);
      } else {
        setMessage("Failed to create tryout session.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  const filteredRegistrations = registrations.filter((reg) =>
    reg.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.parentEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black">
      {/* Header */}
      <header className="border-b border-red-900/30 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Shadow Basketball - Admin</h1>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="border-red-600 text-red-500 hover:bg-red-950 hover:text-red-400"
          >
            Exit Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-red-900/30">
          <button
            onClick={() => setActiveTab("registrations")}
            className={`px-4 py-2 font-semibold transition-all ${
              activeTab === "registrations"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-400 hover:text-red-400"
            }`}
          >
            Registrations ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab("tryouts")}
            className={`px-4 py-2 font-semibold transition-all ${
              activeTab === "tryouts"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-400 hover:text-red-400"
            }`}
          >
            Tryout Sessions ({tryouts.length})
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-4 py-2 font-semibold transition-all ${
              activeTab === "create"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-400 hover:text-red-400"
            }`}
          >
            Create Tryout Session
          </button>
        </div>

        {/* Registrations Tab */}
        {activeTab === "registrations" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">All Registrations</h2>
              <Input
                placeholder="Search by player or parent name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md bg-black/40 border-red-900/30 text-white"
              />
            </div>

            {loading ? (
              <p className="text-gray-400">Loading registrations...</p>
            ) : filteredRegistrations.length === 0 ? (
              <Card className="bg-black/60 border-red-900/30">
                <CardContent className="py-12 text-center">
                  <p className="text-gray-400">No registrations found.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredRegistrations.map((reg) => (
                  <Card key={reg.id} className="bg-black/60 border-red-900/30">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl text-white">{reg.playerName}</CardTitle>
                          <CardDescription className="text-gray-400">
                            {reg.playerAge} years old • {reg.playerGrade}
                          </CardDescription>
                        </div>
                        <div className="text-sm text-gray-400">
                          Registered: {new Date(reg.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-red-500">Parent/Guardian</h4>
                          <p className="text-white">{reg.parentName}</p>
                          <p className="text-gray-400 text-sm">{reg.parentEmail}</p>
                          <p className="text-gray-400 text-sm">{reg.parentPhone}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-red-500">Emergency Contact</h4>
                          <p className="text-white">{reg.emergencyContact}</p>
                          <p className="text-gray-400 text-sm">{reg.emergencyPhone}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-red-500">Tryout Session</h4>
                          <p className="text-white">{reg.tryout.ageGroup}</p>
                          <p className="text-gray-400 text-sm">
                            {new Date(reg.tryout.date).toLocaleDateString()}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {reg.tryout.startTime} - {reg.tryout.endTime}
                          </p>
                          <p className="text-gray-400 text-sm">{reg.tryout.location}</p>
                        </div>
                        {reg.medicalInfo && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-red-500">Medical Info</h4>
                            <p className="text-gray-400 text-sm">{reg.medicalInfo}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tryouts Tab */}
        {activeTab === "tryouts" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Tryout Sessions</h2>

            {loading ? (
              <p className="text-gray-400">Loading tryout sessions...</p>
            ) : tryouts.length === 0 ? (
              <Card className="bg-black/60 border-red-900/30">
                <CardContent className="py-12 text-center">
                  <p className="text-gray-400">No tryout sessions created yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {tryouts.map((tryout) => (
                  <Card key={tryout.id} className="bg-black/60 border-red-900/30">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl text-white">{tryout.ageGroup}</CardTitle>
                          <CardDescription className="text-gray-400">
                            {new Date(tryout.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Registrations</p>
                          <p className="text-2xl font-bold text-red-500">
                            {tryout._count.registrations}
                            {tryout.maxCapacity && (
                              <span className="text-lg text-gray-400">/{tryout.maxCapacity}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-white">
                          ⏰ {tryout.startTime} - {tryout.endTime}
                        </p>
                        <p className="text-white">📍 {tryout.location}</p>
                        {tryout.notes && (
                          <p className="text-gray-400 text-sm mt-3 pt-3 border-t border-red-900/30">
                            {tryout.notes}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Tryout Tab */}
        {activeTab === "create" && (
          <Card className="max-w-2xl mx-auto bg-black/60 border-red-900/30">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Create New Tryout Session</CardTitle>
              <CardDescription className="text-gray-400">
                Add a new tryout session for players to register
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTryout} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ageGroup" className="text-white">Age Group *</Label>
                  <Input
                    id="ageGroup"
                    required
                    placeholder="e.g., Ages 10-12, U14, High School"
                    value={newTryout.ageGroup}
                    onChange={(e) => setNewTryout({ ...newTryout, ageGroup: e.target.value })}
                    className="bg-black/40 border-red-900/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-white">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    required
                    value={newTryout.date}
                    onChange={(e) => setNewTryout({ ...newTryout, date: e.target.value })}
                    className="bg-black/40 border-red-900/30 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="text-white">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      required
                      value={newTryout.startTime}
                      onChange={(e) => setNewTryout({ ...newTryout, startTime: e.target.value })}
                      className="bg-black/40 border-red-900/30 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime" className="text-white">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      required
                      value={newTryout.endTime}
                      onChange={(e) => setNewTryout({ ...newTryout, endTime: e.target.value })}
                      className="bg-black/40 border-red-900/30 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white">Location *</Label>
                  <Input
                    id="location"
                    required
                    placeholder="e.g., Shadow Basketball Center, 123 Main St"
                    value={newTryout.location}
                    onChange={(e) => setNewTryout({ ...newTryout, location: e.target.value })}
                    className="bg-black/40 border-red-900/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxCapacity" className="text-white">Max Capacity (Optional)</Label>
                  <Input
                    id="maxCapacity"
                    type="number"
                    min="1"
                    placeholder="Leave blank for unlimited"
                    value={newTryout.maxCapacity}
                    onChange={(e) => setNewTryout({ ...newTryout, maxCapacity: e.target.value })}
                    className="bg-black/40 border-red-900/30 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Any additional information for parents"
                    value={newTryout.notes}
                    onChange={(e) => setNewTryout({ ...newTryout, notes: e.target.value })}
                    className="bg-black/40 border-red-900/30 text-white"
                  />
                </div>

                {message && (
                  <div className={`p-4 rounded-lg ${
                    message.includes("success")
                      ? "bg-green-900/30 border border-green-700 text-green-400"
                      : "bg-red-900/30 border border-red-700 text-red-400"
                  }`}>
                    {message}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Create Tryout Session
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


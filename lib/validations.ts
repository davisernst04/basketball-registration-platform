import { z } from "zod";

export const registrationSchema = z.object({
  parentName: z.string().min(2, "Parent name must be at least 2 characters"),
  parentEmail: z.string().email("Invalid email address"),
  parentPhone: z.string().min(10, "Phone number must be at least 10 characters"),
  playerName: z.string().min(2, "Player name must be at least 2 characters"),
  playerAge: z.coerce.number().min(5).max(18),
  playerGrade: z.string().min(1, "Grade is required"),
  medicalInfo: z.string().optional(),
  emergencyContact: z.string().min(2, "Emergency contact name is required"),
  emergencyPhone: z.string().min(10, "Emergency phone must be at least 10 characters"),
  tryoutId: z.string().uuid("Please select a valid tryout session"),
});

export const tryoutSchema = z.object({
  location: z.string().min(2, "Location is required"),
  date: z.coerce.date(),
  // More lenient time regex to support HH:MM and HH:MM:SS
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, "Invalid start time"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, "Invalid end time"),
  ageGroup: z.string().min(1, "Age group is required"),
  // Handle empty string by transforming it to undefined, and allow positive integers
  maxCapacity: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.number().int().positive().optional()
  ),
  notes: z.string().optional(),
});

import { z } from "zod";

export const registrationSchema = z.object({
  parentName: z.string().min(2, "Parent name must be at least 2 characters"),
  parentEmail: z.string().email("Invalid email address"),
  parentPhone: z.string().min(10, "Phone number must be at least 10 characters"),
  playerName: z.string().min(2, "Player name must be at least 2 characters"),
  playerAge: z.coerce.number().min(5).max(18),
  playerGrade: z.string().optional(),
  medicalInfo: z.string().optional(),
  emergencyContact: z.string().min(2, "Emergency contact name is required"),
  emergencyPhone: z.string().min(10, "Emergency phone must be at least 10 characters"),
  tryoutId: z.string().uuid("Please select a valid tryout session"),
});

export const tryoutSchema = z.object({
  location: z.string().min(2, "Location is required"),
  date: z.coerce.date(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  registrationDeadline: z.coerce.date(),
  ageGroup: z.string().min(1, "Age group is required"),
  // Handle empty string by transforming it to undefined, and allow positive integers
  maxCapacity: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.number().int().positive().optional()
  ),
  notes: z.string().optional(),
});

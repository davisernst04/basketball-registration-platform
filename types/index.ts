export interface Profile {
  id: string;
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  website: string | null;
  role: string;
  email: string | null;
}

export interface Tryout {
  id: string;
  location: string;
  date: Date;
  startTime: string;
  endTime: string;
  ageGroup: string;
  maxCapacity: number | null;
  notes: string | null;
}

export interface Registration {
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
  tryoutId: string;
  userId: string | null;
}

export interface ServerActionResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface RegistrationFormData {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  playerName: string;
  playerAge: string | number;
  playerGrade: string;
  medicalInfo?: string;
  emergencyContact: string;
  emergencyPhone: string;
  tryoutId: string;
}

export interface TryoutFormData {
  id?: string;
  location: string;
  date: string | Date;
  startTime: string;
  endTime: string;
  ageGroup: string;
  maxCapacity?: string | number;
  notes?: string;
}
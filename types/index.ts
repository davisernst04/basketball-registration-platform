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
  date: string | Date;
  startTime?: string | null;
  endTime?: string | null;
  registrationDeadline: string | Date;
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
  playerGrade?: string | null;
  medicalInfo: string | null;
  emergencyContact: string;
  emergencyPhone: string;
  tryoutId: string;
  userId: string | null;
}

export type RegistrationStatus = 
  | 'NEW_USER_CREATED' 
  | 'EXISTING_USER_FOUND' 
  | 'PROFILE_UPDATED' 
  | 'REGISTRATION_SUCCESS';

export interface ServerActionResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  status?: RegistrationStatus;
}

export interface RegistrationFormData {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  playerName: string;
  playerAge: string | number;
  playerGrade?: string;
  medicalInfo?: string;
  emergencyContact: string;
  emergencyPhone: string;
  tryoutId: string;
}

export interface TryoutFormData {
  id?: string;
  location: string;
  date: string | Date;
  startTime?: string | null;
  endTime?: string | null;
  registrationDeadline: string | Date;
  ageGroup: string;
  maxCapacity?: string | number;
  notes?: string;
}
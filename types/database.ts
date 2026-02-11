export interface Tryout {
  id: string;
  location: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  registration_deadline: string;
  age_group: string;
  max_capacity: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Registration {
  id: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  player_name: string;
  player_age: number;
  player_grade: string | null;
  medical_info: string | null;
  emergency_contact: string;
  emergency_phone: string;
  tryout_id: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface RegistrationWithTryout extends Registration {
  tryout: {
    age_group: string;
    date: string;
    location: string;
    start_time: string | null;
    end_time: string | null;
    registration_deadline: string;
  } | null;
}

export interface TryoutWithCount extends Tryout {
  registration: { count: number }[];
}

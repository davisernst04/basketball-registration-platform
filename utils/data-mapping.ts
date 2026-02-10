import { TryoutWithCount, RegistrationWithTryout } from "@/types/database";

export function formatTryout(tryout: TryoutWithCount) {
  return {
    id: tryout.id,
    location: tryout.location,
    date: tryout.date,
    startTime: tryout.start_time,
    endTime: tryout.end_time,
    ageGroup: tryout.age_group,
    maxCapacity: tryout.max_capacity,
    notes: tryout.notes,
    createdAt: tryout.created_at,
    updatedAt: tryout.updated_at,
    _count: {
      registrations: tryout.registration[0]?.count || 0,
    },
  };
}

export function formatRegistration(reg: RegistrationWithTryout) {
  return {
    id: reg.id,
    parentName: reg.parent_name,
    parentEmail: reg.parent_email,
    parentPhone: reg.parent_phone,
    playerName: reg.player_name,
    playerAge: reg.player_age,
    playerGrade: reg.player_grade,
    medicalInfo: reg.medical_info,
    emergencyContact: reg.emergency_contact,
    emergencyPhone: reg.emergency_phone,
    createdAt: reg.created_at,
    tryout: {
      ageGroup: reg.tryout?.age_group,
      date: reg.tryout?.date,
      location: reg.tryout?.location,
      startTime: reg.tryout?.start_time,
      endTime: reg.tryout?.end_time,
    },
  };
}

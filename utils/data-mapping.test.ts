import { describe, it, expect } from "vitest";
import { formatTryout, formatRegistration } from "./data-mapping";
import { TryoutWithCount, RegistrationWithTryout } from "@/types/database";

describe("Data Mapping Utilities", () => {
  it("should correctly format a tryout from database to frontend format", () => {
    const dbTryout: TryoutWithCount = {
      id: "1",
      location: "Gym",
      date: "2026-02-06T00:00:00Z",
      start_time: "10:00",
      end_time: "12:00",
      age_group: "U12",
      max_capacity: 20,
      notes: "Bring water",
      created_at: "2026-02-06T00:00:00Z",
      updated_at: "2026-02-06T00:00:00Z",
      registrations: [{ count: 5 }],
    };

    const formatted = formatTryout(dbTryout);

    expect(formatted.id).toBe("1");
    expect(formatted.startTime).toBe("10:00");
    expect(formatted.ageGroup).toBe("U12");
    expect(formatted._count.registrations).toBe(5);
  });

  it("should correctly format a registration from database to frontend format", () => {
    const dbReg: RegistrationWithTryout = {
      id: "reg-1",
      parent_name: "John Doe",
      parent_email: "john@example.com",
      parent_phone: "123456",
      player_name: "Jane Doe",
      player_age: 10,
      player_grade: "5th",
      medical_info: "None",
      emergency_contact: "Bob",
      emergency_phone: "987654",
      tryout_id: "1",
      user_id: "user-1",
      created_at: "2026-02-06T00:00:00Z",
      updated_at: "2026-02-06T00:00:00Z",
      tryout: {
        age_group: "U12",
        date: "2026-02-06T00:00:00Z",
        location: "Gym",
        start_time: "10:00",
        end_time: "12:00",
      },
    };

    const formatted = formatRegistration(dbReg);

    expect(formatted.parentName).toBe("John Doe");
    expect(formatted.playerName).toBe("Jane Doe");
    expect(formatted.tryout.ageGroup).toBe("U12");
  });
});

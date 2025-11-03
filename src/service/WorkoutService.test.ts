import { supabase } from "@/lib/supabase";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as WorkoutService from "./WorkoutService";

// Mock supabase client
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe("WorkoutService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GymVisit CRUD", () => {
    describe("createGymVisit", () => {
      it("should create a gym visit with notes", async () => {
        const mockInsert = {
          data: {
            id: "visit-123",
            user_id: "user-123",
            notes: "Great workout today",
            created_at: "2024-01-01T00:00:00Z",
          },
          error: null,
        };

        vi.mocked(supabase.from).mockImplementation(() => ({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue(mockInsert),
            }),
          }),
        })) as any;

        const result = await WorkoutService.createGymVisit({
          notes: "Great workout today",
          user_id: "user-123",
        });

        expect(result).toEqual(mockInsert.data);
        expect(supabase.from).toHaveBeenCalledWith("GymVisit");
      });

      it("should throw error on failed creation", async () => {
        const mockError = {
          message: "Failed to create visit",
          code: "PGRST116",
        };

        vi.mocked(supabase.from).mockImplementation(() => ({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi
                .fn()
                .mockResolvedValue({ data: null, error: mockError }),
            }),
          }),
        })) as any;

        await expect(
          WorkoutService.createGymVisit({ notes: "Test", user_id: "user-123" })
        ).rejects.toThrow("Failed to create visit");
      });
    });

    describe("getGymVisit", () => {
      it("should fetch a gym visit by id", async () => {
        const mockVisit = {
          id: "visit-123",
          user_id: "user-123",
          notes: "Test notes",
          created_at: "2024-01-01T00:00:00Z",
        };

        vi.mocked(supabase.from).mockImplementation(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi
                .fn()
                .mockResolvedValue({ data: mockVisit, error: null }),
            }),
          }),
        })) as any;

        const result = await WorkoutService.getGymVisit("visit-123");

        expect(result).toEqual(mockVisit);
        expect(supabase.from).toHaveBeenCalledWith("GymVisit");
      });
    });

    describe("getGymVisitsByUser", () => {
      it("should fetch all gym visits for a user", async () => {
        const mockVisits = [
          {
            id: "visit-1",
            user_id: "user-123",
            notes: "Workout 1",
            created_at: "2024-01-01T00:00:00Z",
          },
          {
            id: "visit-2",
            user_id: "user-123",
            notes: "Workout 2",
            created_at: "2024-01-02T00:00:00Z",
          },
        ];

        vi.mocked(supabase.from).mockImplementation(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi
                .fn()
                .mockResolvedValue({ data: mockVisits, error: null }),
            }),
          }),
        })) as any;

        const result = await WorkoutService.getGymVisitsByUser("user-123");

        expect(result).toEqual(mockVisits);
      });
    });

    describe("updateGymVisit", () => {
      it("should update a gym visit", async () => {
        const mockUpdated = {
          id: "visit-123",
          user_id: "user-123",
          notes: "Updated notes",
          created_at: "2024-01-01T00:00:00Z",
        };

        vi.mocked(supabase.from).mockImplementation(() => ({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi
                  .fn()
                  .mockResolvedValue({ data: mockUpdated, error: null }),
              }),
            }),
          }),
        })) as any;

        const result = await WorkoutService.updateGymVisit("visit-123", {
          notes: "Updated notes",
        });

        expect(result).toEqual(mockUpdated);
      });
    });

    describe("deleteGymVisit", () => {
      it("should delete a gym visit", async () => {
        vi.mocked(supabase.from).mockImplementation(() => ({
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: {}, error: null }),
              }),
            }),
          }),
        })) as any;

        await WorkoutService.deleteGymVisit("visit-123");

        expect(supabase.from).toHaveBeenCalledWith("GymVisit");
      });
    });
  });

  describe("Exercise CRUD", () => {
    describe("createExercise", () => {
      it("should create an exercise within a gym visit", async () => {
        const mockExercise = {
          id: "exercise-123",
          gym_visit_id: "visit-123",
          exercise_type_id: "type-123",
          created_at: "2024-01-01T00:00:00Z",
        };

        vi.mocked(supabase.from).mockImplementation(() => ({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi
                .fn()
                .mockResolvedValue({ data: mockExercise, error: null }),
            }),
          }),
        })) as any;

        const result = await WorkoutService.createExercise({
          gym_visit_id: "visit-123",
          exercise_type_id: "type-123",
        });

        expect(result).toEqual(mockExercise);
        expect(supabase.from).toHaveBeenCalledWith("Exercise");
      });
    });

    describe("getExercisesByGymVisit", () => {
      it("should fetch all exercises for a gym visit", async () => {
        const mockExercises = [
          {
            id: "exercise-1",
            gym_visit_id: "visit-123",
            exercise_type_id: "type-1",
            created_at: "2024-01-01T00:00:00Z",
          },
          {
            id: "exercise-2",
            gym_visit_id: "visit-123",
            exercise_type_id: "type-2",
            created_at: "2024-01-01T00:00:00Z",
          },
        ];

        vi.mocked(supabase.from).mockImplementation(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi
                .fn()
                .mockResolvedValue({ data: mockExercises, error: null }),
            }),
          }),
        })) as any;

        const result = await WorkoutService.getExercisesByGymVisit("visit-123");

        expect(result).toEqual(mockExercises);
      });
    });

    describe("updateExercise", () => {
      it("should update an exercise", async () => {
        const mockUpdated = {
          id: "exercise-123",
          gym_visit_id: "visit-123",
          exercise_type_id: "type-456",
          created_at: "2024-01-01T00:00:00Z",
        };

        vi.mocked(supabase.from).mockImplementation(() => ({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi
                  .fn()
                  .mockResolvedValue({ data: mockUpdated, error: null }),
              }),
            }),
          }),
        })) as any;

        const result = await WorkoutService.updateExercise("exercise-123", {
          exercise_type_id: "type-456",
        });

        expect(result).toEqual(mockUpdated);
      });
    });

    describe("deleteExercise", () => {
      it("should delete an exercise", async () => {
        vi.mocked(supabase.from).mockImplementation(() => ({
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: {}, error: null }),
              }),
            }),
          }),
        })) as any;

        await WorkoutService.deleteExercise("exercise-123");

        expect(supabase.from).toHaveBeenCalledWith("Exercise");
      });
    });
  });

  describe("Set CRUD", () => {
    describe("createSet", () => {
      it("should create a set with reps and weight", async () => {
        const mockSet = {
          id: 1,
          exercise_id: "exercise-123",
          reps: 10,
          weight: 135.5,
          duration_sec: null,
          distance_mi: null,
          created_at: "2024-01-01T00:00:00Z",
        };

        vi.mocked(supabase.from).mockImplementation(() => ({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockSet, error: null }),
            }),
          }),
        })) as any;

        const result = await WorkoutService.createSet({
          exercise_id: "exercise-123",
          reps: 10,
          weight: 135.5,
        });

        expect(result).toEqual(mockSet);
        expect(supabase.from).toHaveBeenCalledWith("Set");
      });

      it("should create a set with duration for cardio", async () => {
        const mockSet = {
          id: 2,
          exercise_id: "exercise-456",
          reps: null,
          weight: null,
          duration_sec: 1800,
          distance_mi: 3.0,
          created_at: "2024-01-01T00:00:00Z",
        };

        vi.mocked(supabase.from).mockImplementation(() => ({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockSet, error: null }),
            }),
          }),
        })) as any;

        const result = await WorkoutService.createSet({
          exercise_id: "exercise-456",
          duration_sec: 1800,
          distance_mi: 3.0,
        });

        expect(result).toEqual(mockSet);
      });
    });

    describe("getSetsByExercise", () => {
      it("should fetch all sets for an exercise", async () => {
        const mockSets = [
          {
            id: 1,
            exercise_id: "exercise-123",
            reps: 10,
            weight: 135.5,
            duration_sec: null,
            distance_mi: null,
            created_at: "2024-01-01T00:00:00Z",
          },
          {
            id: 2,
            exercise_id: "exercise-123",
            reps: 8,
            weight: 135.5,
            duration_sec: null,
            distance_mi: null,
            created_at: "2024-01-01T00:00:00Z",
          },
        ];

        vi.mocked(supabase.from).mockImplementation(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({ data: mockSets, error: null }),
            }),
          }),
        })) as any;

        const result = await WorkoutService.getSetsByExercise("exercise-123");

        expect(result).toEqual(mockSets);
      });
    });

    describe("updateSet", () => {
      it("should update a set", async () => {
        const mockUpdated = {
          id: 1,
          exercise_id: "exercise-123",
          reps: 12,
          weight: 140.0,
          duration_sec: null,
          distance_mi: null,
          created_at: "2024-01-01T00:00:00Z",
        };

        vi.mocked(supabase.from).mockImplementation(() => ({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi
                  .fn()
                  .mockResolvedValue({ data: mockUpdated, error: null }),
              }),
            }),
          }),
        })) as any;

        const result = await WorkoutService.updateSet(1, {
          reps: 12,
          weight: 140.0,
        });

        expect(result).toEqual(mockUpdated);
      });
    });

    describe("deleteSet", () => {
      it("should delete a set", async () => {
        vi.mocked(supabase.from).mockImplementation(() => ({
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: {}, error: null }),
              }),
            }),
          }),
        })) as any;

        await WorkoutService.deleteSet(1);

        expect(supabase.from).toHaveBeenCalledWith("Set");
      });
    });
  });

  describe("ExerciseType operations", () => {
    describe("getExerciseType", () => {
      it("should fetch an exercise type by id", async () => {
        const mockExerciseType = {
          id: "type-123",
          name: "Bench Press",
          description: "Chest exercise",
          author_id: "user-123",
          created_at: "2024-01-01T00:00:00Z",
        };

        vi.mocked(supabase.from).mockImplementation(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockExerciseType,
                error: null,
              }),
            }),
          }),
        })) as any;

        const result = await WorkoutService.getExerciseType("type-123");

        expect(result).toEqual(mockExerciseType);
      });
    });

    describe("getExerciseTypes", () => {
      it("should fetch all exercise types", async () => {
        const mockExerciseTypes = [
          {
            id: "type-1",
            name: "Bench Press",
            description: "Chest exercise",
            author_id: "user-123",
            created_at: "2024-01-01T00:00:00Z",
          },
          {
            id: "type-2",
            name: "Squat",
            description: "Leg exercise",
            author_id: null,
            created_at: "2024-01-01T00:00:00Z",
          },
        ];

        vi.mocked(supabase.from).mockImplementation(() => ({
          select: vi.fn().mockReturnValue({
            order: vi
              .fn()
              .mockResolvedValue({ data: mockExerciseTypes, error: null }),
          }),
        })) as any;

        const result = await WorkoutService.getExerciseTypes();

        expect(result).toEqual(mockExerciseTypes);
      });
    });

    describe("createExerciseType", () => {
      it("should create a custom exercise type", async () => {
        const mockExerciseType = {
          id: "type-123",
          name: "Custom Exercise",
          description: "My custom exercise",
          author_id: "user-123",
          created_at: "2024-01-01T00:00:00Z",
        };

        vi.mocked(supabase.from).mockImplementation(() => ({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockExerciseType,
                error: null,
              }),
            }),
          }),
        })) as any;

        const result = await WorkoutService.createExerciseType({
          name: "Custom Exercise",
          description: "My custom exercise",
          author_id: "user-123",
        });

        expect(result).toEqual(mockExerciseType);
      });
    });
  });
});

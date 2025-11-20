export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      Exercise: {
        Row: {
          created_at: string;
          exercise_type_id: string | null;
          gym_visit_id: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          exercise_type_id?: string | null;
          gym_visit_id?: string;
          id?: string;
        };
        Update: {
          created_at?: string;
          exercise_type_id?: string | null;
          gym_visit_id?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Exercise_exercise_type_id_fkey";
            columns: ["exercise_type_id"];
            isOneToOne: false;
            referencedRelation: "ExerciseType";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Exercise_gym_visit_id_fkey";
            columns: ["gym_visit_id"];
            isOneToOne: false;
            referencedRelation: "GymVisit";
            referencedColumns: ["id"];
          },
        ];
      };
      ExerciseType: {
        Row: {
          author_id: string | null;
          created_at: string;
          description: string | null;
          id: string;
          name: string;
        };
        Insert: {
          author_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
        };
        Update: {
          author_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      Follow: {
        Row: {
          created_at: string;
          followee_id: string;
          follower_id: string;
          id: number;
        };
        Insert: {
          created_at?: string;
          followee_id?: string;
          follower_id?: string;
          id?: number;
        };
        Update: {
          created_at?: string;
          followee_id?: string;
          follower_id?: string;
          id?: number;
        };
        Relationships: [];
      };
      GymVisit: {
        Row: {
          created_at: string;
          id: string;
          notes: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          notes?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          notes?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      Profile: {
        Row: {
          first_name: string | null;
          last_name: string | null;
          user_id: string;
          username: string;
          image_url: string | null;
        };
        Insert: {
          first_name?: string | null;
          last_name?: string | null;
          user_id?: string;
          username: string;
          image_url?: string | null;
        };
        Update: {
          first_name?: string | null;
          last_name?: string | null;
          user_id?: string;
          username?: string;
          image_url?: string | null;
        };
        Relationships: [];
      };
      Set: {
        Row: {
          created_at: string;
          distance_mi: number | null;
          duration_sec: number | null;
          exercise_id: string;
          id: number;
          reps: number | null;
          weight: number | null;
        };
        Insert: {
          created_at?: string;
          distance_mi?: number | null;
          duration_sec?: number | null;
          exercise_id?: string;
          id?: number;
          reps?: number | null;
          weight?: number | null;
        };
        Update: {
          created_at?: string;
          distance_mi?: number | null;
          duration_sec?: number | null;
          exercise_id?: string;
          id?: number;
          reps?: number | null;
          weight?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "Set_exercise_id_fkey";
            columns: ["exercise_id"];
            isOneToOne: false;
            referencedRelation: "Exercise";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

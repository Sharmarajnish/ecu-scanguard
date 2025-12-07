export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analysis_logs: {
        Row: {
          created_at: string | null
          id: string
          log_level: string | null
          message: string
          scan_id: string
          stage: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          log_level?: string | null
          message: string
          scan_id: string
          stage: string
        }
        Update: {
          created_at?: string | null
          id?: string
          log_level?: string | null
          message?: string
          scan_id?: string
          stage?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_logs_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_results: {
        Row: {
          created_at: string | null
          details: string | null
          framework: string
          id: string
          rule_description: string | null
          rule_id: string
          scan_id: string
          status: Database["public"]["Enums"]["compliance_status"] | null
        }
        Insert: {
          created_at?: string | null
          details?: string | null
          framework: string
          id?: string
          rule_description?: string | null
          rule_id: string
          scan_id: string
          status?: Database["public"]["Enums"]["compliance_status"] | null
        }
        Update: {
          created_at?: string | null
          details?: string | null
          framework?: string
          id?: string
          rule_description?: string | null
          rule_id?: string
          scan_id?: string
          status?: Database["public"]["Enums"]["compliance_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_results_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      cve_cache: {
        Row: {
          affected_products: Json | null
          cve_id: string
          cvss_score: number | null
          cwe_ids: string[] | null
          description: string | null
          fetched_at: string | null
          id: string
          modified_date: string | null
          published_date: string | null
          reference_links: Json | null
          severity: string | null
        }
        Insert: {
          affected_products?: Json | null
          cve_id: string
          cvss_score?: number | null
          cwe_ids?: string[] | null
          description?: string | null
          fetched_at?: string | null
          id?: string
          modified_date?: string | null
          published_date?: string | null
          reference_links?: Json | null
          severity?: string | null
        }
        Update: {
          affected_products?: Json | null
          cve_id?: string
          cvss_score?: number | null
          cwe_ids?: string[] | null
          description?: string | null
          fetched_at?: string | null
          id?: string
          modified_date?: string | null
          published_date?: string | null
          reference_links?: Json | null
          severity?: string | null
        }
        Relationships: []
      }
      sbom_components: {
        Row: {
          component_name: string
          created_at: string | null
          id: string
          license: string | null
          scan_id: string
          source_file: string | null
          version: string | null
          vulnerabilities: Json | null
        }
        Insert: {
          component_name: string
          created_at?: string | null
          id?: string
          license?: string | null
          scan_id: string
          source_file?: string | null
          version?: string | null
          vulnerabilities?: Json | null
        }
        Update: {
          component_name?: string
          created_at?: string | null
          id?: string
          license?: string | null
          scan_id?: string
          source_file?: string | null
          version?: string | null
          vulnerabilities?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "sbom_components_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      scans: {
        Row: {
          architecture: string | null
          completed_at: string | null
          compliance_frameworks: string[] | null
          created_at: string | null
          deep_analysis: boolean | null
          ecu_name: string
          ecu_type: string
          executive_summary: string | null
          file_hash: string | null
          file_name: string
          file_size: number | null
          id: string
          manufacturer: string | null
          metadata: Json | null
          platform: string | null
          progress: number | null
          risk_score: number | null
          status: Database["public"]["Enums"]["scan_status"] | null
          updated_at: string | null
          user_id: string
          version: string | null
        }
        Insert: {
          architecture?: string | null
          completed_at?: string | null
          compliance_frameworks?: string[] | null
          created_at?: string | null
          deep_analysis?: boolean | null
          ecu_name: string
          ecu_type: string
          executive_summary?: string | null
          file_hash?: string | null
          file_name: string
          file_size?: number | null
          id?: string
          manufacturer?: string | null
          metadata?: Json | null
          platform?: string | null
          progress?: number | null
          risk_score?: number | null
          status?: Database["public"]["Enums"]["scan_status"] | null
          updated_at?: string | null
          user_id: string
          version?: string | null
        }
        Update: {
          architecture?: string | null
          completed_at?: string | null
          compliance_frameworks?: string[] | null
          created_at?: string | null
          deep_analysis?: boolean | null
          ecu_name?: string
          ecu_type?: string
          executive_summary?: string | null
          file_hash?: string | null
          file_name?: string
          file_size?: number | null
          id?: string
          manufacturer?: string | null
          metadata?: Json | null
          platform?: string | null
          progress?: number | null
          risk_score?: number | null
          status?: Database["public"]["Enums"]["scan_status"] | null
          updated_at?: string | null
          user_id?: string
          version?: string | null
        }
        Relationships: []
      }
      vulnerabilities: {
        Row: {
          affected_component: string | null
          affected_function: string | null
          attack_vector: string | null
          code_snippet: string | null
          created_at: string | null
          cve_id: string | null
          cvss_score: number | null
          cwe_id: string | null
          description: string | null
          detection_method: string | null
          id: string
          impact: string | null
          line_number: number | null
          llm_enrichment: Json | null
          remediation: string | null
          scan_id: string
          severity: Database["public"]["Enums"]["severity_level"]
          status: Database["public"]["Enums"]["vulnerability_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          affected_component?: string | null
          affected_function?: string | null
          attack_vector?: string | null
          code_snippet?: string | null
          created_at?: string | null
          cve_id?: string | null
          cvss_score?: number | null
          cwe_id?: string | null
          description?: string | null
          detection_method?: string | null
          id?: string
          impact?: string | null
          line_number?: number | null
          llm_enrichment?: Json | null
          remediation?: string | null
          scan_id: string
          severity?: Database["public"]["Enums"]["severity_level"]
          status?: Database["public"]["Enums"]["vulnerability_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          affected_component?: string | null
          affected_function?: string | null
          attack_vector?: string | null
          code_snippet?: string | null
          created_at?: string | null
          cve_id?: string | null
          cvss_score?: number | null
          cwe_id?: string | null
          description?: string | null
          detection_method?: string | null
          id?: string
          impact?: string | null
          line_number?: number | null
          llm_enrichment?: Json | null
          remediation?: string | null
          scan_id?: string
          severity?: Database["public"]["Enums"]["severity_level"]
          status?: Database["public"]["Enums"]["vulnerability_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vulnerabilities_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      compliance_status: "pass" | "fail" | "warning"
      scan_status:
        | "queued"
        | "parsing"
        | "decompiling"
        | "analyzing"
        | "enriching"
        | "complete"
        | "failed"
      severity_level: "critical" | "high" | "medium" | "low" | "info"
      vulnerability_status:
        | "new"
        | "reopened"
        | "fixed"
        | "false_positive"
        | "risk_accepted"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      compliance_status: ["pass", "fail", "warning"],
      scan_status: [
        "queued",
        "parsing",
        "decompiling",
        "analyzing",
        "enriching",
        "complete",
        "failed",
      ],
      severity_level: ["critical", "high", "medium", "low", "info"],
      vulnerability_status: [
        "new",
        "reopened",
        "fixed",
        "false_positive",
        "risk_accepted",
      ],
    },
  },
} as const

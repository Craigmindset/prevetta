import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          company_name: string | null
          phone: string | null
          role: string
          subscription_plan: "free" | "basic" | "premium" | "enterprise"
          subscription_status: "active" | "inactive" | "cancelled"
          credits_remaining: number
          total_uploads: number
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          company_name?: string | null
          phone?: string | null
          role?: string
          subscription_plan?: "free" | "basic" | "premium" | "enterprise"
          subscription_status?: "active" | "inactive" | "cancelled"
          credits_remaining?: number
          total_uploads?: number
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          company_name?: string | null
          phone?: string | null
          role?: string
          subscription_plan?: "free" | "basic" | "premium" | "enterprise"
          subscription_status?: "active" | "inactive" | "cancelled"
          credits_remaining?: number
          total_uploads?: number
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vetting_results: {
        Row: {
          id: string
          user_id: string
          campaign_id: string | null
          file_name: string
          file_type: string
          file_size: number
          file_url: string | null
          content_type: "image" | "audio" | "video" | "text"
          transcription: string | null
          analysis_result: any
          compliance_score: number | null
          status: "approved" | "rejected" | "needs_review" | "processing"
          flagged_categories: string[] | null
          recommendations: string | null
          processed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          campaign_id?: string | null
          file_name: string
          file_type: string
          file_size: number
          file_url?: string | null
          content_type: "image" | "audio" | "video" | "text"
          transcription?: string | null
          analysis_result: any
          compliance_score?: number | null
          status?: "approved" | "rejected" | "needs_review" | "processing"
          flagged_categories?: string[] | null
          recommendations?: string | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          campaign_id?: string | null
          file_name?: string
          file_type?: string
          file_size?: number
          file_url?: string | null
          content_type?: "image" | "audio" | "video" | "text"
          transcription?: string | null
          analysis_result?: any
          compliance_score?: number | null
          status?: "approved" | "rejected" | "needs_review" | "processing"
          flagged_categories?: string[] | null
          recommendations?: string | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          status: "active" | "paused" | "completed" | "archived"
          total_items: number
          approved_items: number
          rejected_items: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          status?: "active" | "paused" | "completed" | "archived"
          total_items?: number
          approved_items?: number
          rejected_items?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          status?: "active" | "paused" | "completed" | "archived"
          total_items?: number
          approved_items?: number
          rejected_items?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

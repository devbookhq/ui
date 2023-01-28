export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      api_keys: {
        Row: {
          api_key: string
          owner_id: string
        }
        Insert: {
          api_key: string
          owner_id: string
        }
        Update: {
          api_key?: string
          owner_id?: string
        }
      }
      apps: {
        Row: {
          created_at: string
          creator_id: string
          devbook_app_id: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          devbook_app_id?: string | null
          id: string
          title: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          devbook_app_id?: string | null
          id?: string
          title?: string
        }
      }
      apps_feedback: {
        Row: {
          appId: string
          created_at: string
          feedback: string | null
          id: number
          properties: Json | null
        }
        Insert: {
          appId: string
          created_at?: string
          feedback?: string | null
          id?: number
          properties?: Json | null
        }
        Update: {
          appId?: string
          created_at?: string
          feedback?: string | null
          id?: number
          properties?: Json | null
        }
      }
      code_snippet_embed_telemetry: {
        Row: {
          code_snippet_id: string | null
          created_at: string | null
          host: string | null
          id: number
          path: string | null
          type: string | null
        }
        Insert: {
          code_snippet_id?: string | null
          created_at?: string | null
          host?: string | null
          id?: number
          path?: string | null
          type?: string | null
        }
        Update: {
          code_snippet_id?: string | null
          created_at?: string | null
          host?: string | null
          id?: number
          path?: string | null
          type?: string | null
        }
      }
      code_snippets: {
        Row: {
          code: string | null
          created_at: string
          creator_id: string
          env_vars: Json
          id: string
          template: string
          title: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          creator_id: string
          env_vars?: Json
          id: string
          template?: string
          title?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          creator_id?: string
          env_vars?: Json
          id?: string
          template?: string
          title?: string
        }
      }
      envs: {
        Row: {
          code_snippet_id: string | null
          deps: string[] | null
          id: string
          state: Database['public']['Enums']['env_state'] | null
          template: string | null
        }
        Insert: {
          code_snippet_id?: string | null
          deps?: string[] | null
          id: string
          state?: Database['public']['Enums']['env_state'] | null
          template?: string | null
        }
        Update: {
          code_snippet_id?: string | null
          deps?: string[] | null
          id?: string
          state?: Database['public']['Enums']['env_state'] | null
          template?: string | null
        }
      }
      guides: {
        Row: {
          branch: string
          content: Json | null
          created_at: string | null
          project_id: string
          repository_fullname: string
          slug: string
        }
        Insert: {
          branch: string
          content?: Json | null
          created_at?: string | null
          project_id: string
          repository_fullname: string
          slug: string
        }
        Update: {
          branch?: string
          content?: Json | null
          created_at?: string | null
          project_id?: string
          repository_fullname?: string
          slug?: string
        }
      }
      published_code_snippets: {
        Row: {
          code: string
          code_snippet_id: string
          env_vars: Json
          id: string
          published_at: string | null
          template: string
          title: string
        }
        Insert: {
          code?: string
          code_snippet_id: string
          env_vars?: Json
          id?: string
          published_at?: string | null
          template?: string
          title?: string
        }
        Update: {
          code?: string
          code_snippet_id?: string
          env_vars?: Json
          id?: string
          published_at?: string | null
          template?: string
          title?: string
        }
      }
      slack_installations: {
        Row: {
          created_at: string | null
          devbook_app_id: string
          id: string
          installation_data: Json
        }
        Insert: {
          created_at?: string | null
          devbook_app_id: string
          id: string
          installation_data: Json
        }
        Update: {
          created_at?: string | null
          devbook_app_id?: string
          id?: string
          installation_data?: Json
        }
      }
      user_feedback: {
        Row: {
          created_at: string | null
          feedback: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback?: string | null
          id?: number
          user_id?: string | null
        }
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      env_state: 'Building' | 'Failed' | 'Done' | 'None'
      template:
      | 'Nodejs'
      | 'Go'
      | 'Bash'
      | 'Python3'
      | 'Java'
      | 'Rust'
      | 'Perl'
      | 'PHP'
      | 'Ansys'
      | 'Typescript'
      template_old:
      | 'None'
      | 'Nodejs'
      | 'Go'
      | 'Bash'
      | 'Python'
      | 'Java'
      | 'Rust'
      | 'Perl'
      | 'PHP'
    }
  }
}

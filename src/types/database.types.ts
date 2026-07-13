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
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      Comments: {
        Row: {
          authorId: string
          commentId: string
          content: string
          createdAt: string
          postId: string
          roleId: string
          updatedAt: string | null
        }
        Insert: {
          authorId: string
          commentId?: string
          content: string
          createdAt?: string
          postId: string
          roleId: string
          updatedAt?: string | null
        }
        Update: {
          authorId?: string
          commentId?: string
          content?: string
          createdAt?: string
          postId?: string
          roleId?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Comments_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_Comments_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Friends_View"
            referencedColumns: ["usernameId"]
          },
          {
            foreignKeyName: "public_Comments_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_Comments_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "Posts"
            referencedColumns: ["postId"]
          },
        ]
      }
      Files: {
        Row: {
          authorId: string | null
          createdAt: string
          fileId: string
          fileUrl: string
          fts_document: unknown
          groupId: string | null
          name: string
          profileType: boolean
          shortDescription: string | null
          tags: Database["public"]["Enums"]["Tags"]
          updatedAt: string | null
        }
        Insert: {
          authorId?: string | null
          createdAt?: string
          fileId?: string
          fileUrl: string
          fts_document?: unknown
          groupId?: string | null
          name: string
          profileType?: boolean
          shortDescription?: string | null
          tags: Database["public"]["Enums"]["Tags"]
          updatedAt?: string | null
        }
        Update: {
          authorId?: string | null
          createdAt?: string
          fileId?: string
          fileUrl?: string
          fts_document?: unknown
          groupId?: string | null
          name?: string
          profileType?: boolean
          shortDescription?: string | null
          tags?: Database["public"]["Enums"]["Tags"]
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_Files_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Friends_View"
            referencedColumns: ["usernameId"]
          },
          {
            foreignKeyName: "public_Files_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_Files_groupId_fkey"
            columns: ["groupId"]
            isOneToOne: false
            referencedRelation: "Groups"
            referencedColumns: ["groupId"]
          },
        ]
      }
      FilesComments: {
        Row: {
          authorId: string
          content: string
          createdAt: string
          fileId: string
          id: string
          roleId: string
          updatedAt: string | null
        }
        Insert: {
          authorId: string
          content: string
          createdAt?: string
          fileId: string
          id?: string
          roleId: string
          updatedAt?: string | null
        }
        Update: {
          authorId?: string
          content?: string
          createdAt?: string
          fileId?: string
          id?: string
          roleId?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_FilesComments_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Friends_View"
            referencedColumns: ["usernameId"]
          },
          {
            foreignKeyName: "public_FilesComments_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_FilesComments_fileId_fkey"
            columns: ["fileId"]
            isOneToOne: false
            referencedRelation: "Files"
            referencedColumns: ["fileId"]
          },
          {
            foreignKeyName: "public_FilesComments_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["id"]
          },
        ]
      }
      Friends: {
        Row: {
          createdAt: string
          favorite: boolean
          friendId: string
          id: string
          updatedAt: string | null
          usernameId: string
        }
        Insert: {
          createdAt?: string
          favorite?: boolean
          friendId: string
          id?: string
          updatedAt?: string | null
          usernameId: string
        }
        Update: {
          createdAt?: string
          favorite?: boolean
          friendId?: string
          id?: string
          updatedAt?: string | null
          usernameId?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_Friends_friendId_fkey"
            columns: ["friendId"]
            isOneToOne: false
            referencedRelation: "Friends_View"
            referencedColumns: ["usernameId"]
          },
          {
            foreignKeyName: "public_Friends_friendId_fkey"
            columns: ["friendId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_Friends_usernameId_fkey"
            columns: ["usernameId"]
            isOneToOne: false
            referencedRelation: "Friends_View"
            referencedColumns: ["usernameId"]
          },
          {
            foreignKeyName: "public_Friends_usernameId_fkey"
            columns: ["usernameId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Groups: {
        Row: {
          adminId: string
          createdAt: string
          description: string
          groupId: string
          logo: string | null
          name: string
          regulation: string | null
          updatedAt: string | null
        }
        Insert: {
          adminId: string
          createdAt?: string
          description: string
          groupId?: string
          logo?: string | null
          name: string
          regulation?: string | null
          updatedAt?: string | null
        }
        Update: {
          adminId?: string
          createdAt?: string
          description?: string
          groupId?: string
          logo?: string | null
          name?: string
          regulation?: string | null
          updatedAt?: string | null
        }
        Relationships: []
      }
      LastComments: {
        Row: {
          authorId: string
          content: string
          createdAt: string
          lastCommentId: string
          roleId: string
          subCommentId: string
          updatedAt: string | null
        }
        Insert: {
          authorId: string
          content: string
          createdAt?: string
          lastCommentId?: string
          roleId: string
          subCommentId: string
          updatedAt?: string | null
        }
        Update: {
          authorId?: string
          content?: string
          createdAt?: string
          lastCommentId?: string
          roleId?: string
          subCommentId?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_LastComments_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Friends_View"
            referencedColumns: ["usernameId"]
          },
          {
            foreignKeyName: "public_LastComments_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_LastComments_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_LastComments_subCommentId_fkey"
            columns: ["subCommentId"]
            isOneToOne: false
            referencedRelation: "SubComments"
            referencedColumns: ["subCommentId"]
          },
        ]
      }
      Liked: {
        Row: {
          commentId: string | null
          fileCommentId: string | null
          fileId: string | null
          id: string
          lastCommentId: string | null
          postId: string | null
          subCommentId: string | null
          userId: string
        }
        Insert: {
          commentId?: string | null
          fileCommentId?: string | null
          fileId?: string | null
          id?: string
          lastCommentId?: string | null
          postId?: string | null
          subCommentId?: string | null
          userId: string
        }
        Update: {
          commentId?: string | null
          fileCommentId?: string | null
          fileId?: string | null
          id?: string
          lastCommentId?: string | null
          postId?: string | null
          subCommentId?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Liked_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "Posts"
            referencedColumns: ["postId"]
          },
          {
            foreignKeyName: "public_Liked_fileId_fkey"
            columns: ["fileId"]
            isOneToOne: false
            referencedRelation: "Files"
            referencedColumns: ["fileId"]
          },
          {
            foreignKeyName: "public_Liked_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Friends_View"
            referencedColumns: ["usernameId"]
          },
          {
            foreignKeyName: "public_Liked_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Posts: {
        Row: {
          authorId: string
          commented: number
          content: string
          createdAt: string
          groupId: string
          likes: number
          postId: string
          roleId: string
          shared: number
          title: string
          updatedAt: string | null
        }
        Insert: {
          authorId: string
          commented?: number
          content: string
          createdAt?: string
          groupId: string
          likes?: number
          postId?: string
          roleId: string
          shared?: number
          title: string
          updatedAt?: string | null
        }
        Update: {
          authorId?: string
          commented?: number
          content?: string
          createdAt?: string
          groupId?: string
          likes?: number
          postId?: string
          roleId?: string
          shared?: number
          title?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_Posts_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Friends_View"
            referencedColumns: ["usernameId"]
          },
          {
            foreignKeyName: "public_Posts_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_Posts_groupId_fkey"
            columns: ["groupId"]
            isOneToOne: false
            referencedRelation: "Groups"
            referencedColumns: ["groupId"]
          },
          {
            foreignKeyName: "public_Posts_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["id"]
          },
        ]
      }
      Roles: {
        Row: {
          commentId: string | null
          fileCommentId: string | null
          fileId: string | null
          groupId: string | null
          id: string
          lastCommentId: string | null
          postId: string | null
          role: Database["public"]["Enums"]["Role"]
          subCommentId: string | null
          userId: string
        }
        Insert: {
          commentId?: string | null
          fileCommentId?: string | null
          fileId?: string | null
          groupId?: string | null
          id?: string
          lastCommentId?: string | null
          postId?: string | null
          role?: Database["public"]["Enums"]["Role"]
          subCommentId?: string | null
          userId: string
        }
        Update: {
          commentId?: string | null
          fileCommentId?: string | null
          fileId?: string | null
          groupId?: string | null
          id?: string
          lastCommentId?: string | null
          postId?: string | null
          role?: Database["public"]["Enums"]["Role"]
          subCommentId?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Roles_commentId_fkey"
            columns: ["commentId"]
            isOneToOne: false
            referencedRelation: "Comments"
            referencedColumns: ["commentId"]
          },
          {
            foreignKeyName: "Roles_fileCommentId_fkey"
            columns: ["fileCommentId"]
            isOneToOne: false
            referencedRelation: "FilesComments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Roles_fileId_fkey"
            columns: ["fileId"]
            isOneToOne: false
            referencedRelation: "Files"
            referencedColumns: ["fileId"]
          },
          {
            foreignKeyName: "Roles_groupId_fkey"
            columns: ["groupId"]
            isOneToOne: false
            referencedRelation: "Groups"
            referencedColumns: ["groupId"]
          },
          {
            foreignKeyName: "Roles_lastCommentId_fkey"
            columns: ["lastCommentId"]
            isOneToOne: false
            referencedRelation: "LastComments"
            referencedColumns: ["lastCommentId"]
          },
          {
            foreignKeyName: "Roles_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "Posts"
            referencedColumns: ["postId"]
          },
          {
            foreignKeyName: "Roles_subCommentId_fkey"
            columns: ["subCommentId"]
            isOneToOne: false
            referencedRelation: "SubComments"
            referencedColumns: ["subCommentId"]
          },
          {
            foreignKeyName: "Roles_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Friends_View"
            referencedColumns: ["usernameId"]
          },
          {
            foreignKeyName: "Roles_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      SubComments: {
        Row: {
          authorId: string
          commentId: string | null
          content: string
          createdAt: string
          fileCommentId: string | null
          roleId: string
          subCommentId: string
          updatedAt: string | null
        }
        Insert: {
          authorId: string
          commentId?: string | null
          content: string
          createdAt?: string
          fileCommentId?: string | null
          roleId: string
          subCommentId?: string
          updatedAt?: string | null
        }
        Update: {
          authorId?: string
          commentId?: string | null
          content?: string
          createdAt?: string
          fileCommentId?: string | null
          roleId?: string
          subCommentId?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_SubComments_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Friends_View"
            referencedColumns: ["usernameId"]
          },
          {
            foreignKeyName: "public_SubComments_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_SubComments_commentId_fkey"
            columns: ["commentId"]
            isOneToOne: false
            referencedRelation: "Comments"
            referencedColumns: ["commentId"]
          },
          {
            foreignKeyName: "public_SubComments_fileCommentId_fkey"
            columns: ["fileCommentId"]
            isOneToOne: false
            referencedRelation: "FilesComments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_SubComments_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["id"]
          },
        ]
      }
      Users: {
        Row: {
          billingCycle: Database["public"]["Enums"]["BillingCycleType"]
          createdAt: string
          description: string
          email: string
          id: string
          plan: Database["public"]["Enums"]["Plan"]
          profilePhoto: string
          provider: Database["public"]["Enums"]["Provider"]
          pseudonym: string
          updatedAt: string | null
          username: string
        }
        Insert: {
          billingCycle?: Database["public"]["Enums"]["BillingCycleType"]
          createdAt?: string
          description?: string
          email?: string
          id: string
          plan?: Database["public"]["Enums"]["Plan"]
          profilePhoto?: string
          provider: Database["public"]["Enums"]["Provider"]
          pseudonym: string
          updatedAt?: string | null
          username: string
        }
        Update: {
          billingCycle?: Database["public"]["Enums"]["BillingCycleType"]
          createdAt?: string
          description?: string
          email?: string
          id?: string
          plan?: Database["public"]["Enums"]["Plan"]
          profilePhoto?: string
          provider?: Database["public"]["Enums"]["Provider"]
          pseudonym?: string
          updatedAt?: string | null
          username?: string
        }
        Relationships: []
      }
      UsersGroups: {
        Row: {
          createdAt: string
          favorite: boolean
          groupId: string
          name: string
          roleId: string
          updatedAt: string | null
          userId: string
          usersGroupsId: string
        }
        Insert: {
          createdAt?: string
          favorite?: boolean
          groupId: string
          name: string
          roleId: string
          updatedAt?: string | null
          userId: string
          usersGroupsId?: string
        }
        Update: {
          createdAt?: string
          favorite?: boolean
          groupId?: string
          name?: string
          roleId?: string
          updatedAt?: string | null
          userId?: string
          usersGroupsId?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_UsersGroups_groupId_fkey"
            columns: ["groupId"]
            isOneToOne: false
            referencedRelation: "Groups"
            referencedColumns: ["groupId"]
          },
          {
            foreignKeyName: "public_UsersGroups_name_fkey"
            columns: ["name"]
            isOneToOne: false
            referencedRelation: "Groups"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "public_UsersGroups_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_UsersGroups_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Friends_View"
            referencedColumns: ["usernameId"]
          },
          {
            foreignKeyName: "public_UsersGroups_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      Friends_View: {
        Row: {
          createdAt: string | null
          favorite: boolean | null
          plan: Database["public"]["Enums"]["Plan"] | null
          profilePhoto: string | null
          pseudonym: string | null
          updatedAt: string | null
          usernameId: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      BillingCycleType: "month" | "year"
      Plan: "FREE" | "PREMIUM" | "GOLD"
      Provider: "email" | "google" | "discord" | "spotify"
      Role: "ADMIN" | "MODERATOR" | "USER" | "AUTHOR"
      Tags:
        | "realistic"
        | "manga"
        | "anime"
        | "comics"
        | "photographs"
        | "videos"
        | "animations"
        | "others"
        | "profile"
        | "group"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      BillingCycleType: ["month", "year"],
      Plan: ["FREE", "PREMIUM", "GOLD"],
      Provider: ["email", "google", "discord", "spotify"],
      Role: ["ADMIN", "MODERATOR", "USER", "AUTHOR"],
      Tags: [
        "realistic",
        "manga",
        "anime",
        "comics",
        "photographs",
        "videos",
        "animations",
        "others",
        "profile",
        "group",
      ],
    },
  },
} as const

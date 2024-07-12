export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Comments: {
        Row: {
          adModRoleId: string
          authorId: string
          comment: string
          commentId: string
          createdAt: string
          postId: string
          roleId: string
          updatedAt: string | null
        }
        Insert: {
          adModRoleId: string
          authorId: string
          comment: string
          commentId?: string
          createdAt?: string
          postId: string
          roleId: string
          updatedAt?: string | null
        }
        Update: {
          adModRoleId?: string
          authorId?: string
          comment?: string
          commentId?: string
          createdAt?: string
          postId?: string
          roleId?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_Comments_adModRoleId_fkey"
            columns: ["adModRoleId"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["id"]
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
          {
            foreignKeyName: "public_Comments_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["id"]
          }
        ]
      }
      Files: {
        Row: {
          authorId: string | null
          createdAt: string
          fileId: string
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
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_Files_groupId_fkey"
            columns: ["groupId"]
            isOneToOne: false
            referencedRelation: "Groups"
            referencedColumns: ["groupId"]
          }
        ]
      }
      FilesComments: {
        Row: {
          authorId: string
          comment: string
          createdAt: string
          fileId: string
          id: string
          roleId: string
          updatedAt: string | null
        }
        Insert: {
          authorId: string
          comment: string
          createdAt?: string
          fileId: string
          id?: string
          roleId: string
          updatedAt?: string | null
        }
        Update: {
          authorId?: string
          comment?: string
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
          }
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
          id: string
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
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_Friends_usernameId_fkey"
            columns: ["usernameId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          }
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
          adModRoleId: string | null
          authorId: string
          createdAt: string
          lastComment: string
          lastCommentId: string
          roleId: string
          subCommentId: string
          updatedAt: string | null
        }
        Insert: {
          adModRoleId?: string | null
          authorId: string
          createdAt?: string
          lastComment: string
          lastCommentId?: string
          roleId: string
          subCommentId: string
          updatedAt?: string | null
        }
        Update: {
          adModRoleId?: string | null
          authorId?: string
          createdAt?: string
          lastComment?: string
          lastCommentId?: string
          roleId?: string
          subCommentId?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_LastComments_adModRoleId_fkey"
            columns: ["adModRoleId"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["id"]
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
          }
        ]
      }
      Liked: {
        Row: {
          fileId: string | null
          id: string
          postId: string
          userId: string
        }
        Insert: {
          fileId?: string | null
          id?: string
          postId: string
          userId: string
        }
        Update: {
          fileId?: string | null
          id?: string
          postId?: string
          userId?: string
        }
        Relationships: [
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
            referencedRelation: "Users"
            referencedColumns: ["id"]
          }
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
          updatedAt: string
        }
        Insert: {
          authorId: string
          commented: number
          content: string
          createdAt?: string
          groupId: string
          likes: number
          postId?: string
          roleId: string
          shared: number
          title: string
          updatedAt: string
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
          updatedAt?: string
        }
        Relationships: [
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
          }
        ]
      }
      Roles: {
        Row: {
          commentId: string | null
          fileId: string | null
          groupId: string | null
          id: string
          postId: string | null
          role: Database["public"]["Enums"]["Role"]
          userId: string
        }
        Insert: {
          commentId?: string | null
          fileId?: string | null
          groupId?: string | null
          id?: string
          postId?: string | null
          role?: Database["public"]["Enums"]["Role"]
          userId: string
        }
        Update: {
          commentId?: string | null
          fileId?: string | null
          groupId?: string | null
          id?: string
          postId?: string | null
          role?: Database["public"]["Enums"]["Role"]
          userId?: string
        }
        Relationships: []
      }
      SubComments: {
        Row: {
          adModRoleId: string | null
          authorId: string
          commentId: string | null
          createdAt: string
          fileCommentId: string | null
          roleId: string
          subComment: string
          subCommentId: string
          updatedAt: string | null
        }
        Insert: {
          adModRoleId?: string | null
          authorId: string
          commentId?: string | null
          createdAt?: string
          fileCommentId?: string | null
          roleId: string
          subComment: string
          subCommentId?: string
          updatedAt?: string | null
        }
        Update: {
          adModRoleId?: string | null
          authorId?: string
          commentId?: string | null
          createdAt?: string
          fileCommentId?: string | null
          roleId?: string
          subComment?: string
          subCommentId?: string
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_SubComments_adModRoleId_fkey"
            columns: ["adModRoleId"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["id"]
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
            isOneToOne: true
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
          }
        ]
      }
      Users: {
        Row: {
          createdAt: string | null
          description: string | null
          email: string | null
          id: string
          plan: Database["public"]["Enums"]["Plan"]
          profilePhoto: string | null
          provider: Database["public"]["Enums"]["Provider"] | null
          pseudonym: string | null
          updatedAt: string | null
          username: string | null
        }
        Insert: {
          createdAt?: string | null
          description?: string | null
          email?: string | null
          id: string
          plan?: Database["public"]["Enums"]["Plan"]
          profilePhoto?: string | null
          provider?: Database["public"]["Enums"]["Provider"] | null
          pseudonym?: string | null
          updatedAt?: string | null
          username?: string | null
        }
        Update: {
          createdAt?: string | null
          description?: string | null
          email?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["Plan"]
          profilePhoto?: string | null
          provider?: Database["public"]["Enums"]["Provider"] | null
          pseudonym?: string | null
          updatedAt?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_Users_profilePhoto_fkey"
            columns: ["profilePhoto"]
            isOneToOne: false
            referencedRelation: "Files"
            referencedColumns: ["name"]
          }
        ]
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
            referencedRelation: "Users"
            referencedColumns: ["id"]
          }
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

export type Tables<
  PublicTableNameOrOptions extends
      | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
      | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
      | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
      | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

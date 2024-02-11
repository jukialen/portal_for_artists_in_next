export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      _LikedToUsers: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_LikedToUsers_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "Liked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_LikedToUsers_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          }
        ]
      }
      _RolesToUsersGroups: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_RolesToUsersGroups_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "UsersGroups"
            referencedColumns: ["usersGroupsId"]
          }
        ]
      }
      Comments: {
        Row: {
          adModRoleId: string
          authorId: string
          comment: string
          commentId: string
          createdAt: string
          postId: string
          roleId: string
          updatedAt: string
        }
        Insert: {
          adModRoleId: string
          authorId: string
          comment: string
          commentId: string
          createdAt?: string
          postId: string
          roleId: string
          updatedAt: string
        }
        Update: {
          adModRoleId?: string
          authorId?: string
          comment?: string
          commentId?: string
          createdAt?: string
          postId?: string
          roleId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Comments_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Comments_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "Posts"
            referencedColumns: ["postId"]
          },
          {
            foreignKeyName: "Comments_roleId_fkey"
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
          updatedAt: string
        }
        Insert: {
          authorId?: string | null
          createdAt?: string
          fileId: string
          groupId?: string | null
          name: string
          profileType?: boolean
          shortDescription?: string | null
          tags: Database["public"]["Enums"]["Tags"]
          updatedAt: string
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
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Files_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Files_name_fkey"
            columns: ["name"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["profilePhoto"]
          },
          {
            foreignKeyName: "logo"
            columns: ["name"]
            isOneToOne: false
            referencedRelation: "Groups"
            referencedColumns: ["logo"]
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
          updatedAt: string
        }
        Insert: {
          authorId: string
          comment: string
          createdAt?: string
          fileId: string
          id: string
          roleId: string
          updatedAt: string
        }
        Update: {
          authorId?: string
          comment?: string
          createdAt?: string
          fileId?: string
          id?: string
          roleId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "FilesComments_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FilesComments_fileId_fkey"
            columns: ["fileId"]
            isOneToOne: false
            referencedRelation: "Files"
            referencedColumns: ["fileId"]
          },
          {
            foreignKeyName: "FilesComments_roleId_fkey"
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
          updatedAt: string
          usernameId: string
        }
        Insert: {
          createdAt?: string
          favorite?: boolean
          friendId: string
          id: string
          updatedAt: string
          usernameId: string
        }
        Update: {
          createdAt?: string
          favorite?: boolean
          friendId?: string
          id?: string
          updatedAt?: string
          usernameId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Friends_friendId_fkey"
            columns: ["friendId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Friends_usernameId_fkey"
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
          updatedAt: string
        }
        Insert: {
          adminId: string
          createdAt?: string
          description: string
          groupId: string
          logo?: string | null
          name: string
          regulation?: string | null
          updatedAt: string
        }
        Update: {
          adminId?: string
          createdAt?: string
          description?: string
          groupId?: string
          logo?: string | null
          name?: string
          regulation?: string | null
          updatedAt?: string
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
          updatedAt: string
        }
        Insert: {
          adModRoleId?: string | null
          authorId: string
          createdAt?: string
          lastComment: string
          lastCommentId: string
          roleId: string
          subCommentId: string
          updatedAt: string
        }
        Update: {
          adModRoleId?: string | null
          authorId?: string
          createdAt?: string
          lastComment?: string
          lastCommentId?: string
          roleId?: string
          subCommentId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "LastComments_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "LastComments_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "LastComments_subCommentId_fkey"
            columns: ["subCommentId"]
            isOneToOne: false
            referencedRelation: "SubComments"
            referencedColumns: ["subCommentId"]
          }
        ]
      }
      Liked: {
        Row: {
          id: string
          postId: string
          userId: string
        }
        Insert: {
          id: string
          postId: string
          userId: string
        }
        Update: {
          id?: string
          postId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Liked_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "Posts"
            referencedColumns: ["postId"]
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
          roleId: string | null
          shared: number
          title: string
          updatedAt: string
        }
        Insert: {
          authorId: string
          commented?: number
          content: string
          createdAt?: string
          groupId: string
          likes?: number
          postId: string
          roleId?: string | null
          shared?: number
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
          roleId?: string | null
          shared?: number
          title?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Posts_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Posts_groupId_fkey"
            columns: ["groupId"]
            isOneToOne: false
            referencedRelation: "Groups"
            referencedColumns: ["groupId"]
          },
          {
            foreignKeyName: "Posts_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["id"]
          }
        ]
      }
      Roles: {
        Row: {
          fileId: string | null
          groupId: string | null
          id: string
          postId: string | null
          role: Database["public"]["Enums"]["Role"]
          userId: string
        }
        Insert: {
          fileId?: string | null
          groupId?: string | null
          id: string
          postId?: string | null
          role?: Database["public"]["Enums"]["Role"]
          userId: string
        }
        Update: {
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
          updatedAt: string
        }
        Insert: {
          adModRoleId?: string | null
          authorId: string
          commentId?: string | null
          createdAt?: string
          fileCommentId?: string | null
          roleId: string
          subComment: string
          subCommentId: string
          updatedAt: string
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
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "SubComments_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SubComments_commentId_fkey"
            columns: ["commentId"]
            isOneToOne: false
            referencedRelation: "Comments"
            referencedColumns: ["commentId"]
          },
          {
            foreignKeyName: "SubComments_fileCommentId_fkey"
            columns: ["fileCommentId"]
            isOneToOne: false
            referencedRelation: "FilesComments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SubComments_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["id"]
          }
        ]
      }
      Users: {
        Row: {
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
        Relationships: []
      }
      UsersGroups: {
        Row: {
          createdAt: string
          favorite: boolean
          groupId: string
          name: string
          roleId: string
          updatedAt: string
          userId: string
          usersGroupsId: string
        }
        Insert: {
          createdAt?: string
          favorite?: boolean
          groupId: string
          name: string
          roleId: string
          updatedAt: string
          userId: string
          usersGroupsId: string
        }
        Update: {
          createdAt?: string
          favorite?: boolean
          groupId?: string
          name?: string
          roleId?: string
          updatedAt?: string
          userId?: string
          usersGroupsId?: string
        }
        Relationships: [
          {
            foreignKeyName: "UsersGroups_groupId_fkey"
            columns: ["groupId"]
            isOneToOne: false
            referencedRelation: "Groups"
            referencedColumns: ["groupId"]
          },
          {
            foreignKeyName: "UsersGroups_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UsersGroups_userId_fkey"
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

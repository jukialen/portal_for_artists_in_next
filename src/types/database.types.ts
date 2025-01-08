export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
          },
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
          },
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
            referencedRelation: "Users"
            referencedColumns: ["id"]
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
          },
        ]
      }
      Liked: {
        Row: {
          fileId: string | null
          id: string
          postId: string | null
          userId: string
        }
        Insert: {
          fileId?: string | null
          id?: string
          postId?: string | null
          userId: string
        }
        Update: {
          fileId?: string | null
          id?: string
          postId?: string | null
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
          },
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
          },
        ]
      }
      Users: {
        Row: {
          createdAt: string | null
          description: string | null
          email: string
          id: string
          plan: Database["public"]["Enums"]["Plan"]
          profilePhoto: string | null
          provider: Database["public"]["Enums"]["Provider"] | null
          pseudonym: string
          updatedAt: string | null
          username: string
        }
        Insert: {
          createdAt?: string | null
          description?: string | null
          email: string
          id?: string
          plan?: Database["public"]["Enums"]["Plan"]
          profilePhoto?: string | null
          provider?: Database["public"]["Enums"]["Provider"] | null
          pseudonym: string
          updatedAt?: string | null
          username: string
        }
        Update: {
          createdAt?: string | null
          description?: string | null
          email?: string
          id?: string
          plan?: Database["public"]["Enums"]["Plan"]
          profilePhoto?: string | null
          provider?: Database["public"]["Enums"]["Provider"] | null
          pseudonym?: string
          updatedAt?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_Users_profilePhoto_fkey"
            columns: ["profilePhoto"]
            isOneToOne: false
            referencedRelation: "Files"
            referencedColumns: ["name"]
          },
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

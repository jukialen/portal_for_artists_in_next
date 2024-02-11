import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const serverSupabase = async () => {
  'use server'
  return createServerComponentClient({ cookies });
}
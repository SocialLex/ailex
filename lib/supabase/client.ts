"use client"

import { createBrowserClient } from "@supabase/ssr"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

export function createClient() {
  if (!url.startsWith("http") || key.length < 20) {
    throw new Error("Supabase non configuré")
  }
  return createBrowserClient(url, key)
}

export function createClientSafe() {
  if (!url.startsWith("http") || key.length < 20) return null
  try {
    return createBrowserClient(url, key)
  } catch {
    return null
  }
}

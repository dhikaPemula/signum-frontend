"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { apiClient } from "./api-client"

interface User {
  id: string
  email: string
  nama_lengkap: string
  role: "operator" | "bendahara" | "verifikator" | "ppk"
  skpd_id: string | null
}

interface AuthContextType {
  user: User | null
  profile: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, nama_lengkap: string, role: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (token) {
          // Verify token dengan API
          const response = await apiClient.getCurrentUser()
          if (response.success && response.data) {
            setUser(response.data as User)
          } else {
            // Token tidak valid, hapus
            localStorage.removeItem("auth_token")
            apiClient.setToken(null)
          }
        }
      } catch (error) {
        console.error("[v0] Auth initialization error:", error)
        localStorage.removeItem("auth_token")
        apiClient.setToken(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log("[v0] Signing in with email:", email)
      const response = await apiClient.login(email, password)

      if (!response.success) {
        throw new Error(response.message || "Login gagal")
      }

      const data = response.data as { user: User; token: string }
      apiClient.setToken(data.token)
      setUser(data.user)
      console.log("[v0] Login berhasil")
    } catch (error) {
      console.error("[v0] Login error:", error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, nama_lengkap: string, role = "operator") => {
    try {
      console.log("[v0] Registering user:", email)
      const response = await apiClient.register(email, password, nama_lengkap, role)

      if (!response.success) {
        throw new Error(response.message || "Registrasi gagal")
      }

      const data = response.data as { user: User; token: string }
      apiClient.setToken(data.token)
      setUser(data.user)
      console.log("[v0] Registrasi berhasil")
    } catch (error) {
      console.error("[v0] Sign up error:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await apiClient.logout()
      localStorage.removeItem("auth_token")
      apiClient.setToken(null)
      setUser(null)
    } catch (error) {
      console.error("[v0] Logout error:", error)
      // Tetap logout di frontend meskipun API request gagal
      localStorage.removeItem("auth_token")
      apiClient.setToken(null)
      setUser(null)
    }
  }

  return <AuthContext.Provider value={{ user, profile: user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

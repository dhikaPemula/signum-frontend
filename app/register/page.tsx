"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [namaLengkap, setNamaLengkap] = useState("")
  const [role, setRole] = useState("operator")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    if (!namaLengkap.trim()) {
      setError("Nama lengkap harus diisi")
      return false
    }
    if (!email.trim()) {
      setError("Email harus diisi")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Format email tidak valid")
      return false
    }
    if (!password) {
      setError("Password harus diisi")
      return false
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter")
      return false
    }
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      console.log("[v0] Registering user:", email)
      await signUp(email, password, namaLengkap, role)
      setSuccess("Akun berhasil dibuat! Anda akan dialihkan ke dashboard...")
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Pendaftaran gagal"
      setError(errorMessage)
      console.error("[v0] Sign up error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary text-primary-foreground mb-4">
            <span className="text-2xl font-bold">A</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Accounting</h1>
          <p className="text-muted-foreground mt-1">SKPD Management System</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Buat akun baru</CardTitle>
            <CardDescription>Daftar untuk memulai</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <label htmlFor="nama" className="text-sm font-medium text-foreground">
                  Nama Lengkap
                </label>
                <Input
                  id="nama"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  disabled={loading}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium text-foreground">
                  Peran
                </label>
                <Select value={role} onValueChange={setRole} disabled={loading}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="bendahara">Bendahara</SelectItem>
                    <SelectItem value="verifikator">Verifikator</SelectItem>
                    <SelectItem value="ppk">PPK (Admin)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirm" className="text-sm font-medium text-foreground">
                  Konfirmasi Password
                </label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="h-10"
                />
              </div>
              <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
                {loading ? "Membuat akun..." : "Daftar"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Sudah punya akun? </span>
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Masuk di sini
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import { validateAkunForm, type ValidationError } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ValidationError as ValidationErrorComponent } from "./validation-error"

interface AkunFormProps {
  editingId: string | null
  onClose: () => void
  skpdList: Array<{ id: string; nama_skpd: string }>
}

interface FormData {
  email: string
  nama_lengkap: string
  role: "operator" | "bendahara" | "verifikator" | "ppk"
  skpd_id: string | null
  is_active: boolean
}

export function AkunForm({ editingId, onClose, skpdList }: AkunFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    nama_lengkap: "",
    role: "operator",
    skpd_id: null,
    is_active: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])

  useEffect(() => {
    if (editingId) {
      const fetchAkun = async () => {
        try {
          const response = await apiClient.getAkunById(editingId)

          if (!response.success) {
            throw new Error(response.message || "Gagal mengambil data akun")
          }

          const data = response.data as FormData
          setFormData(data)
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Gagal mengambil data akun"
          setError(errorMessage)
          console.error("[v0] Fetch Akun error:", err)
        }
      }
      fetchAkun()
    }
  }, [editingId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "skpd_id" ? value || null : (value as FormData[keyof FormData]),
    }))
    setValidationErrors([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setValidationErrors([])

    const errors = validateAkunForm(formData)
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    setLoading(true)

    try {
      let response
      if (editingId) {
        response = await apiClient.updateAkun(editingId, formData)
      } else {
        response = await apiClient.createAkun(formData)
      }

      if (!response.success) {
        throw new Error(response.message || "Gagal menyimpan akun")
      }

      onClose()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal menyimpan akun"
      setError(errorMessage)
      console.error("[v0] Save Akun error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingId ? "Edit Akun" : "Tambah Akun Baru"}</CardTitle>
        <CardDescription>Isi informasi akun dengan lengkap</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {validationErrors.length > 0 && <ValidationErrorComponent errors={validationErrors} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={!!editingId || loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="nama_lengkap" className="text-sm font-medium">
                Nama Lengkap *
              </label>
              <Input
                id="nama_lengkap"
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Peran *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="operator">Operator</option>
                <option value="bendahara">Bendahara</option>
                <option value="verifikator">Verifikator</option>
                <option value="ppk">PPK (Admin)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="skpd_id" className="text-sm font-medium">
                SKPD
              </label>
              <select
                id="skpd_id"
                name="skpd_id"
                value={formData.skpd_id || ""}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="">Tanpa SKPD</option>
                {skpdList.map((skpd) => (
                  <option key={skpd.id} value={skpd.id}>
                    {skpd.nama_skpd}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={handleChange}
              disabled={loading}
              className="rounded border-border"
            />
            <label htmlFor="is_active" className="text-sm font-medium">
              Aktif
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

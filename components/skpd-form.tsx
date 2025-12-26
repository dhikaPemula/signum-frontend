"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import { validateSkpdForm, type ValidationError } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ValidationError as ValidationErrorComponent } from "./validation-error"

interface SkpdFormProps {
  editingId: string | null
  onClose: () => void
}

interface FormData {
  kode_skpd: string
  nama_skpd: string
  kepala_skpd: string
  alamat: string
  telepon: string
  email: string
  is_active: boolean
}

export function SkpdForm({ editingId, onClose }: SkpdFormProps) {
  const [formData, setFormData] = useState<FormData>({
    kode_skpd: "",
    nama_skpd: "",
    kepala_skpd: "",
    alamat: "",
    telepon: "",
    email: "",
    is_active: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])

  useEffect(() => {
    if (editingId) {
      const fetchSkpd = async () => {
        try {
          const response = await apiClient.getSKPDById(editingId)

          if (!response.success) {
            throw new Error(response.message || "Gagal mengambil data SKPD")
          }

          const data = response.data as FormData
          setFormData(data)
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Gagal mengambil data SKPD"
          setError(errorMessage)
          console.error("[v0] Fetch SKPD by ID error:", err)
        }
      }
      fetchSkpd()
    }
  }, [editingId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    setValidationErrors([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setValidationErrors([])

    const errors = validateSkpdForm(formData)
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    setLoading(true)

    try {
      let response
      if (editingId) {
        response = await apiClient.updateSKPD(editingId, formData)
      } else {
        response = await apiClient.createSKPD(formData)
      }

      if (!response.success) {
        throw new Error(response.message || "Gagal menyimpan SKPD")
      }

      onClose()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal menyimpan SKPD"
      setError(errorMessage)
      console.error("[v0] Save SKPD error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingId ? "Edit SKPD" : "Tambah SKPD Baru"}</CardTitle>
        <CardDescription>Isi informasi SKPD dengan lengkap</CardDescription>
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
              <label htmlFor="kode_skpd" className="text-sm font-medium">
                Kode SKPD *
              </label>
              <Input
                id="kode_skpd"
                name="kode_skpd"
                value={formData.kode_skpd}
                onChange={handleChange}
                required
                disabled={!!editingId || loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="nama_skpd" className="text-sm font-medium">
                Nama SKPD *
              </label>
              <Input
                id="nama_skpd"
                name="nama_skpd"
                value={formData.nama_skpd}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="kepala_skpd" className="text-sm font-medium">
                Kepala SKPD
              </label>
              <Input
                id="kepala_skpd"
                name="kepala_skpd"
                value={formData.kepala_skpd}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="telepon" className="text-sm font-medium">
                Telepon
              </label>
              <Input id="telepon" name="telepon" value={formData.telepon} onChange={handleChange} disabled={loading} />
            </div>

            <div className="space-y-2">
              <label htmlFor="alamat" className="text-sm font-medium">
                Alamat
              </label>
              <Input id="alamat" name="alamat" value={formData.alamat} onChange={handleChange} disabled={loading} />
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

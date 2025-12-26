"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import { validateKodefikasiForm, type ValidationError } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ValidationError as ValidationErrorComponent } from "./validation-error"

interface KodefikasiFormProps {
  editingId: string | null
  onClose: () => void
  skpdList: Array<{ id: string; nama_skpd: string }>
}

interface FormData {
  skpd_id: string
  kode_rekening: string
  nama_rekening: string
  jenis_belanja: string
  anggaran: number
  realisasi: number
  is_active: boolean
}

export function KodefikasiForm({ editingId, onClose, skpdList }: KodefikasiFormProps) {
  const [formData, setFormData] = useState<FormData>({
    skpd_id: "",
    kode_rekening: "",
    nama_rekening: "",
    jenis_belanja: "",
    anggaran: 0,
    realisasi: 0,
    is_active: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])

  useEffect(() => {
    if (editingId) {
      const fetchKodefikasi = async () => {
        try {
          const response = await apiClient.getKodefikasiById(editingId)

          if (!response.success) {
            throw new Error(response.message || "Gagal mengambil data Kodefikasi")
          }

          const data = response.data as FormData
          setFormData(data)
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Gagal mengambil data Kodefikasi"
          setError(errorMessage)
          console.error("[v0] Fetch Kodefikasi error:", err)
        }
      }
      fetchKodefikasi()
    }
  }, [editingId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number.parseFloat(value) : value,
    }))
    setValidationErrors([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setValidationErrors([])

    const errors = validateKodefikasiForm(formData)
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    setLoading(true)

    try {
      let response
      if (editingId) {
        response = await apiClient.updateKodefikasi(editingId, formData)
      } else {
        response = await apiClient.createKodefikasi(formData)
      }

      if (!response.success) {
        throw new Error(response.message || "Gagal menyimpan Kodefikasi")
      }

      onClose()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal menyimpan Kodefikasi"
      setError(errorMessage)
      console.error("[v0] Save Kodefikasi error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingId ? "Edit Kodefikasi" : "Tambah Kodefikasi Baru"}</CardTitle>
        <CardDescription>Isi informasi kodefikasi dengan lengkap</CardDescription>
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
              <label htmlFor="skpd_id" className="text-sm font-medium">
                SKPD *
              </label>
              <select
                id="skpd_id"
                name="skpd_id"
                value={formData.skpd_id}
                onChange={handleChange}
                required
                disabled={!!editingId || loading}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="">Pilih SKPD</option>
                {skpdList.map((skpd) => (
                  <option key={skpd.id} value={skpd.id}>
                    {skpd.nama_skpd}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="kode_rekening" className="text-sm font-medium">
                Kode Rekening *
              </label>
              <Input
                id="kode_rekening"
                name="kode_rekening"
                value={formData.kode_rekening}
                onChange={handleChange}
                required
                disabled={!!editingId || loading}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="nama_rekening" className="text-sm font-medium">
                Nama Rekening *
              </label>
              <Input
                id="nama_rekening"
                name="nama_rekening"
                value={formData.nama_rekening}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="jenis_belanja" className="text-sm font-medium">
                Jenis Belanja
              </label>
              <Input
                id="jenis_belanja"
                name="jenis_belanja"
                value={formData.jenis_belanja}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="anggaran" className="text-sm font-medium">
                Anggaran
              </label>
              <Input
                id="anggaran"
                name="anggaran"
                type="number"
                value={formData.anggaran}
                onChange={handleChange}
                step="0.01"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="realisasi" className="text-sm font-medium">
                Realisasi
              </label>
              <Input
                id="realisasi"
                name="realisasi"
                type="number"
                value={formData.realisasi}
                onChange={handleChange}
                step="0.01"
                disabled={loading}
              />
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

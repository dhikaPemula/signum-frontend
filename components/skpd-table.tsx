"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SkpdForm } from "./skpd-form"

interface SKPD {
  id: string
  kode_skpd: string
  nama_skpd: string
  kepala_skpd: string | null
  alamat: string | null
  telepon: string | null
  email: string | null
  is_active: boolean
}

export function SkpdTable() {
  const [skpdList, setSkpdList] = useState<SKPD[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchSkpd = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getSKPDList()

      if (!response.success) {
        throw new Error(response.message || "Gagal mengambil data SKPD")
      }

      setSkpdList(response.data || [])
    } catch (err) {
      console.error("[v0] Fetch SKPD error:", err)
      setError(err instanceof Error ? err.message : "Gagal mengambil data SKPD")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkpd()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus SKPD ini?")) return

    try {
      const response = await apiClient.deleteSKPD(id)

      if (!response.success) {
        throw new Error(response.message || "Gagal menghapus SKPD")
      }

      setSkpdList(skpdList.filter((item) => item.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal menghapus SKPD"
      setError(errorMessage)
      console.error("[v0] Delete SKPD error:", err)
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingId(null)
    fetchSkpd()
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showForm ? (
        <SkpdForm editingId={editingId} onClose={handleFormClose} />
      ) : (
        <Button onClick={() => setShowForm(true)}>Tambah SKPD Baru</Button>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Daftar SKPD</CardTitle>
          <CardDescription>Kelola Satuan Kerja Perangkat Daerah</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-foreground/60">Memuat data...</p>
            </div>
          ) : skpdList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-foreground/60">Data SKPD tidak ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Kode</th>
                    <th className="text-left py-3 px-4 font-semibold">Nama SKPD</th>
                    <th className="text-left py-3 px-4 font-semibold">Kepala</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {skpdList.map((skpd) => (
                    <tr key={skpd.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">{skpd.kode_skpd}</td>
                      <td className="py-3 px-4">{skpd.nama_skpd}</td>
                      <td className="py-3 px-4">{skpd.kepala_skpd || "-"}</td>
                      <td className="py-3 px-4 text-sm">{skpd.email || "-"}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            skpd.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {skpd.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="py-3 px-4 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingId(skpd.id)
                            setShowForm(true)
                          }}
                        >
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(skpd.id)}>
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

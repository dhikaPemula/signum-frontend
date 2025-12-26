"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AkunForm } from "./akun-form"

interface Akun {
  id: string
  email: string
  nama_lengkap: string
  role: "operator" | "bendahara" | "verifikator" | "ppk"
  skpd_id: string | null
  is_active: boolean
}

interface SKPD {
  id: string
  nama_skpd: string
}

export function AkunTable() {
  const [akunList, setAkunList] = useState<Akun[]>([])
  const [skpdList, setSkpdList] = useState<SKPD[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch SKPD list
      const skpdResponse = await apiClient.getSKPDList()
      if (skpdResponse.success) {
        setSkpdList(skpdResponse.data || [])
      }

      // Fetch Akun list
      const akunResponse = await apiClient.getAkunList()
      if (!akunResponse.success) {
        throw new Error(akunResponse.message || "Gagal mengambil data akun")
      }

      setAkunList(akunResponse.data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal mengambil data"
      setError(errorMessage)
      console.error("[v0] Fetch Akun error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus akun ini?")) return

    try {
      const response = await apiClient.deleteAkun(id)

      if (!response.success) {
        throw new Error(response.message || "Gagal menghapus akun")
      }

      setAkunList(akunList.filter((item) => item.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal menghapus akun"
      setError(errorMessage)
      console.error("[v0] Delete Akun error:", err)
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingId(null)
    fetchData()
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      ppk: "bg-purple-100 text-purple-800",
      bendahara: "bg-blue-100 text-blue-800",
      verifikator: "bg-green-100 text-green-800",
      operator: "bg-gray-100 text-gray-800",
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showForm ? (
        <AkunForm editingId={editingId} onClose={handleFormClose} skpdList={skpdList} />
      ) : (
        <Button onClick={() => setShowForm(true)}>Tambah Akun Baru</Button>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Daftar Akun Pengguna</CardTitle>
          <CardDescription>Kelola akun pengguna sistem dan peran mereka</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-foreground/60">Memuat data...</p>
            </div>
          ) : akunList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-foreground/60">Data akun tidak ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Nama</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Peran</th>
                    <th className="text-left py-3 px-4 font-semibold">SKPD</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {akunList.map((akun) => {
                    const skpd = skpdList.find((s) => s.id === akun.skpd_id)
                    return (
                      <tr key={akun.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{akun.nama_lengkap}</td>
                        <td className="py-3 px-4 text-sm">{akun.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(akun.role)}`}>
                            {akun.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">{skpd?.nama_skpd || "-"}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              akun.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {akun.is_active ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                        <td className="py-3 px-4 space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingId(akun.id)
                              setShowForm(true)
                            }}
                          >
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(akun.id)}>
                            Hapus
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

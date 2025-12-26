"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { KodefikasiForm } from "./kodefikasi-form"

interface Kodefikasi {
  id: string
  skpd_id: string
  kode_rekening: string
  nama_rekening: string
  jenis_belanja: string | null
  anggaran: number
  realisasi: number
  is_active: boolean
}

interface SKPD {
  id: string
  nama_skpd: string
}

export function KodefikasiTable() {
  const [kodefikasiList, setKodefikasiList] = useState<Kodefikasi[]>([])
  const [skpdList, setSkpdList] = useState<SKPD[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedSkpd, setSelectedSkpd] = useState<string>("")
  const { user } = useAuth()

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch SKPD list
      const skpdResponse = await apiClient.getSKPDList()
      if (skpdResponse.success) {
        setSkpdList(skpdResponse.data || [])
      }

      // Fetch Kodefikasi
      const kodefikasiResponse = await apiClient.getKodefikasiList()
      if (!kodefikasiResponse.success) {
        throw new Error(kodefikasiResponse.message || "Gagal mengambil data Kodefikasi")
      }

      let data = kodefikasiResponse.data || []

      // Filter berdasarkan role
      if (user?.role === "bendahara" && user?.skpd_id) {
        data = data.filter((item: Kodefikasi) => item.skpd_id === user.skpd_id)
      }

      setKodefikasiList(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal mengambil data"
      setError(errorMessage)
      console.error("[v0] Fetch Kodefikasi error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus Kodefikasi ini?")) return

    try {
      const response = await apiClient.deleteKodefikasi(id)

      if (!response.success) {
        throw new Error(response.message || "Gagal menghapus Kodefikasi")
      }

      setKodefikasiList(kodefikasiList.filter((item) => item.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal menghapus Kodefikasi"
      setError(errorMessage)
      console.error("[v0] Delete Kodefikasi error:", err)
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingId(null)
    setSelectedSkpd("")
    fetchData()
  }

  const filteredList = selectedSkpd ? kodefikasiList.filter((item) => item.skpd_id === selectedSkpd) : kodefikasiList

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showForm ? (
        <KodefikasiForm editingId={editingId} onClose={handleFormClose} skpdList={skpdList} />
      ) : (
        <Button onClick={() => setShowForm(true)}>Tambah Kodefikasi Baru</Button>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kodefikasi</CardTitle>
          <CardDescription>Kelola Kode Rekening dan Anggaran</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user?.role === "ppk" && (
            <div className="space-y-2">
              <label htmlFor="skpd-filter" className="text-sm font-medium">
                Filter berdasarkan SKPD
              </label>
              <select
                id="skpd-filter"
                value={selectedSkpd}
                onChange={(e) => setSelectedSkpd(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="">Semua SKPD</option>
                {skpdList.map((skpd) => (
                  <option key={skpd.id} value={skpd.id}>
                    {skpd.nama_skpd}
                  </option>
                ))}
              </select>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-foreground/60">Memuat data...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-foreground/60">Data Kodefikasi tidak ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Kode</th>
                    <th className="text-left py-3 px-4 font-semibold">Nama Rekening</th>
                    <th className="text-left py-3 px-4 font-semibold">Jenis Belanja</th>
                    <th className="text-right py-3 px-4 font-semibold">Anggaran</th>
                    <th className="text-right py-3 px-4 font-semibold">Realisasi</th>
                    <th className="text-left py-3 px-4 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">{item.kode_rekening}</td>
                      <td className="py-3 px-4">{item.nama_rekening}</td>
                      <td className="py-3 px-4">{item.jenis_belanja || "-"}</td>
                      <td className="py-3 px-4 text-right font-medium text-green-600">
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item.anggaran)}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-blue-600">
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item.realisasi)}
                      </td>
                      <td className="py-3 px-4 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingId(item.id)
                            setShowForm(true)
                          }}
                        >
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
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

"use client"

import { SkpdTable } from "@/components/skpd-table"

export default function SkpdPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">SKPD Management</h1>
        <p className="text-foreground/60 mt-2">Manage Satuan Kerja Perangkat Daerah</p>
      </div>
      <SkpdTable />
    </div>
  )
}

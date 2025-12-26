"use client"

import { KodefikasiTable } from "@/components/kodefikasi-table"

export default function KodefikasiPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Kodefikasi Management</h1>
        <p className="text-foreground/60 mt-2">Manage Budget Codes and Allocations</p>
      </div>
      <KodefikasiTable />
    </div>
  )
}

"use client"

import { AkunTable } from "@/components/akun-table"

export default function AkunPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Accounts</h1>
        <p className="text-foreground/60 mt-2">Manage system user accounts and assign roles</p>
      </div>
      <AkunTable />
    </div>
  )
}

"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, FileText, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const { profile } = useAuth()

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ppk":
        return "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
      case "bendahara":
        return "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800"
      case "verifikator":
        return "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
      default:
        return "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ppk":
        return <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      case "bendahara":
        return <BarChart3 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
      case "verifikator":
        return <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
      default:
        return <TrendingUp className="w-6 h-6 text-slate-600 dark:text-slate-400" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back to your accounting system</p>
      </div>

      {/* User Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Role Card */}
        <Card className={`border-2 ${getRoleColor(profile?.role || "operator")}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
            {getRoleIcon(profile?.role || "operator")}
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{profile?.role?.toUpperCase()}</p>
            <p className="text-xs text-muted-foreground mt-1">Current user role</p>
          </CardContent>
        </Card>

        {/* Name Card */}
        <Card className="border-2 bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Full Name</CardTitle>
            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{profile?.nama_lengkap}</p>
            <p className="text-xs text-muted-foreground mt-1">Account holder</p>
          </CardContent>
        </Card>

        {/* Email Card */}
        <Card className="border-2 bg-cyan-50 dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email</CardTitle>
            <FileText className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold text-foreground truncate">{profile?.email}</p>
            <p className="text-xs text-muted-foreground mt-1">Contact email</p>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">System Information</CardTitle>
          <CardDescription>Overview of available modules for your role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Available Modules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile?.role === "ppk" && (
                <>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="font-medium text-foreground">Manage SKPD</p>
                    <p className="text-sm text-muted-foreground mt-1">Satuan Kerja Perangkat Daerah</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="font-medium text-foreground">Manage Kodefikasi</p>
                    <p className="text-sm text-muted-foreground mt-1">Budget Codes & Allocation</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="font-medium text-foreground">Manage User Accounts</p>
                    <p className="text-sm text-muted-foreground mt-1">Create & manage users</p>
                  </div>
                </>
              )}
              {profile?.role === "bendahara" && (
                <>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="font-medium text-foreground">Manage Kodefikasi</p>
                    <p className="text-sm text-muted-foreground mt-1">Budget Codes & Allocation</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="font-medium text-foreground">View SKPD Information</p>
                    <p className="text-sm text-muted-foreground mt-1">Organization details</p>
                  </div>
                </>
              )}
              {profile?.role === "verifikator" && (
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="font-medium text-foreground">View & Verify Data</p>
                  <p className="text-sm text-muted-foreground mt-1">Data verification tools</p>
                </div>
              )}
              {profile?.role === "operator" && (
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="font-medium text-foreground">View System Information</p>
                  <p className="text-sm text-muted-foreground mt-1">Read-only access</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

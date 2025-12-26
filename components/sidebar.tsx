"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, BarChart3, Users, LogOut } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()

  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["operator", "bendahara", "verifikator", "ppk"],
    },
    { href: "/dashboard/skpd", label: "SKPD", icon: FileText, roles: ["ppk"] },
    { href: "/dashboard/kodefikasi", label: "Kodefikasi", icon: BarChart3, roles: ["bendahara", "ppk"] },
    { href: "/dashboard/akun", label: "Akun", icon: Users, roles: ["ppk"] },
  ]

  const visibleItems = menuItems.filter((item) => profile && item.roles.includes(profile.role))

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center font-bold text-lg">
            A
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">Accounting</h1>
            <p className="text-xs text-sidebar-foreground/60">Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/20",
                  pathname === item.href &&
                    "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary",
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-4">
        <div className="p-3 bg-sidebar-accent/10 rounded-lg">
          <p className="text-sm font-semibold text-sidebar-foreground">{profile?.nama_lengkap}</p>
          <p className="text-xs text-sidebar-foreground/60 truncate">{profile?.email}</p>
          <p className="text-xs text-sidebar-primary font-medium mt-1 uppercase">{profile?.role}</p>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full bg-transparent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/20 gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}

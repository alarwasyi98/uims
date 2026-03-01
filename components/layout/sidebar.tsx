"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserPlus,
  BookOpen,
  CreditCard,
  Wallet,
  Settings,
  Menu,
  X,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useAppContext } from "@/lib/context/app-context";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  {
    group: "UTAMA",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["Kepala Sekolah", "Staf Keuangan", "Guru"] },
      { name: "Kalender Kegiatan", href: "/kalender", icon: CalendarDays, roles: ["Kepala Sekolah", "Staf Keuangan", "Guru"] },
    ]
  },
  {
    group: "MANAJEMEN SISWA",
    items: [
      { name: "Data Siswa", href: "/siswa", icon: Users, roles: ["Kepala Sekolah", "Staf Keuangan", "Guru"] },
      { name: "Tahun Ajaran", href: "/tahun-ajaran", icon: BookOpen, roles: ["Kepala Sekolah"] },
      { name: "PPDB", href: "/ppdb", icon: UserPlus, roles: ["Kepala Sekolah"] },
    ]
  },
  {
    group: "MANAJEMEN GURU",
    items: [
      { name: "Data Guru", href: "/guru", icon: GraduationCap, roles: ["Kepala Sekolah", "Guru"] },
    ]
  },
  {
    group: "KEUANGAN",
    items: [
      { name: "Manajemen SPP", href: "/spp", icon: CreditCard, roles: ["Kepala Sekolah", "Staf Keuangan"] },
      { name: "Pencatatan Keuangan", href: "/keuangan", icon: Wallet, roles: ["Kepala Sekolah", "Staf Keuangan"] },
    ]
  },
  {
    group: "PENGATURAN",
    items: [
      { name: "Manajemen User", href: "/users", icon: Settings, roles: ["Kepala Sekolah"] },
    ]
  }
];

export function Sidebar({ 
  open, 
  setOpen,
  collapsed,
  setCollapsed
}: { 
  open: boolean; 
  setOpen: (open: boolean) => void;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}) {
  const pathname = usePathname();
  const { currentUser, activeUnit, setActiveUnit, units } = useAppContext();

  if (!currentUser || !activeUnit) return null;

  const accessibleUnits = units.filter(u => currentUser.unit_access_ids.includes(u.id));

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 lg:hidden" 
          onClick={() => setOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out lg:static lg:inset-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Collapse Toggle */}
        {setCollapsed && (
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex absolute -right-3 top-6 h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground shadow-sm z-50"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}

        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-sidebar-border">
          {/* Unit Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(
              "flex items-center gap-2 rounded-md hover:bg-sidebar-accent text-sm font-medium text-sidebar-foreground focus:outline-none transition-all border border-sidebar-border",
              collapsed ? "p-2 justify-center w-full" : "px-3 py-2 w-full justify-between"
            )}>
              {collapsed ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground font-bold">
                  {activeUnit.nama.charAt(0)}
                </div>
              ) : (
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground font-bold">
                    {activeUnit.nama.charAt(0)}
                  </div>
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="text-xs text-sidebar-foreground/70 font-normal">Unit Aktif</span>
                    <span className="truncate max-w-[120px]">{activeUnit.nama}</span>
                  </div>
                </div>
              )}
              {!collapsed && <ChevronDown className="h-4 w-4 text-sidebar-foreground/50 shrink-0" />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Pilih Unit Sekolah</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {accessibleUnits.map(unit => (
                <DropdownMenuItem 
                  key={unit.id} 
                  onClick={() => setActiveUnit(unit)}
                  className={activeUnit.id === unit.id ? "bg-muted font-medium" : ""}
                >
                  {unit.nama}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button onClick={() => setOpen(false)} className="lg:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground ml-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto pt-4 pb-4">
          <nav className={cn("flex-1 space-y-6", collapsed ? "px-2" : "px-4")}>
            {navigation.map((group) => {
              // Filter items based on user role
              const visibleItems = group.items.filter(item => item.roles.includes(currentUser.role));
              
              if (visibleItems.length === 0) return null;

              return (
                <div key={group.group}>
                  {!collapsed && (
                    <div className="px-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
                      {group.group}
                    </div>
                  )}
                  <ul className="space-y-1">
                    {visibleItems.map((item) => {
                      const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            title={collapsed ? item.name : undefined}
                            className={cn(
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors",
                              isActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                              collapsed ? "justify-center" : ""
                            )}
                          >
                            <item.icon
                              className={cn(
                                "h-5 w-5 shrink-0",
                                isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                              )}
                              aria-hidden="true"
                            />
                            {!collapsed && <span>{item.name}</span>}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

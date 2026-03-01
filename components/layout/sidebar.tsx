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
  Building2
} from "lucide-react";
import { useAppContext } from "@/lib/context/app-context";
import { useState } from "react";

const navigation = [
  {
    group: "UTAMA",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["Kepala Sekolah", "Staf Keuangan", "Guru"] },
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

export function Sidebar({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const pathname = usePathname();
  const { currentUser } = useAppContext();

  if (!currentUser) return null;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/80 lg:hidden" 
          onClick={() => setOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6 bg-slate-950">
          <div className="flex items-center gap-2 font-bold text-white text-lg tracking-tight">
            <Building2 className="h-6 w-6 text-blue-500" />
            <span>UI-MS</span>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto pt-4 pb-4">
          <nav className="flex-1 space-y-6 px-4">
            {navigation.map((group) => {
              // Filter items based on user role
              const visibleItems = group.items.filter(item => item.roles.includes(currentUser.role));
              
              if (visibleItems.length === 0) return null;

              return (
                <div key={group.group}>
                  <div className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    {group.group}
                  </div>
                  <ul className="space-y-1">
                    {visibleItems.map((item) => {
                      const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={cn(
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors",
                              isActive
                                ? "bg-slate-800 text-white border-l-2 border-blue-500"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            )}
                          >
                            <item.icon
                              className={cn(
                                "h-5 w-5 shrink-0",
                                isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-300"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
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

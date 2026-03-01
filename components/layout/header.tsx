"use client";

import { Menu, Bell, ChevronDown } from "lucide-react";
import { useAppContext } from "@/lib/context/app-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header({ setSidebarOpen }: { setSidebarOpen: (open: boolean) => void }) {
  const { activeUnit, setActiveUnit, units, currentUser, setCurrentUser, users } = useAppContext();

  if (!currentUser || !activeUnit) return null;

  // Filter units based on user access
  const accessibleUnits = units.filter(u => currentUser.unit_access_ids.includes(u.id));

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          {/* Unit Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 text-sm font-medium text-slate-900 focus:outline-none">
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500 font-normal">Unit Aktif</span>
                <span>{activeUnit.nama}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Pilih Unit Sekolah</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {accessibleUnits.map(unit => (
                <DropdownMenuItem 
                  key={unit.id} 
                  onClick={() => setActiveUnit(unit)}
                  className={activeUnit.id === unit.id ? "bg-slate-100 font-medium" : ""}
                >
                  {unit.nama}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-x-3 p-1.5 focus:outline-none hover:bg-gray-50 rounded-md">
              <span className="sr-only">Open user menu</span>
              <Avatar className="h-8 w-8 bg-blue-100 text-blue-700">
                <AvatarFallback>{currentUser.nama.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="hidden lg:flex lg:flex-col lg:items-start">
                <span className="text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                  {currentUser.nama}
                </span>
                <span className="text-xs leading-4 text-gray-500">{currentUser.role}</span>
              </span>
              <ChevronDown className="hidden lg:block h-4 w-4 text-gray-500" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Simulate Login As</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {users.map(user => (
                <DropdownMenuItem 
                  key={user.id} 
                  onClick={() => setCurrentUser(user)}
                  className={currentUser.id === user.id ? "bg-slate-100 font-medium" : ""}
                >
                  {user.nama} ({user.role})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

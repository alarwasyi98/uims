"use client";

import { Menu, Bell, ChevronDown, ChevronRight } from "lucide-react";
import { useAppContext } from "@/lib/context/app-context";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const routeNames: Record<string, string> = {
  'kalender': 'Kalender Kegiatan',
  'siswa': 'Data Siswa',
  'tahun-ajaran': 'Tahun Ajaran',
  'ppdb': 'PPDB',
  'guru': 'Data Guru',
  'spp': 'Manajemen SPP',
  'keuangan': 'Pencatatan Keuangan',
  'users': 'Manajemen User'
};

export function Header({ setSidebarOpen }: { setSidebarOpen: (open: boolean) => void }) {
  const { currentUser, setCurrentUser, users } = useAppContext();
  const pathname = usePathname();

  if (!currentUser) return null;

  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-card px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-muted-foreground lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          {/* Breadcrumb */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-2">
              <li>
                <div className="flex items-center">
                  <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                    Dashboard
                  </Link>
                </div>
              </li>
              {pathSegments.map((segment, index) => {
                const isLast = index === pathSegments.length - 1;
                const name = routeNames[segment] || segment;
                const href = `/${pathSegments.slice(0, index + 1).join('/')}`;

                return (
                  <li key={segment}>
                    <div className="flex items-center">
                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
                      <Link
                        href={href}
                        className={`ml-2 text-sm font-medium ${isLast ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        aria-current={isLast ? 'page' : undefined}
                      >
                        {name}
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-x-3 p-1.5 focus:outline-none hover:bg-muted rounded-md">
              <span className="sr-only">Open user menu</span>
              <Avatar className="h-8 w-8 bg-primary/10 text-primary">
                <AvatarFallback>{currentUser.nama.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="hidden lg:flex lg:flex-col lg:items-start">
                <span className="text-sm font-semibold leading-6 text-foreground" aria-hidden="true">
                  {currentUser.nama}
                </span>
                <span className="text-xs leading-4 text-muted-foreground">{currentUser.role}</span>
              </span>
              <ChevronDown className="hidden lg:block h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Simulate Login As</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {users.map(user => (
                <DropdownMenuItem 
                  key={user.id} 
                  onClick={() => setCurrentUser(user)}
                  className={currentUser.id === user.id ? "bg-muted font-medium" : ""}
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

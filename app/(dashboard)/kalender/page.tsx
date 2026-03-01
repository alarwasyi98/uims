"use client";

import { useState } from "react";
import { useAppContext } from "@/lib/context/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, Filter, MoreHorizontal, Clock, CheckCircle2, XCircle, CalendarDays, RefreshCw } from "lucide-react";
import eventsData from "@/lib/dummy-data/events.json";
import { motion } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, isToday } from "date-fns";
import { id } from "date-fns/locale";

export default function KalenderPage() {
  const { activeUnit, currentUser } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date("2026-03-01"));
  const [statusFilter, setStatusFilter] = useState("semua");
  const [isSyncing, setIsSyncing] = useState(false);

  if (!activeUnit || !currentUser) return null;

  // Filter events
  const filteredEvents = eventsData.filter(e => {
    const matchesUnit = e.unit_sekolah_id === activeUnit.id;
    const matchesStatus = statusFilter === "semua" || e.type === statusFilter;
    return matchesUnit && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Selesai":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
            <CheckCircle2 className="h-3 w-3" /> Selesai
          </span>
        );
      case "Berlangsung":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700">
            <Clock className="h-3 w-3" /> Berlangsung
          </span>
        );
      case "Direncanakan":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-700">
            <CalendarDays className="h-3 w-3" /> Direncanakan
          </span>
        );
      case "Dibatalkan":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700">
            <XCircle className="h-3 w-3" /> Dibatalkan
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai": return "bg-slate-500";
      case "Berlangsung": return "bg-blue-500";
      case "Direncanakan": return "bg-emerald-500";
      case "Dibatalkan": return "bg-red-500";
      default: return "bg-slate-500";
    }
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1500);
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = monthStart;
  const endDate = monthEnd;
  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  // Calculate padding days for the first row
  const startDayOfWeek = monthStart.getDay();
  const paddingDays = Array.from({ length: startDayOfWeek }).map((_, i) => i);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Kalender Kegiatan</h1>
          <p className="text-sm text-muted-foreground">Jadwal dan acara akademik untuk {activeUnit.nama}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSync}
            disabled={isSyncing}
            className="hidden sm:flex bg-background"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Menyinkronkan..." : "Sync Google Kalender"}
          </Button>
          {(currentUser.role === "Kepala Sekolah" || currentUser.role === "Guru") && (
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kegiatan
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader className="pb-4 border-b border-border flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <CardTitle className="text-lg font-semibold">
                  {format(currentDate, "MMMM yyyy", { locale: id })}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={prevMonth}>Sebelumnya</Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date("2026-03-01"))}>Hari Ini</Button>
                <Button variant="outline" size="sm" onClick={nextMonth}>Selanjutnya</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-7 border-b border-border bg-muted/50">
                {weekDays.map(day => (
                  <div key={day} className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 auto-rows-[120px]">
                {paddingDays.map(i => (
                  <div key={`pad-${i}`} className="border-b border-r border-border bg-muted/30 p-2" />
                ))}
                
                {days.map((day, i) => {
                  const dayEvents = filteredEvents.filter(e => isSameDay(parseISO(e.date), day));
                  const isCurrentMonth = isSameMonth(day, monthStart);
                  const isTodayDate = isToday(day);

                  return (
                    <div 
                      key={day.toString()} 
                      className={`border-b border-r border-border p-2 overflow-y-auto ${!isCurrentMonth ? "bg-muted/50 text-muted-foreground" : "bg-background"}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full ${
                          isTodayDate ? "bg-primary text-primary-foreground" : "text-foreground"
                        }`}>
                          {format(day, dateFormat)}
                        </span>
                      </div>
                      <div className="mt-1 space-y-1">
                        {dayEvents.map(event => (
                          <div 
                            key={event.id} 
                            className="text-xs p-1 rounded bg-muted border border-border truncate cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors group relative"
                            title={event.title}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusColor(event.type)}`} />
                              <span className="font-medium truncate">{event.time}</span>
                              <span className="truncate">{event.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Filter Kegiatan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-md border border-input bg-background pl-3 pr-8 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="semua">Semua Status</option>
                    <option value="Direncanakan">Direncanakan</option>
                    <option value="Berlangsung">Berlangsung</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                  <Filter className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Kegiatan Mendatang</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents
                  .filter(e => e.type === "Direncanakan" || e.type === "Berlangsung")
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map(event => (
                    <div key={event.id} className="flex flex-col gap-1 pb-3 border-b border-border last:border-0 last:pb-0">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-foreground leading-tight">{event.title}</p>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {format(parseISO(event.date), "dd MMM yyyy", { locale: id })} • {event.time}
                        </div>
                      </div>
                      <div className="mt-1">
                        {getStatusBadge(event.type)}
                      </div>
                    </div>
                  ))}
                {filteredEvents.filter(e => e.type === "Direncanakan" || e.type === "Berlangsung").length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    Tidak ada kegiatan mendatang.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

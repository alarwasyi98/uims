"use client";

import { useAppContext } from "@/lib/context/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, UserCheck, GraduationCap, UserPlus, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import studentsData from "@/lib/dummy-data/students.json";
import sppData from "@/lib/dummy-data/spp_records.json";
import teachersData from "@/lib/dummy-data/teachers.json";
import ppdbData from "@/lib/dummy-data/ppdb.json";
import { motion } from "motion/react";

const sppTrendData = [
  { name: "Agu", total: 12000000 },
  { name: "Sep", total: 15000000 },
  { name: "Okt", total: 14500000 },
  { name: "Nov", total: 18000000 },
  { name: "Des", total: 16000000 },
  { name: "Jan", total: 21000000 },
];

const studentsPerUnitData = [
  { name: "MI", total: 120 },
  { name: "MTs", total: 250 },
  { name: "MA", total: 180 },
];

export default function DashboardPage() {
  const { activeUnit, currentUser } = useAppContext();

  if (!activeUnit || !currentUser) return null;

  // Calculate metrics based on active unit
  const activeStudents = studentsData.filter(s => s.unit_sekolah_id === activeUnit.id && s.status === "aktif").length;
  const activeTeachers = teachersData.filter(t => t.unit_sekolah_id === activeUnit.id && t.status === "aktif").length;
  const activePpdb = ppdbData.filter(p => p.unit_sekolah_id === activeUnit.id && p.status === "Menunggu Verifikasi").length;
  
  // SPP metrics
  const currentMonthSpp = sppData.filter(s => {
    const student = studentsData.find(st => st.id === s.siswa_id);
    return student?.unit_sekolah_id === activeUnit.id && s.bulan === "Januari" && s.tahun === 2025;
  });
  
  const totalSppIncome = currentMonthSpp.reduce((acc, curr) => acc + curr.nominal_bayar, 0);
  const totalTunggakan = currentMonthSpp.reduce((acc, curr) => acc + (curr.nominal_tagihan - curr.nominal_bayar), 0);
  const tunggakanCount = currentMonthSpp.filter(s => s.status === "tunggakan" || s.status === "sebagian").length;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Ringkasan data untuk {activeUnit.nama}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Siswa Aktif</p>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{activeStudents}</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">+2% dari bulan lalu</p>
          </CardContent>
        </Card>
        
        <Card className="xl:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Pemasukan SPP (Januari)</p>
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{formatRupiah(totalSppIncome)}</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">+15% dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Kehadiran</p>
              <UserCheck className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">96.5%</div>
            <p className="text-xs text-muted-foreground mt-1">Rata-rata bulan ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Guru Aktif</p>
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{activeTeachers}</div>
            <p className="text-xs text-muted-foreground mt-1">Total pengajar</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">PPDB Aktif</p>
              <UserPlus className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{activePpdb}</div>
            <p className="text-xs text-muted-foreground mt-1">Menunggu verifikasi</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Tunggakan */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Tren Penerimaan SPP (6 Bulan)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sppTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `Rp${value / 1000000}M`}
                    dx={-10}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatRupiah(value), "Pemasukan"]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="total" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--color-primary)', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Ringkasan Tunggakan SPP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/10 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-destructive/20 p-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-medium text-destructive">Total Tunggakan</p>
                  <p className="text-2xl font-bold text-destructive">{formatRupiah(totalTunggakan)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-destructive">{tunggakanCount} Siswa</p>
                <p className="text-xs text-destructive/80">Belum lunas</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">5 Tunggakan Terbesar</h4>
              <div className="space-y-3">
                {currentMonthSpp
                  .filter(s => s.status !== "lunas")
                  .sort((a, b) => (b.nominal_tagihan - b.nominal_bayar) - (a.nominal_tagihan - a.nominal_bayar))
                  .slice(0, 5)
                  .map((spp, i) => {
                    const student = studentsData.find(s => s.id === spp.siswa_id);
                    const tunggakan = spp.nominal_tagihan - spp.nominal_bayar;
                    return (
                      <div key={i} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium text-foreground">{student?.nama_lengkap}</p>
                          <p className="text-xs text-muted-foreground">{student?.kelas}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-destructive">{formatRupiah(tunggakan)}</p>
                          <p className="text-xs text-muted-foreground">1 Bulan</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

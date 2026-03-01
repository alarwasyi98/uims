"use client";

import { useState } from "react";
import { useAppContext } from "@/lib/context/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, MoreHorizontal, Download, Edit, Trash2, CheckCircle2, AlertCircle, Clock, CreditCard } from "lucide-react";
import sppData from "@/lib/dummy-data/spp_records.json";
import studentsData from "@/lib/dummy-data/students.json";
import { motion } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SppPage() {
  const { activeUnit, currentUser } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");

  if (!activeUnit || !currentUser) return null;

  // Combine SPP data with student data
  const sppWithStudents = sppData.map(spp => {
    const student = studentsData.find(s => s.id === spp.siswa_id);
    return { ...spp, student };
  }).filter(spp => spp.student?.unit_sekolah_id === activeUnit.id);

  // Filter SPP records
  const filteredSpp = sppWithStudents.filter(spp => {
    const matchesSearch = spp.student?.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          spp.student?.nis.includes(searchTerm);
    const matchesStatus = statusFilter === "semua" || spp.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "lunas":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="h-3 w-3" /> Lunas
          </span>
        );
      case "tunggakan":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3" /> Tunggakan
          </span>
        );
      case "sebagian":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Clock className="h-3 w-3" /> Sebagian
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Manajemen SPP</h1>
          <p className="text-sm text-muted-foreground">Kelola pembayaran SPP untuk {activeUnit.nama}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="mr-2 h-4 w-4" />
            Laporan
          </Button>
          {(currentUser.role === "Kepala Sekolah" || currentUser.role === "Staf Keuangan") && (
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Catat Pembayaran
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari nama siswa atau NIS..."
                className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  className="appearance-none rounded-md border border-input bg-background pl-3 pr-8 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="semua">Semua Status</option>
                  <option value="lunas">Lunas</option>
                  <option value="tunggakan">Tunggakan</option>
                  <option value="sebagian">Sebagian</option>
                </select>
                <Filter className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium">Siswa</th>
                  <th className="px-4 py-3 font-medium">Bulan/Tahun</th>
                  <th className="px-4 py-3 font-medium">Tagihan</th>
                  <th className="px-4 py-3 font-medium">Dibayar</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSpp.length > 0 ? (
                  filteredSpp.map((spp) => (
                    <tr key={spp.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{spp.student?.nama_lengkap}</div>
                        <div className="text-xs text-muted-foreground font-mono">{spp.student?.nis} • {spp.student?.kelas}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{spp.bulan} {spp.tahun}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{formatRupiah(spp.nominal_tagihan)}</td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {spp.nominal_bayar > 0 ? formatRupiah(spp.nominal_bayar) : "-"}
                        {spp.tanggal_bayar && <div className="text-xs text-muted-foreground font-normal">{spp.tanggal_bayar}</div>}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(spp.status)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                            {spp.status !== "lunas" && (
                              <DropdownMenuItem className="text-primary">
                                <Edit className="mr-2 h-4 w-4" /> Catat Pembayaran
                              </DropdownMenuItem>
                            )}
                            {spp.status !== "tunggakan" && (
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" /> Cetak Kuitansi
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <CreditCard className="h-8 w-8 text-muted mb-2" />
                        <p>Tidak ada data SPP yang ditemukan.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <div>Menampilkan {filteredSpp.length} data</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Sebelumnya</Button>
              <Button variant="outline" size="sm" disabled>Selanjutnya</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

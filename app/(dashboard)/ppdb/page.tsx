"use client";

import { useState } from "react";
import { useAppContext } from "@/lib/context/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, MoreHorizontal, CheckCircle2, XCircle, Clock, UserPlus } from "lucide-react";
import ppdbData from "@/lib/dummy-data/ppdb.json";
import { motion } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PpdbPage() {
  const { activeUnit, currentUser } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");

  if (!activeUnit || !currentUser) return null;

  // Filter PPDB records
  const filteredPpdb = ppdbData.filter(p => {
    const matchesUnit = p.unit_sekolah_id === activeUnit.id;
    const matchesSearch = p.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.asal_sekolah.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "semua" || p.status === statusFilter;
    
    return matchesUnit && matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Diterima":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="h-3 w-3" /> Diterima
          </span>
        );
      case "Ditolak":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3" /> Ditolak
          </span>
        );
      case "Menunggu Verifikasi":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Clock className="h-3 w-3" /> Menunggu Verifikasi
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Penerimaan Peserta Didik Baru (PPDB)</h1>
          <p className="text-sm text-slate-500">Kelola pendaftaran siswa baru untuk {activeUnit.nama}</p>
        </div>
        <div className="flex items-center gap-2">
          {currentUser.role === "Kepala Sekolah" && (
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pendaftar
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-slate-500">Total Pendaftar</p>
              <UserPlus className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {ppdbData.filter(p => p.unit_sekolah_id === activeUnit.id).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-slate-500">Menunggu</p>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {ppdbData.filter(p => p.unit_sekolah_id === activeUnit.id && p.status === "Menunggu Verifikasi").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-slate-500">Diterima</p>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {ppdbData.filter(p => p.unit_sekolah_id === activeUnit.id && p.status === "Diterima").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-slate-500">Ditolak</p>
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {ppdbData.filter(p => p.unit_sekolah_id === activeUnit.id && p.status === "Ditolak").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama pendaftar atau asal sekolah..."
                className="w-full rounded-md border border-slate-200 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  className="appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-8 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="semua">Semua Status</option>
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                  <option value="Diterima">Diterima</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
                <Filter className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Nama Pendaftar</th>
                  <th className="px-4 py-3 font-medium">Asal Sekolah</th>
                  <th className="px-4 py-3 font-medium">Nama Wali</th>
                  <th className="px-4 py-3 font-medium">Tanggal Daftar</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPpdb.length > 0 ? (
                  filteredPpdb.map((p) => (
                    <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900">{p.nama_lengkap}</td>
                      <td className="px-4 py-3 text-slate-600">{p.asal_sekolah}</td>
                      <td className="px-4 py-3">
                        <div className="text-slate-900">{p.nama_wali}</div>
                        <div className="text-xs text-slate-500">{p.no_hp_wali}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(p.tanggal_daftar)}</td>
                      <td className="px-4 py-3">
                        {getStatusBadge(p.status)}
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
                            <DropdownMenuItem>Lihat Berkas</DropdownMenuItem>
                            {p.status === "Menunggu Verifikasi" && currentUser.role === "Kepala Sekolah" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-emerald-600 font-medium">
                                  <CheckCircle2 className="mr-2 h-4 w-4" /> Terima
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600 font-medium">
                                  <XCircle className="mr-2 h-4 w-4" /> Tolak
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <UserPlus className="h-8 w-8 text-slate-300 mb-2" />
                        <p>Tidak ada data pendaftar yang ditemukan.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
            <div>Menampilkan {filteredPpdb.length} pendaftar</div>
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

"use client";

import { useState } from "react";
import { useAppContext } from "@/lib/context/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, MoreHorizontal, Download, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import transactionsData from "@/lib/dummy-data/transactions.json";
import { motion } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function KeuanganPage() {
  const { activeUnit, currentUser } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("semua");

  if (!activeUnit || !currentUser) return null;

  // Filter transactions
  const filteredTransactions = transactionsData.filter(trx => {
    const matchesUnit = trx.unit_sekolah_id === activeUnit.id;
    const matchesSearch = trx.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          trx.kategori.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "semua" || trx.tipe === typeFilter;
    
    return matchesUnit && matchesSearch && matchesType;
  });

  // Calculate summaries
  const unitTransactions = transactionsData.filter(trx => trx.unit_sekolah_id === activeUnit.id);
  const totalPemasukan = unitTransactions.filter(t => t.tipe === "pemasukan").reduce((acc, curr) => acc + curr.nominal, 0);
  const totalPengeluaran = unitTransactions.filter(t => t.tipe === "pengeluaran").reduce((acc, curr) => acc + curr.nominal, 0);
  const saldo = totalPemasukan - totalPengeluaran;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pencatatan Keuangan</h1>
          <p className="text-sm text-slate-500">Kelola arus kas operasional untuk {activeUnit.nama}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="mr-2 h-4 w-4" />
            Laporan
          </Button>
          {(currentUser.role === "Kepala Sekolah" || currentUser.role === "Staf Keuangan") && (
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Transaksi
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-slate-500">Total Pemasukan</p>
              <div className="rounded-full bg-emerald-100 p-1">
                <ArrowUpRight className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{formatRupiah(totalPemasukan)}</div>
            <p className="text-xs text-slate-500 mt-1">Bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-slate-500">Total Pengeluaran</p>
              <div className="rounded-full bg-red-100 p-1">
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{formatRupiah(totalPengeluaran)}</div>
            <p className="text-xs text-slate-500 mt-1">Bulan ini</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-slate-400">Saldo Bersih</p>
              <Wallet className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{formatRupiah(saldo)}</div>
            <p className="text-xs text-slate-400 mt-1">Posisi kas saat ini</p>
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
                placeholder="Cari deskripsi atau kategori..."
                className="w-full rounded-md border border-slate-200 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  className="appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-8 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="semua">Semua Tipe</option>
                  <option value="pemasukan">Pemasukan</option>
                  <option value="pengeluaran">Pengeluaran</option>
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
                  <th className="px-4 py-3 font-medium">Tanggal</th>
                  <th className="px-4 py-3 font-medium">Kategori</th>
                  <th className="px-4 py-3 font-medium">Deskripsi</th>
                  <th className="px-4 py-3 font-medium">Tipe</th>
                  <th className="px-4 py-3 font-medium text-right">Nominal</th>
                  <th className="px-4 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()).map((trx) => (
                    <tr key={trx.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-slate-600">{formatDate(trx.tanggal)}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                          {trx.kategori}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{trx.deskripsi}</td>
                      <td className="px-4 py-3">
                        {trx.tipe === "pemasukan" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                            <ArrowUpRight className="h-3 w-3" /> Pemasukan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                            <ArrowDownRight className="h-3 w-3" /> Pengeluaran
                          </span>
                        )}
                      </td>
                      <td className={`px-4 py-3 font-medium text-right ${trx.tipe === 'pemasukan' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {trx.tipe === 'pemasukan' ? '+' : '-'}{formatRupiah(trx.nominal)}
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
                            <DropdownMenuItem>Unduh Bukti</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <Wallet className="h-8 w-8 text-slate-300 mb-2" />
                        <p>Tidak ada transaksi yang ditemukan.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
            <div>Menampilkan {filteredTransactions.length} transaksi</div>
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

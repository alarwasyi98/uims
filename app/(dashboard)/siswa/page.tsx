"use client";

import { useState } from "react";
import { useAppContext } from "@/lib/context/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, MoreHorizontal, Download, Edit, Trash2, Users } from "lucide-react";
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

export default function DataSiswaPage() {
  const { activeUnit, currentUser } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");

  if (!activeUnit || !currentUser) return null;

  // Filter students based on active unit, search term, and status
  const filteredStudents = studentsData.filter(student => {
    const matchesUnit = student.unit_sekolah_id === activeUnit.id;
    const matchesSearch = student.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.nis.includes(searchTerm);
    const matchesStatus = statusFilter === "semua" || student.status === statusFilter;
    
    return matchesUnit && matchesSearch && matchesStatus;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Data Siswa</h1>
          <p className="text-sm text-muted-foreground">Kelola data siswa untuk {activeUnit.nama}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          {currentUser.role === "Kepala Sekolah" && (
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Siswa
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
                placeholder="Cari nama atau NIS..."
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
                  <option value="aktif">Aktif</option>
                  <option value="alumni">Alumni</option>
                  <option value="keluar">Keluar</option>
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
                  <th className="px-4 py-3 font-medium">NIS</th>
                  <th className="px-4 py-3 font-medium">Nama Lengkap</th>
                  <th className="px-4 py-3 font-medium">Kelas</th>
                  <th className="px-4 py-3 font-medium">Tahun Masuk</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-muted-foreground">{student.nis}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{student.nama_lengkap}</td>
                      <td className="px-4 py-3 text-muted-foreground">{student.kelas}</td>
                      <td className="px-4 py-3 text-muted-foreground">{student.tahun_masuk}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          student.status === 'aktif' ? 'bg-emerald-100 text-emerald-800' :
                          student.status === 'alumni' ? 'bg-blue-100 text-blue-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </span>
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
                            <DropdownMenuItem>Lihat Profil</DropdownMenuItem>
                            {currentUser.role === "Kepala Sekolah" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-primary">
                                  <Edit className="mr-2 h-4 w-4" /> Edit Data
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" /> Hapus
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
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="h-8 w-8 text-muted mb-2" />
                        <p>Tidak ada data siswa yang ditemukan.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <div>Menampilkan {filteredStudents.length} siswa</div>
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

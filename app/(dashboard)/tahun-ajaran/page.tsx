"use client";

import { useAppContext } from "@/lib/context/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, CheckCircle2, Calendar, Edit, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const tahunAjaranData = [
  { id: "TA-001", nama: "2024/2025", semester: "Genap", mulai: "2025-01-06", selesai: "2025-06-20", aktif: true },
  { id: "TA-002", nama: "2024/2025", semester: "Ganjil", mulai: "2024-07-15", selesai: "2024-12-20", aktif: false },
  { id: "TA-003", nama: "2023/2024", semester: "Genap", mulai: "2024-01-08", selesai: "2024-06-21", aktif: false },
  { id: "TA-004", nama: "2023/2024", semester: "Ganjil", mulai: "2023-07-17", selesai: "2023-12-22", aktif: false },
];

export default function TahunAjaranPage() {
  const { activeUnit, currentUser } = useAppContext();

  if (!activeUnit || !currentUser) return null;

  if (currentUser.role !== "Kepala Sekolah") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Calendar className="h-16 w-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Akses Ditolak</h2>
        <p className="text-slate-500 max-w-md">
          Anda tidak memiliki izin untuk mengakses halaman Tahun Ajaran.
        </p>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tahun Ajaran</h1>
          <p className="text-sm text-slate-500">Kelola periode akademik untuk {activeUnit.nama}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Tahun Ajaran
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Tahun Ajaran</th>
                  <th className="px-6 py-4 font-medium">Semester</th>
                  <th className="px-6 py-4 font-medium">Periode</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tahunAjaranData.map((ta) => (
                  <tr key={ta.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{ta.nama}</td>
                    <td className="px-6 py-4 text-slate-600">{ta.semester}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(ta.mulai)} - {formatDate(ta.selesai)}
                    </td>
                    <td className="px-6 py-4">
                      {ta.aktif ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="h-3 w-3" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          Selesai
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          {!ta.aktif && (
                            <DropdownMenuItem className="text-emerald-600 font-medium">
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Set Sebagai Aktif
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-blue-600">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

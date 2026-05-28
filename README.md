# 📌 Sistem Informasi PKL / Prakerin Malang

## 🧾 Deskripsi Project

Sistem ini merupakan backend API untuk pengelolaan **pengajuan PKL/Prakerin siswa SMK di wilayah Malang**.
Aplikasi ini membantu siswa dalam mencari perusahaan tempat PKL, mengajukan permohonan, serta mengunggah dokumen pendukung seperti CV, portfolio, dan transkrip nilai.

Di sisi lain, admin (perusahaan atau pihak sekolah) dapat melakukan verifikasi pengajuan, menerima atau menolak permohonan, serta mengelola data perusahaan yang tersedia.

---

## 🚀 Tech Stack

* NestJS (TypeScript)
* Prisma ORM
* MySQL (XAMPP)
* JWT Authentication
* Multer (File Upload)
* Swagger (API Documentation)

---

## 🏗️ Fitur Utama

### 🔐 Authentication

* Register user (Siswa/Admin)
* Login menggunakan JWT
* Role-based access control (RBAC)

---

### 🏢 Manajemen Company (Tempat PKL)

* Tambah data perusahaan
* Lihat semua perusahaan
* Detail perusahaan
* Update data perusahaan
* Hapus perusahaan

---

### 📄 Pengajuan PKL (Applications)

* Siswa dapat mengajukan PKL ke perusahaan
* Upload dokumen:

  * CV
  * Portfolio
  * Transkrip nilai
* Status pengajuan:

  * `PENDING` (default saat diajukan)
  * `ACCEPTED` (diterima oleh admin)
  * `REJECTED` (ditolak admin)
  * `CANCELLED` (dibatalkan siswa)

---

### 🧑‍💼 Verifikasi Admin

* Melihat semua pengajuan siswa
* Melihat detail pengajuan (siswa + perusahaan + dokumen)
* Mengubah status pengajuan:

  * Terima (ACCEPTED)
  * Tolak (REJECTED)
* Menambahkan catatan (note) pada pengajuan

---

### 📁 Upload File

Sistem mendukung upload dokumen:

* CV (PDF)
* Portfolio (PDF/DOC)
* Transkrip Nilai

File disimpan di folder `/uploads` dan dapat diakses melalui URL publik.

---

### 📊 Response API Standard

Setiap endpoint sudah menggunakan format response yang konsisten:

```json
{
  "message": "Success message",
  "data": {},
  "total": 0
}
```

---

## 🔄 Flow Sistem

1. Siswa register & login
2. Siswa melihat daftar perusahaan PKL
3. Siswa mengajukan PKL + upload dokumen
4. Status otomatis `PENDING`
5. Admin mengecek pengajuan
6. Admin:

   * menerima (ACCEPTED)
   * menolak (REJECTED)
7. Sistem menyimpan riwayat pengajuan

---

## 📚 API Documentation

Swagger tersedia di:

```
http://localhost:3000/docs
```

---

## 🔐 Role System

| Role    | Akses                               |
| ------- | ----------------------------------- |
| STUDENT | Mengajukan PKL, upload dokumen      |
| ADMIN   | CRUD company + verifikasi pengajuan |

---

## 🎯 Tujuan Project

Project ini dibuat untuk memenuhi tugas UKL Semester Genap Rekayasa Perangkat Lunak dengan fokus pada:

* Backend architecture (NestJS modular)
* Database design (Prisma + MySQL)
* Authentication & Authorization
* File handling system
* Business logic transaction
* API documentation

---


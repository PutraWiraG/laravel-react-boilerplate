# Laravel + React Starter Kit

Starter kit fullstack modern yang menggabungkan backend REST API berbasis **Laravel 13** dan frontend SPA modern berbasis **React 19**, **TypeScript**, dan **Tailwind CSS v4**.

Dilengkapi dengan primary key **UUID**, standarisasi **Clean Architecture** (Controller, Service, FormRequest), dokumentasi API interaktif otomatis menggunakan **Scramble**, serta frontend dengan **Zero `any` TypeScript** dan antarmuka komponen **DataTable** yang responsif dan interaktif.

---

## 🚀 Tech Stack

### Backend (`be-laravel`)
- **Framework:** [Laravel 13.x](https://laravel.com/)
- **Bahasa:** PHP 8.3+ / 8.4+
- **Database & ORM:** MySQL dengan Eloquent ORM & UUID primary key (`HasUuids`)
- **Autentikasi Token:** [Laravel Sanctum](https://laravel.com/docs/sanctum) (`uuidMorphs`)
- **Dokumentasi API:** [Scramble](https://scramble.dedoc.co/) (OpenAPI 3.1 & Stoplight Elements UI tanpa anotasi PHPDoc rumit)
- **Response Helper:** Standarisasi JSON Response (`ApiResponse`) dengan dukungan `LengthAwarePaginator`

### Frontend (`fe-react`)
- **Library:** [React 19](https://react.dev/)
- **Bahasa:** [TypeScript 5+](https://www.typescriptlang.org/) (Strict Mode, 100% Zero `any`)
- **Build Tool:** [Vite 6+](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Data Table:** [@tanstack/react-table v8](https://tanstack.com/table/v8) (Server-side Pagination, Skeleton Loader, Keyboard Accessible)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 📁 Struktur Direktori

```text
laravel-react-starter/
├── README.md                           # Dokumentasi utama proyek
│
├── be-laravel/                         # BACKEND (Laravel 13 REST API)
│   ├── app/
│   │   ├── Helpers/
│   │   │   └── ApiResponse.php         # Standarisasi JSON response & pagination helper
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       ├── Controller.php      # Base Controller bawaan Laravel
│   │   │       ├── api/
│   │   │       │   ├── ApiController.php   # Base API controller dengan response wrapper
│   │   │       │   └── UserController.php  # API resource controller untuk users
│   │   │       └── Request/
│   │   │           └── User/           # Form Request validasi
│   │   │               ├── IndexUserRequest.php
│   │   │               ├── StoreUserRequest.php
│   │   │               └── UpdateUserRequest.php
│   │   ├── Models/
│   │   │   └── User.php                # Eloquent User model (menggunakan trait HasUuids)
│   │   ├── Providers/
│   │   │   └── AppServiceProvider.php  # Application service provider & Scramble gate
│   │   └── Services/
│   │       └── UserService.php         # Business logic layer (CRUD & search)
│   ├── config/
│   │   └── scramble.php                # Konfigurasi dokumentasi Scramble OpenAPI
│   ├── database/
│   │   ├── factories/                  # Model factory
│   │   ├── migrations/                 # Migrasi database (UUID id & uuidMorphs)
│   │   └── seeders/                    # Database seeder
│   ├── routes/
│   │   ├── api.php                     # Endpoint API (/api/users dengan constraint UUID)
│   │   └── web.php                     # Route web standar
│   ├── api.json                        # OpenAPI specification yang diekspor
│   └── composer.json                   # Dependensi PHP backend
│
└── fe-react/                           # FRONTEND (React 19 + TypeScript + Vite)
    ├── src/
    │   ├── assets/                     # Asset gambar dan icon statis
    │   ├── components/
    │   │   └── DataTable/
    │   │       ├── index.tsx           # Generic Accessible DataTable (Sticky, Skeleton)
    │   │       └── Pagination.tsx      # Komponen navigasi pagination & per-page dropdown
    │   ├── interfaces/
    │   │   └── user.interface.ts       # Definisi kontrak tipe TypeScript (UUID string)
    │   ├── lib/
    │   │   └── api.ts                  # Konfigurasi Axios instance & baseURL
    │   ├── pages/
    │   │   └── user/
    │   │       ├── _components/
    │   │       │   ├── DeleteConfirmModal.tsx  # Modal konfirmasi hapus data
    │   │       │   ├── UserModal.tsx           # Modal form Tambah & Edit Pengguna
    │   │       │   └── UserTable.tsx           # Definisi kolom tabel pengguna & copy UUID
    │   │       └── index.tsx           # Halaman utama manajemen pengguna
    │   ├── App.tsx                     # Shell aplikasi, top navigation bar, & link docs
    │   ├── index.css                   # Konfigurasi Tailwind CSS v4
    │   └── main.tsx                    # Entry point React DOM
    ├── package.json                    # Dependensi Node.js frontend
    ├── tsconfig.json                   # Konfigurasi TypeScript compiler
    └── vite.config.ts                  # Konfigurasi Vite & Tailwind plugin
```

---

## 🛠️ Prasyarat Sistem

Sebelum memulai instalasi, pastikan sistem Anda telah terpasang:
- **PHP** >= 8.3 dengan ekstensi PDO MySQL, cURL, OpenSSL, Mbstring
- **Composer** >= 2.x
- **Node.js** >= 20.x dan **npm** >= 10.x
- **MySQL Database Server** (misalnya via Laragon, XAMPP, atau Docker)

---

## 📦 Panduan Instalasi & Menjalankan

### 1. Setup Backend (`be-laravel`)

1. **Buka terminal dan masuk ke folder `be-laravel`:**
   ```bash
   cd be-laravel
   ```

2. **Salin file environment:**
   ```bash
   copy .env.example .env
   # Di Linux/macOS gunakan: cp .env.example .env
   ```

3. **Install dependensi Composer:**
   ```bash
   composer install
   ```

4. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```

5. **Sesuaikan konfigurasi database pada file `.env`:**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=admin
   DB_USERNAME=root
   DB_PASSWORD=
   ```
   *Pastikan database dengan nama yang ditentukan (contoh: `admin`) sudah dibuat di MySQL Anda.*

6. **Jalankan migrasi database dan seeder:**
   ```bash
   php artisan migrate:fresh --seed
   ```
   *Perintah ini akan membuat tabel users dengan kolom `id` bertipe UUID dan mengisi user awal untuk pengujian.*

7. **Jalankan server backend:**
   ```bash
   php artisan serve
   ```
   Backend akan berjalan di **`http://127.0.0.1:8000`**.

---

### 2. Setup Frontend (`fe-react`)

1. **Buka terminal baru dan masuk ke folder `fe-react`:**
   ```bash
   cd fe-react
   ```

2. **Install dependensi Node.js:**
   ```bash
   npm install
   ```

3. **Pastikan konfigurasi URL API pada file `.env` sesuai dengan port backend:**
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Jalankan server development frontend:**
   ```bash
   npm run dev
   ```
   Frontend akan berjalan di **`http://localhost:5173`** (atau port yang diberikan Vite).

5. **Untuk memverifikasi tipe TypeScript & build produksi:**
   ```bash
   npm run build
   ```

---

## 📖 Dokumentasi API (Scramble)

Backend telah dilengkapi dengan integrasi **Dedoc Scramble** yang menghasilkan dokumentasi OpenAPI secara otomatis tanpa perlu menulis anotasi PHPDoc manual.

Saat backend berjalan (`php artisan serve`), Anda dapat mengakses:
- **UI Dokumentasi Interaktif (Stoplight Elements):**  
  👉 [http://localhost:8000/docs/api](http://localhost:8000/docs/api)
- **OpenAPI 3.1 JSON Specification:**  
  👉 [http://localhost:8000/docs/api.json](http://localhost:8000/docs/api.json)

Untuk mengekspor spesifikasi OpenAPI ke file fisik `api.json`:
```bash
cd be-laravel
php artisan scramble:export
```

---

## ✨ Fitur-Fitur Utama

### 1. Primary Key Berbasis UUID
- Kolom `id` pada tabel `users` bertipe UUID v4 (`char(36)`).
- Menggunakan trait resmi Laravel `Illuminate\Database\Eloquent\Concerns\HasUuids`.
- Dukungan Sanctum token `uuidMorphs('tokenable')` pada tabel `personal_access_tokens`.
- Constraint route otomatis pada API: `Route::apiResource('users', UserController::class)->whereUuid('user');`.
- Frontend menyediakan tombol salin (*copy-to-clipboard*) instan dengan tampilan chip monospace.

### 2. Strict Type Safety (Zero `any`)
- Seluruh kode TypeScript pada frontend ditulis tanpa menggunakan kata kunci `any`.
- Menggunakan tipisasi resmi TanStack Table `TableOptions<TData>['columns']`.
- Integritas tipe request & response terdefinisi penuh pada interface.

### 3. Komponen DataTable Modern & Aksesibel
- **Aksesibilitas Sesuai Standar Modern:** Memiliki `tabIndex={0}`, `role="region"`, dan `aria-label` agar tabel dapat di-scroll secara navigasi keyboard.
- **Sticky Column Header:** Header tabel tetap berada di posisi atas saat data di-scroll vertikal.
- **Skeleton Loader:** Animasi bar pulsing saat proses pengambilan data berlangsung.
- **Empty State Elegan:** Tampilan visual saat data tidak ditemukan atau query pencarian kosong.
- **Navigasi Halaman Lengkap:** Navigasi tombol halaman pertama, sebelumnya, penomoran halaman aktif, berikutnya, dan halaman terakhir.

### 4. Manajemen CRUD Lengkap & Feedback Visual
- Tambah pengguna baru via modal pop-up dengan validasi client dan server.
- Edit pengguna secara instan tanpa reload halaman.
- Konfirmasi hapus data dengan modal konfirmasi protektif.
- Notifikasi *floating toast alert* yang otomatis hilang setelah beberapa detik.
- Pencarian data pengguna dengan tombol bersihkan (*clear button*) dan tombol segarkan (*refresh spin*).

---

## 📜 Lisensi
Proyek ini dilisensikan di bawah [MIT License](LICENSE).


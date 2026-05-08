# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Build APK (Android)

Untuk membuild project Expo/React Native menjadi file `.apk` (Android), ikuti langkah berikut:

1. **Install EAS CLI**  
   Jalankan di terminal:
   ```bash
   npm install -g eas-cli
   ```

2. **Login ke Expo**  
   Jika belum login:
   ```bash
   eas login
   ```

3. **Build APK (Development/Production)**
   - Untuk build APK development (bisa diinstall manual, cocok untuk testing):
     ```bash
     eas build -p android --profile development
     ```
   - Untuk build APK production (untuk rilis ke Play Store):
     ```bash
     eas build -p android --profile production
     ```<div align="center">

# 🚀 [Nama Project]

**[Tagline Powerful, misal: Build faster. Scale smarter. Automation for modern developers.]**

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg?style=flat-square)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)]()
[![Version](https://img.shields.io/badge/Version-1.0.0-lightgrey.svg?style=flat-square)]()

[Nama Project] adalah [Penjelasan singkat 1-2 kalimat. Misal: engine analitik berbasis AI yang dirancang untuk membantu startup memproses big data dalam hitungan detik, bukan jam]. 

Dibangun untuk menyelesaikan [Sebutkan problem utama yang diselesaikan], [Nama Project] memberikan Anda infrastruktur yang scalable tanpa kerumitan setup yang berlebihan.

[Link ke Website/Demo] · [Report Bug] · [Request Feature]

</div>

---

## ⚡ Preview

Pengalaman pengguna yang *frictionless* dari detik pertama.

Ketika Anda menjalankan [Nama Project], Anda akan langsung disajikan dengan dashboard analitik *real-time*. Workflow kami memangkas langkah manual: Anda cukup mengunggah data, dan sistem secara otomatis melakukan *cleaning, mapping,* dan memberikan *insight* yang siap digunakan.

> **[ 🖼️ Placeholder: Screenshot Dashboard Utama ]**
> *(Ganti dengan gambar UI Anda: `![Dashboard Overview](./assets/dashboard.png)`)*

> **[ 🎥 Placeholder: GIF Demo Workflow ]**
> *(Ganti dengan GIF interaksi produk Anda: `![Product Demo](./assets/demo.gif)`)*


---

## ✨ Features

Kami tidak hanya membangun fitur; kami merancang solusi untuk workflow modern.

- **[Nama Fitur 1, misal: ⚡ Real-time Sync]** — [Penjelasan: Data tersinkronisasi instan antar semua perangkat Anda.] **Benefit:** Tidak ada lagi *lag* atau data yang tidak konsisten saat kolaborasi tim.
- **[Nama Fitur 2, misal: 🤖 AI-Powered Insights]** — [Penjelasan: Machine learning model yang memprediksi tren berdasarkan data historis.] **Benefit:** Ambil keputusan bisnis lebih cepat dan akurat.
- **[Nama Fitur 3, misal: 🔒 Enterprise-Grade Security]** — [Penjelasan: Enkripsi end-to-end dan kepatuhan standar industri.] **Benefit:** Data pengguna Anda aman sejak hari pertama.
- **[Nama Fitur 4, misal: 🔌 Zero-Config Integrations]** — [Penjelasan: API yang siap terhubung dengan tools populer dalam hitungan menit.] **Benefit:** Fokus membangun produk, bukan memperbaiki koneksi API.


---

## 🛠 Tech Stack

Dibangun dengan fondasi teknologi modern, teruji, dan siap untuk *scale*.

* **Frontend:** [React / Next.js / React Native] — Dipilih karena ekosistem komponen yang kaya dan performa SSR yang luar biasa.
* **Styling:** [Tailwind CSS / Styled Components] — Untuk styling yang konsisten, *utility-first*, dan rendering yang sangat cepat.
* **Backend:** [Node.js / Laravel / Python] — Memberikan arsitektur yang solid, *non-blocking*, dan mudah di-*maintain*.
* **Database:** [PostgreSQL / MongoDB / Supabase] — Relasional yang kuat dengan dukungan JSON yang fleksibel untuk data yang dinamis.
* **Tools / Infra:** [Docker, GitHub Actions, Vercel/AWS] — Memastikan environment yang identik dari *development* hingga *production*.


---

## 🏗 Architecture

Arsitektur kami dirancang agar elegan dan mudah dipahami, memisahkan *logic* dari *presentation*.

1. **Client Layer (Frontend):** Pengguna berinteraksi dengan UI yang *responsive*. State global dikelola menggunakan [Redux/Zustand], memastikan UI selalu *up-to-date* dengan data terbaru.
2. **Gateway Layer (API):** Permintaan dikirim ke RESTful/GraphQL API. Di sinilah Autentikasi (JWT/OAuth) terjadi, menolak permintaan tanpa izin sebelum menyentuh logika inti.
3. **Core Processing (Backend):** Logika bisnis dijalankan. Jika ada tugas berat (misal: AI Processing atau manipulasi gambar), tugas dilempar ke *Background Worker* menggunakan *Message Queue* (Redis/RabbitMQ).
4. **Data Layer:** Hasil disimpan secara permanen di Database utama, dengan caching layer (Redis) untuk query yang sering diakses agar respons secepat kilat.

*Analogi sederhana: Bayangkan ini sebagai restoran bintang lima. Frontend adalah buku menu interaktif, API adalah pelayan yang memastikan pesanan Anda valid, Backend adalah koki di dapur, dan Database adalah ruang penyimpanan bahan baku.*


---

## 📁 Folder Structure

Kebersihan kode dimulai dari struktur direktori yang masuk akal.

```text
📦 [nama-project]
 ┣ 📂 src
 ┃ ┣ 📂 components     # Reusable UI components (Buttons, Cards, dll)
 ┃ ┣ 📂 screens/pages  # Tampilan utama aplikasi (Home, Dashboard)
 ┃ ┣ 📂 services       # Logika komunikasi API & integrasi eksternal
 ┃ ┣ 📂 utils          # Fungsi helper kecil yang serbaguna
 ┃ ┣ 📂 store          # Global state management
 ┃ ┗ 📜 App.tsx        # Entry point aplikasi
 ┣ 📂 server           # Backend API (Jika dalam monorepo)
 ┣ 📂 assets           # Gambar, ikon, dan font
 ┣ 📜 .env.example     # Template environment variables
 ┗ 📜 README.md        # Dokumentasi ini


4. **Download APK**  
   Setelah proses selesai, EAS CLI akan memberikan link download file `.apk` di terminal.

5. **Install APK ke HP**  
   Kirim file `.apk` ke HP dan install secara manual.

**Catatan:**
- Pastikan sudah setup [EAS Build](https://docs.expo.dev/build/introduction/) di project (biasanya otomatis jika pakai Expo SDK 48+).
- Untuk build lokal tanpa EAS Cloud, bisa gunakan:
  ```bash
  eas build -p android --local
  ```
  (butuh Android Studio & Java di komputer)

- Untuk Play Store, gunakan file `.aab` (bukan `.apk`):
  ```bash
  eas build -p android --profile production --type aab
  ```

**Dokumentasi lengkap:**  
https://docs.expo.dev/build/android-builds/

## Troubleshooting: EAS Build "Entity not authorized" / Permission Error

Jika muncul error seperti:
```
You don't have the required permissions to perform this operation.
Original error message: Entity not authorized: AppEntity[...]
```
atau
```
GraphQL request failed.
```

**Penyebab:**
- Akun Expo yang kamu pakai (`datbussin@gmail.com`) **BUKAN owner/project admin** dari project Expo ini (`projectId: 92c85085-e5a7-44ce-b62a-b6ac01d73b48`).
- Hanya owner/admin project yang bisa build di EAS Cloud untuk project tersebut.

**Solusi:**
1. **Pastikan kamu login dengan akun Expo yang sama dengan owner project.**
   - Jalankan:
     ```bash
     eas whoami
     ```
     untuk cek akun yang sedang login.
   - Jika bukan owner, minta owner project untuk menambahkan kamu sebagai "collaborator" di Expo dashboard (https://expo.dev/accounts/[owner]/projects/[project-slug]/access).

2. **Jika kamu hanya contributor, minta owner untuk:**
   - Menambahkan email kamu ke project (role: admin/developer).
   - Atau, minta owner yang melakukan build EAS.

3. **Alternatif:**
   - Jika hanya ingin build lokal (tidak pakai EAS Cloud), gunakan:
     ```bash
     eas build -p android --local
     ```
     (butuh Android Studio & Java di komputer, dan tidak perlu permission Expo Cloud)

4. **Jika ingin reset project ke akun kamu sendiri:**
   - Buat project baru dengan `eas init` di akun kamu.
   - Copy seluruh source code ke project baru.
   - Jalankan `eas build` di project baru (kamu pasti owner).

**Referensi:**
- https://docs.expo.dev/accounts/roles/
- https://docs.expo.dev/build-reference/permissions/

## Jika Project Expo/EAS Bukan Milik Akun Kamu (Project "Warisan" dari Orang Lain)

Jika kamu hanya contributor dan **bukan owner** project Expo/EAS (misal project sudah ada sebelum kamu join), kamu **tidak bisa build di EAS Cloud** kecuali owner menambahkan kamu sebagai collaborator/admin di Expo dashboard.

### Solusi jika ingin bisa build EAS dengan akun sendiri:

1. **Fork/Clone Project ke Akun Expo Kamu Sendiri**
   - Buat project baru di akun Expo kamu:
     ```bash
     eas init
     ```
   - Pilih nama project dan slug sesuai keinginan.
   - Copy seluruh source code dari folder lama ke folder project baru (kecuali file `.expo`, `.eas`, dan `node_modules`).
   - Jalankan:
     ```bash
     git init
     git add .
     git commit -m "Initial commit from legacy project"
     ```

2. **Set Up EAS di Project Baru**
   - Jalankan:
     ```bash
     eas build:configure
     ```
   - Ikuti wizard untuk setup EAS Build di project baru (akan membuat project di akun kamu).

3. **Build APK/AAB di Project Baru**
   - Jalankan:
     ```bash
     eas build -p android --profile development
     ```
   - Sekarang kamu pasti owner dan bisa build tanpa error permission.

4. **(Opsional) Update slug, bundleIdentifier, dsb di `app.json` sesuai kebutuhan.**

### Alternatif: Minta Owner Project Lama
- Minta owner project lama menambahkan akun kamu sebagai collaborator/admin di Expo dashboard (https://expo.dev/accounts/[owner]/projects/[project-slug]/access).

### Catatan
- Project Expo/EAS **terkait dengan akun owner**. Kalau kamu hanya contributor, kamu tetap tidak bisa build di EAS Cloud tanpa akses owner/collaborator.
- Build lokal (`eas build -p android --local`) tetap bisa dilakukan tanpa EAS Cloud, tapi untuk publish ke Play Store tetap lebih baik punya project sendiri.

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
     ```

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

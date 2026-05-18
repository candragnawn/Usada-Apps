# 📋 Dokumentasi Arsitektur Aplikasi Usada

## 📊 Gambaran Umum

Aplikasi Usada adalah aplikasi **monorepo** yang terdiri dari beberapa komponen utama:

```
Usada Apps/
├── FE/AwesomeProject/        👈 Frontend (React Native/Expo)
├── Usada-Bali-Laravel/       👈 Backend (Laravel API)
├── herbalo/                   👈 ML Backend (Python Flask)
├── usada/                     👈 Data Assets (Herbal Plants)
└── package.json               👈 Root package (shared config)
```

---

## 🎨 1. FRONTEND - `FE/AwesomeProject/`

**Teknologi:** React Native + Expo + TypeScript + Zustand + React Navigation

### 📁 Struktur Folder Frontend

```
FE/AwesomeProject/
├── app/                       # 🔄 Expo Router - Routing & Navigation
│   ├── index.tsx             # Home page utama
│   ├── not-found.tsx         # 404 page
│   └── src/                  # Nested routes
│
├── components/               # 🧩 Reusable UI Components
│   ├── ArticleUsada/         # Komponen untuk artikel herbal
│   ├── Header/               # Header komponen
│   ├── Home/                 # Home-specific komponen
│   ├── Product/              # Product-related komponen
│   ├── config/               # Component configuration
│   └── ui/                   # Base UI components (buttons, cards, dll)
│
├── screens/                  # 📱 Full Page Screens
│   ├── HomeScreen.tsx
│   ├── ProductScreen.tsx
│   ├── ProductDetailScreen.tsx
│   ├── HerbalScanScreen.tsx           # 📷 Kamera scan herbal
│   ├── HerbalScanResultScreen.tsx
│   ├── CartScreen.tsx
│   ├── CheckoutScreen.tsx
│   ├── OrdersScreen.tsx
│   ├── ConsultationScreen.tsx         # 💬 Chat konsultasi
│   ├── ChatScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── PaymentInfoScreen.tsx
│   └── [lebih banyak screens...]
│
├── context/                  # 🔐 State Management (React Context + Zustand)
│   ├── AppProviders.tsx      # Provider wrapper untuk seluruh app
│   ├── AuthContext.tsx       # Autentikasi user
│   ├── CartContext.tsx       # Shopping cart state
│   ├── ProductsContext.tsx   # Data produk/herbal
│   ├── OrderContext.tsx      # Data order
│   ├── FilterContext.tsx     # Filter & search state
│   └── UsadaContext.tsx      # Context khusus Usada
│
├── services/                 # 🌐 External Service Integration
│   └── FirebaseService.ts    # Firebase (auth, firestore)
│
├── hooks/                    # ⚙️ Custom React Hooks
│   └── useAuthNavigation.tsx # Hook untuk navigasi berbasis auth
│
├── utils/                    # 🛠️ Utility Functions
│   ├── apiUtils.ts          # API call helpers & axios config
│   ├── formatprice.ts       # Format currency/harga
│   ├── navigationUtils.ts   # Navigasi helper functions
│   └── withProviders.tsx    # HOC untuk wrapping providers
│
├── constants/               # 📌 Konstanta & Config
│   └── [color, endpoint, dll]
│
├── types/                   # 📝 TypeScript Types & Interfaces
│   └── [type definitions]
│
├── assets/                  # 🎨 Static Assets
│   └── images/              # Icons, logos, backgrounds
│
├── app.json                 # 🎯 Expo configuration
├── expo-env.d.ts           # TypeScript env types
├── tsconfig.json           # TypeScript config
├── babel.config.js         # Babel config
├── metro.config.js         # Metro bundler config
├── eslint.config.js        # ESLint config
├── index.js                # Entry point
│
├── android/                # 🤖 Android native code
│   ├── build.gradle
│   └── local.properties
│
└── package.json            # 📦 Dependencies & scripts
```

### 🚀 Scripts Frontend
```bash
npm start          # Jalankan dev server
npm run android    # Build & run di emulator Android
npm run ios        # Build & run di emulator iOS
npm run web        # Run di browser
npm run lint       # ESLint check
```

### 🔑 Key Libraries Frontend
- **expo-router**: File-based routing (seperti Next.js)
- **react-navigation**: Stack, Tab navigation
- **zustand**: State management
- **firebase**: Authentication & database
- **axios**: HTTP client
- **react-native-paper**: Material Design UI
- **expo-camera**: Camera untuk herbal scanning
- **expo-image-picker**: Image selection

---

## ⚙️ 2. BACKEND - `Usada-Bali-Laravel/`

**Teknologi:** Laravel 11 + PHP + MySQL + Tailwind CSS

### 📁 Struktur Folder Backend

```
Usada-Bali-Laravel/
├── app/                      # 📦 Main application code
│   ├── Http/                 # HTTP layer
│   │   ├── Controllers/      # 🎮 API Controllers
│   │   └── Requests/         # Request validation
│   ├── Models/               # 🗄️ Database Models
│   │   ├── User.php
│   │   ├── Product.php
│   │   ├── Order.php
│   │   ├── Herbal.php
│   │   └── [lebih banyak...]
│   ├── Providers/            # Service providers
│   └── Traits/               # Reusable code traits
│
├── routes/                   # 🛣️ API Routes
│   ├── api.php              # REST API endpoints
│   ├── web.php              # Web routes (jika ada)
│   └── console.php          # Console commands
│
├── database/                # 🗄️ Database Management
│   ├── migrations/          # 📝 Schema migrations
│   │   ├── create_users_table.php
│   │   ├── create_products_table.php
│   │   ├── create_orders_table.php
│   │   └── [lebih banyak...]
│   ├── seeders/             # 🌱 Database seeders
│   └── factories/           # 🏭 Model factories (testing)
│
├── resources/               # 🎨 Frontend resources (blade templates)
│   ├── views/              # Blade templates (jika ada)
│   ├── css/
│   └── js/
│
├── config/                  # ⚙️ Configuration files
│   ├── app.php
│   ├── database.php         # Database config
│   ├── auth.php             # Authentication config
│   ├── mail.php
│   ├── cors.php             # CORS settings
│   ├── sanctum.php          # API token auth
│   └── [lebih banyak...]
│
├── bootstrap/               # 🥾 Application bootstrap
│   ├── app.php
│   └── providers.php
│
├── tests/                   # 🧪 Unit & Feature Tests
│   ├── Feature/
│   ├── Unit/
│   └── TestCase.php
│
├── storage/                 # 📦 Storage files
│   ├── app/
│   ├── framework/
│   └── logs/
│
├── public/                  # 🌐 Public accessible files
│   ├── index.php           # Entry point
│   ├── storage/
│   ├── build/              # Compiled assets (vite)
│   ├── images/
│   └── products/
│
├── vite.config.js          # Vite bundler config
├── tailwind.config.js      # Tailwind CSS config
├── composer.json           # PHP dependencies
├── package.json            # Node.js dependencies (vite, tailwind)
├── .env.example            # Environment template
├── artisan                 # 🎯 Laravel CLI
│
└── vendor/                 # 📚 PHP packages (composer)
```

### 🛠️ Struktur API Routes

Endpoint API biasanya mengikuti REST conventions:
```
GET    /api/products              # List semua produk
POST   /api/products              # Create produk
GET    /api/products/{id}         # Get detail produk
PUT    /api/products/{id}         # Update produk
DELETE /api/products/{id}         # Delete produk

GET    /api/users/{id}/orders     # List order user
POST   /api/orders                # Create order
GET    /api/orders/{id}           # Detail order

POST   /api/auth/login            # Login
POST   /api/auth/register         # Register
POST   /api/auth/logout           # Logout
```

### 🚀 Artisan Commands
```bash
php artisan serve           # Run dev server (port 8000)
php artisan migrate         # Run migrations
php artisan db:seed        # Run seeders
php artisan make:model Product -m    # Create model + migration
php artisan make:controller ProductController --api
```

---

## 🤖 3. ML BACKEND - `herbalo/`

**Teknologi:** Python + Flask + TensorFlow/Keras

### 📁 Struktur Folder ML Backend

```
herbalo/
├── app.py                   # 🚀 Flask main application
├── model_herbal.h5         # 🧠 Model (format Keras)
├── model_herbal.tflite     # 📱 Model (format TensorFlow Lite - untuk mobile)
├── requirements.txt        # 📋 Python dependencies
├── static/                 # 📁 Static files (CSS, JS)
└── templates/              # 🎨 HTML templates
    └── index.html          # Web interface
```

### 🎯 Fungsi Herbalo
- **Model Herbal Recognition:** Mengenali jenis tanaman herbal dari foto
- **API Endpoint:** Menerima image dan return prediksi herbal
- **Format Model:** 
  - `.h5`: Untuk backend Python
  - `.tflite`: Untuk mobile app (lebih efisien)

### 📤 Contoh API Herbalo
```
POST /predict
Content-Type: multipart/form-data

Response:
{
  "herbal_name": "Kelor",
  "confidence": 0.95,
  "description": "Moringa oleifera..."
}
```

---

## 📚 4. DATA ASSETS - `usada/`

**Berisi:** Informasi & dokumentasi tanaman herbal

```
usada/
├── Belimbing_Wuluh/        # 📖 Info herbal (folder per jenis)
├── Jambu_Biji/
├── Katuk/
├── Kelor/
├── Kemangi/
├── Kembang_Sepatu/
├── Sirih/
└── Sirsak/
    ├── images/             # Foto tanaman
    ├── description.md      # Deskripsi detail
    ├── uses.md             # Kegunaan
    ├── recipes.md          # Resep tradisional
    └── [data herbal lainnya]
```

---

## 🔗 DATA FLOW & INTEGRASI

### 1️⃣ User Flow: Authentication
```
Frontend (Login Screen)
    ↓
Firebase Auth (atau Laravel Sanctum)
    ↓
Backend Laravel (Validate credentials)
    ↓
Return JWT token
    ↓
Frontend store token in AsyncStorage/MMKV
```

### 2️⃣ User Flow: Product Browsing
```
Frontend (ProductScreen)
    ↓
Axios API call to Laravel
    ↓ GET /api/products
Laravel Controller
    ↓
Database Query
    ↓
Return JSON products
    ↓
Frontend (ProductsContext store)
    ↓
Display in UI
```

### 3️⃣ User Flow: Herbal Scanning
```
Frontend (HerbalScanScreen)
    ↓
Capture photo with expo-camera
    ↓
Send to Herbalo ML API
    ↓ POST /predict (with image)
Python Model inference
    ↓
Return prediction + confidence
    ↓
Display result (HerbalScanResultScreen)
    ↓
Save to scan history (Firebase/Backend)
```

### 4️⃣ User Flow: Shopping Cart
```
Frontend (ProductDetailScreen)
    ↓
Add to cart (CartContext)
    ↓ Cart stored in Zustand/MMKV
Frontend (CartScreen)
    ↓
User confirms checkout
    ↓
POST /api/orders to Backend
    ↓
Laravel create order record
    ↓
Save to database
    ↓
Return order confirmation
```

---

## 🏗️ FOLDER NAMING CONVENTIONS

| Folder | Gunakan untuk | Contoh |
|--------|---------------|--------|
| `screens/` | Full page/routes | `HomeScreen.tsx`, `ProfileScreen.tsx` |
| `components/` | Reusable components | `ProductCard.tsx`, `Header.tsx` |
| `hooks/` | Custom React hooks | `useAuthNavigation.tsx`, `useFetch.ts` |
| `context/` | React Context (state) | `AuthContext.tsx`, `CartContext.tsx` |
| `services/` | External integrations | `FirebaseService.ts`, `ApiService.ts` |
| `utils/` | Helper functions | `formatPrice.ts`, `validators.ts` |
| `types/` | TypeScript interfaces | `User.ts`, `Product.ts` |
| `constants/` | Fixed values | `COLORS.ts`, `API_URLS.ts` |
| `assets/` | Static files | Images, fonts, videos |

---

## 🔄 TECHNOLOGY STACK SUMMARY

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React Native + Expo | Cross-platform mobile app |
| **Frontend State** | Zustand + Context API | State management |
| **Frontend Navigation** | Expo Router + React Navigation | Screen routing |
| **Backend API** | Laravel 11 + PHP | REST API server |
| **Database** | MySQL | Data persistence |
| **Authentication** | Firebase Auth / Laravel Sanctum | User auth |
| **ML Model** | TensorFlow/Keras | Herbal recognition |
| **ML Server** | Flask + Python | ML inference API |
| **Styling (Mobile)** | React Native Paper | Material Design UI |
| **Styling (Web)** | Tailwind CSS | Responsive design |

---

## 📌 BEST PRACTICES UNTUK UPDATE FITUR

### ✅ Saat Menambah Fitur Baru:

#### 1. **Backend (Laravel)**
```
1. Create migration: php artisan make:migration create_xxx_table
2. Create model: php artisan make:model Xxx
3. Create controller: php artisan make:controller XxxController --api
4. Add routes di routes/api.php
5. Add business logic di controller
6. Test dengan Postman/Insomnia
```

#### 2. **Frontend (React Native)**
```
1. Create screen component di screens/ (jika halaman baru)
2. Create components di components/ (reusable UI)
3. Add context di context/ (jika perlu state global)
4. Add hook di hooks/ (custom logic)
5. Update routes di app.json atau app/index.tsx
6. Test dengan expo start
```

#### 3. **Data Flow**
```
1. Define TypeScript interface di types/
2. Create context/hook (jika state management)
3. Add API integration di services/ atau inline
4. Update UI components
5. Handle loading & error states
6. Add error logging
```

---

## 🚨 COMMON ISSUES & SOLUTIONS

### ❌ CORS Error pada API
**Solusi:** Check `config/cors.php` di Laravel, pastikan frontend origin di-whitelist

### ❌ Firebase Auth Error
**Solusi:** Verify google-services.json, check Firebase project settings

### ❌ Model Prediction Error
**Solusi:** Ensure model_herbal.tflite compatible dengan image size/format

### ❌ State Not Updating in UI
**Solusi:** Verify Zustand store, check Context provider wrapping, use DevTools

---

## 📖 FILE LOKASI PENTING

```
🔑 Konfigurasi Utama:
- Frontend routes: FE/AwesomeProject/app/
- Backend API routes: Usada-Bali-Laravel/routes/api.php
- State management: FE/AwesomeProject/context/
- Styling config: Usada-Bali-Laravel/tailwind.config.js
- Environment: Usada-Bali-Laravel/.env (copy dari .env.example)

📋 Database:
- Migrations: Usada-Bali-Laravel/database/migrations/
- Models: Usada-Bali-Laravel/app/Models/
- Seeders: Usada-Bali-Laravel/database/seeders/

🎨 UI Components:
- Reusable: FE/AwesomeProject/components/ui/
- Home page: FE/AwesomeProject/components/Home/
- Product: FE/AwesomeProject/components/Product/

🌐 API:
- Firebase: FE/AwesomeProject/services/FirebaseService.ts
- API calls: FE/AwesomeProject/utils/apiUtils.ts
- Controllers: Usada-Bali-Laravel/app/Http/Controllers/
```

---

## 🎯 QUICK START UNTUK DEVELOPER BARU

### Setup Backend (Laravel)
```bash
cd Usada-Bali-Laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Setup Frontend (React Native)
```bash
cd FE/AwesomeProject
npm install
npm start
# Pilih: a (Android), i (iOS), atau w (Web)
```

### Setup ML Server (Python)
```bash
cd herbalo
pip install -r requirements.txt
python app.py
# Akses di http://localhost:5000
```

---

**Dokumentasi ini akan membantu Anda memahami struktur, melakukan update fitur, dan maintain aplikasi dengan konsisten.**

💡 **Tips:** Selalu ikuti folder structure ini untuk menjaga code organization tetap clean!

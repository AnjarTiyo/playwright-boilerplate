# BOILERPLATE for Standalone Playwright Test Repositories

by Anjar Tiyo

## THIS DOCUMENTATION IS ON PROGRESS

## 📦 Struktur Folder

```
e2e/
├── tests/                  # Semua file test case
│   ├── [features]/               # Modular per fitur atau domain
│   └── ...
├── pages/                  # Page Object Model (POM)
├── fixtures/               # Custom fixtures & mocking
├── utils/                  # Helper utilities
├── config/                 # Config Playwright & env
├── data/                   # Static & dynamic test data
├── reports/                # Output laporan test
├── global-setup.ts         # Setup global
├── global-teardown.ts      # Teardown global (optional)
└── README.md
```

## 🧪 Testing Practices

* Gunakan **Playwright Test Runner** (`@playwright/test`)
* Pisahkan logic ke dalam `pages/` (Page Object Model)
* Gunakan `fixtures/` untuk reusable setup (login, API mock, dsb)
* Simpan test data di `data/`
* Gunakan tag/tagging (`@smoke`, `@regression`, dll) untuk filter test

## ⚙️ Jalankan Test

```bash
npx playwright test                   # Jalankan semua test
npx playwright test tests/auth/       # Jalankan test per folder
npx playwright test --project=chromium # Jalankan untuk browser tertentu
```

## 🧹 Report dan Debug

```bash
npx playwright show-report            # Tampilkan report HTML
npx playwright codegen <URL>          # Buka Codegen Tool
```

## 🛠️ Konfigurasi

* `playwright.config.ts` = konfigurasi global
* `storageState` = untuk simpan session login
* `global-setup.ts` = setup satu kali untuk semua test

## 📄 Referensi Tambahan

* [Playwright Docs](https://playwright.dev/docs/intro)
* [Allure Reporter](https://github.com/allure-framework/allure-js)
* [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
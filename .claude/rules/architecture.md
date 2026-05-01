# Architecture — Zenvy Browser

## Tech Stack
- **Framework**: Electron (desktop shell)
- **UI**: React + Tailwind CSS
- **Database**: SQLite (better-sqlite3)
- **Browser launch**: Puppeteer-extra + stealth plugin
- **Fingerprint**: puppeteer-extra-plugin-stealth + browserforge
- **State**: Zustand
- **Build**: Electron Forge + Vite Plugin

## Cấu trúc thư mục
```
src/
├── main/          # Electron main process
│   ├── index.ts
│   ├── db.ts      # SQLite setup
│   └── browser.ts # Chrome launcher
├── renderer/      # React UI
│   ├── App.tsx
│   ├── pages/
│   │   ├── Profiles.tsx
│   │   └── Settings.tsx
│   └── components/
└── shared/        # Types dùng chung
    └── types.ts
```

## IPC Architecture
- Main process: xử lý DB, launch browser, file system
- Renderer process: UI React, giao tiếp qua `ipcRenderer.invoke()`
- Không expose Node API trực tiếp ra renderer (dùng contextBridge)

## Database Schema
- File: `userData/zenvy.db` (SQLite)
- Tables: `profiles`, `groups`, `proxies`

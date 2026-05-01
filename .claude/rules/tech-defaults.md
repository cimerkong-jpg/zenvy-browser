# Tech Defaults — Zenvy Browser

## Versions
- Node: 20+ (LTS)
- Electron: 30+
- React: 18
- Tailwind CSS: 3
- TypeScript: 5+
- Vite: 5+

## Dependencies chính
```json
{
  "electron": "^30",
  "react": "^18",
  "tailwindcss": "^3",
  "better-sqlite3": "^9",
  "zustand": "^4",
  "puppeteer-extra": "^3",
  "puppeteer-extra-plugin-stealth": "^2"
}
```

## Cấu trúc IPC (Electron)
- Main process: xử lý DB, launch browser, file system
- Renderer process: UI React, giao tiếp qua `ipcRenderer.invoke()`
- Không expose Node API trực tiếp ra renderer (dùng contextBridge)

## Database
- File: `userData/zenvy.db` (SQLite)
- Tables: `profiles`, `groups`, `proxies`

## Build
- Dev: `npm run dev` (Vite + Electron concurrently)
- Prod macOS: `npm run build:mac` → `.dmg`
- Prod Windows: `npm run build:win` → `.exe`

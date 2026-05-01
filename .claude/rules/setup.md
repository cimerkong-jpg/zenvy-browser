# Setup Guide — Zenvy Browser

## ✅ Trạng thái hiện tại

### Đã hoàn thành
- [x] Cấu trúc thư mục đầy đủ (main, renderer, preload, shared)
- [x] Database layer với JSON storage (db.ts)
- [x] Browser launcher với Chrome integration (browser.ts)
- [x] IPC handlers đầy đủ (profiles, groups, browser)
- [x] UI components hoàn chỉnh (Sidebar, ProfilesPage, ProfileRow, ProfileModal)
- [x] State management với Zustand
- [x] Design system với Tailwind (dark purple theme)
- [x] TypeScript configuration (tsconfig.json, tsconfig.node.json, tsconfig.web.json)
- [x] **Electron Forge + Vite Plugin setup** (migrated từ electron-vite)

### ✅ Hoàn tất setup
- [x] Cài đặt tất cả dependencies
  - better-sqlite3 v12.9.0
  - puppeteer v24.42.0
  - puppeteer-extra v3.3.6
  - puppeteer-extra-plugin-stealth v2.11.2
  - @electron-forge packages v7.11.1
- [x] TypeScript typecheck: Passed
- [x] **Migration sang Electron Forge: Thành công**
- [x] **Test app với `npm start`: Chạy thành công**

## 📦 Dependencies

### Hiện tại
```json
{
  "dependencies": {
    "better-sqlite3": "^12.9.0",
    "puppeteer": "^24.42.0",
    "puppeteer-extra": "^3.3.6",
    "puppeteer-extra-plugin-stealth": "^2.11.2",
    "uuid": "^9.0.1",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@electron-forge/cli": "^7.11.1",
    "@electron-forge/maker-deb": "^7.11.1",
    "@electron-forge/maker-dmg": "^7.11.1",
    "@electron-forge/maker-rpm": "^7.11.1",
    "@electron-forge/maker-squirrel": "^7.11.1",
    "@electron-forge/maker-zip": "^7.11.1",
    "@electron-forge/plugin-vite": "^7.11.1",
    "@types/node": "^20.12.7",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "@types/uuid": "^9.0.8",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "electron": "^28.3.3",
    "postcss": "^8.4.38",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.4.5",
    "vite": "^5.2.11"
  }
}
```

## 🚀 Chạy dự án

### Development
```bash
npm start
```

### Package (không tạo installer)
```bash
npm run package
```

### Build installers
```bash
npm run make
```

### Type check
```bash
npm run typecheck
```

## 📦 Build Configuration

### Electron Forge
- **Config file**: `forge.config.ts`
- **Vite configs**: 
  - `vite.main.config.ts` — Main process
  - `vite.preload.config.ts` — Preload script
  - `vite.renderer.config.ts` — Renderer (React UI)

### Makers (Platform-specific)
- **macOS**: DMG + ZIP
- **Windows**: Squirrel (auto-updater support)
- **Linux**: DEB + RPM

### Output
- Package: `out/` directory
- Distributables: `out/make/` directory

## 📝 Ghi chú

### Database
- Hiện tại dùng JSON file: `userData/zenvy-data.json`
- Có thể migrate sang SQLite với better-sqlite3 sau
- Schema: `{ profiles: Profile[], groups: Group[] }`

### Browser Launch
- Dùng Chrome native (không phải Puppeteer)
- Launch với `spawn()` và detached mode
- User data dir: `userData/profiles/{profileId}`
- Proxy config qua Chrome args

### Fingerprint
- Hiện tại chỉ config qua Chrome launch args
- Chưa inject advanced fingerprint spoofing
- Có thể nâng cấp với puppeteer-extra-plugin-stealth sau

## ⚠️ Cần làm tiếp

1. **Test chạy dev server** — Đảm bảo app khởi động không lỗi
2. **Test tạo profile** — CRUD operations
3. **Test launch browser** — Chrome mở với user-data-dir riêng
4. **Kiểm tra proxy** — Proxy config hoạt động đúng
5. **Advanced fingerprint** — Nâng cấp với puppeteer-extra nếu cần

## 🔧 Troubleshooting

### Electron không chạy trên macOS
```bash
# Remove quarantine
xattr -r -d com.apple.quarantine node_modules/electron/dist/Electron.app

# Re-sign
codesign --force --deep --sign - node_modules/electron/dist/Electron.app
```

### Chrome không tìm thấy
- Kiểm tra path trong `src/main/browser.ts`
- macOS: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
- Windows: `C:\Program Files\Google Chrome\Application\chrome.exe`

### TypeScript errors
```bash
npm run typecheck
```

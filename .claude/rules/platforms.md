# Platform Support — Zenvy Browser

## Target Platforms
- **Primary**: macOS (development và testing chính)
- **Secondary**: Windows (cross-platform support)

## Chrome Paths
- macOS: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
- Windows: `C:\Program Files\Google Chrome\Application\chrome.exe`

## Build Targets
- Dev: `npm run dev` (Vite + Electron concurrently)
- Prod macOS: `npm run build:mac` → `.dmg`
- Prod Windows: `npm run build:win` → `.exe`

## Platform-specific Considerations
- User data directory paths khác nhau giữa macOS và Windows
- Chrome launch args có thể khác nhau
- File paths cần handle cross-platform (dùng `path.join()`)

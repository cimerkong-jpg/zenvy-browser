# Features — Zenvy Browser

## Tính năng cốt lõi
1. **Quản lý profile**: CRUD operations + nhóm profiles
2. **Proxy management**: Gán proxy per profile (HTTP/HTTPS/SOCKS5)
3. **Browser isolation**: Launch Chrome với user-data-dir riêng cho mỗi profile
4. **Fingerprint spoofing**: Canvas, WebGL, WebRTC, User Agent
5. **Cookie management**: Import/export cookies cho từng profile

## Chi tiết implementation
- Mỗi profile có user-data-dir riêng để tách biệt hoàn toàn
- Proxy được config qua Chrome launch args
- Fingerprint được inject qua puppeteer-extra-plugin-stealth
- Cookies được lưu trong SQLite và sync vào Chrome profile khi launch

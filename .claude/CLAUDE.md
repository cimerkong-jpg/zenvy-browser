---
# ⚠️ YÊU CẦU BẮT BUỘC - PHẢI ĐỌC TRƯỚC KHI LÀM BẤT KỲ VIỆC GÌ
---

## 🔴 Quy tắc tuyệt đối (KHÔNG BAO GIỜ VI PHẠM)

### 1. Ngôn ngữ giao tiếp
**LUÔN LUÔN trả lời bằng tiếng Việt**, trừ khi user yêu cầu ngôn ngữ khác một cách rõ ràng.

### 2. Quản lý files
**KHÔNG BAO GIỜ tự xóa file** mà không hỏi user trước. Luôn hỏi:
```
"Tôi cần xóa file [tên file]. Bạn có đồng ý không?"
```

### 3. Cập nhật documentation
**BẮT BUỘC** update file `CLAUDE.md` và các file rules khi:
- Thêm công việc mới
- Thay đổi cấu trúc code
- Build thêm tính năng
- Thay đổi tech stack

---
# Zenvy Browser — Project Brain
---

## Mục đích
Antidetect browser desktop app cho phép quản lý nhiều tài khoản Facebook/MMO/Ads với profile isolation, proxy per profile, và fingerprint spoofing.

## 🔄 Auto-Update Requirement
**BẮT BUỘC**: Khi dự án có bổ sung thêm:
- Công việc mới
- Thay đổi cấu trúc code
- Build thêm tính năng
- Thay đổi tech stack

→ Tự động update file `CLAUDE.md` này và tạo/update các file rules tương ứng trong `.claude/rules/`

## 📚 Rules Structure
Chi tiết kỹ thuật được tách thành các file rules:
- `rules/architecture.md` — Tech stack, cấu trúc thư mục, IPC
- `rules/features.md` — Tính năng cốt lõi và implementation
- `rules/scope.md` — In scope và out of scope
- `rules/platforms.md` — Platform support (macOS, Windows)
- `rules/design.md` — Design system, màu sắc, typography
- `rules/tech-defaults.md` — Versions, dependencies, build
- `rules/workflow.md` — Git workflow, code standards
- `rules/setup.md` — Setup guide và troubleshooting

## 🤖 AI Agents
Specialized agents cho các tasks khác nhau:

### Core Agents (Sonnet 4-6)
- `agents/researcher.md` — Research và tóm tắt thông tin
- `agents/reviewer.md` — Code review, quality assurance
- `agents/debugger.md` — Debug và fix bugs
- `agents/documentation.md` — Tạo và maintain docs
- `agents/tester.md` — Viết và maintain tests
- `agents/refactor.md` — Code refactoring và optimization
- `agents/devops.md` — CI/CD, deployment, infrastructure
- `agents/performance.md` — Performance optimization
- `agents/integration.md` — External integrations, APIs

### Advanced Agents (Opus 4-7)
- `agents/architect.md` — Architecture design, technical decisions
- `agents/uiux.md` — UI/UX design và accessibility
- `agents/security.md` — Security audit và hardening

### 🎯 Agent Auto-Selection
AI sẽ **tự động chọn và apply agent phù hợp** khi bạn yêu cầu task.
Xem chi tiết: `AGENT_USAGE.md`

**Ví dụ**:
- "Debug lỗi X" → Tự động dùng Debugger agent
- "Review code Y" → Tự động dùng Reviewer agent
- "Design architecture Z" → Tự động dùng Architect agent

## Quick Reference
- **Tech**: Electron + React + Tailwind + SQLite + Puppeteer
- **Target**: macOS primary, Windows secondary
- **Use case**: Cá nhân/nhóm nhỏ, không team collaboration
- **Core features**: Profile management, proxy, fingerprint spoofing, cookies

## 🚀 Setup Status
- ✅ **Environment**: Đã setup hoàn tất
- ✅ **Dependencies**: Tất cả packages đã được cài đặt
- ✅ **AI Agents**: 12 agents professional đã được tạo và ready
- ✅ **Build Tool**: Đã migrate sang Electron Forge thành công
- 📝 **Chi tiết**: Xem `rules/setup.md`

## 🎯 Next Steps
1. Test tạo profile và launch browser
2. Kiểm tra proxy và fingerprint hoạt động
3. Nâng cấp fingerprint với puppeteer-extra nếu cần
4. Build và test distributable packages

## 📝 Session History
**Session 2026-04-30 (Part 1)**:
- ✅ Audit .claude directory
- ✅ Tạo 12 professional AI agents
- ✅ Setup agent auto-selection
- ✅ Debug electron-vite issue (confirmed broken)
- ✅ Research alternatives (chose Electron Forge)

**Session 2026-04-30 (Part 2)**:
- ✅ Migrate sang Electron Forge thành công
- ✅ Cài đặt @electron-forge packages
- ✅ Tạo forge.config.ts với multi-platform support
- ✅ Tách Vite configs (main, preload, renderer)
- ✅ Update package.json scripts
- ✅ Remove electron-builder và electron-vite
- ✅ Test app chạy thành công với `npm start`

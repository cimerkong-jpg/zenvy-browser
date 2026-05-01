# 🚀 Zenvy Browser - Level 2 Development Roadmap

## 📊 Current Status: v0.0.1 → v0.1.0

**Start Date:** May 1, 2026  
**Target Completion:** June 30, 2026 (2 months)

---

## 🎯 Level 2: Advanced Features

### Overview
Nâng cấp từ basic antidetect browser lên advanced tool với cookie management, automation, templates và advanced fingerprinting.

---

## 📋 Feature List

### ✅ 1. Cookie Management (Week 1-2)
**Priority:** HIGH  
**Complexity:** Medium  
**Status:** 🔴 Not Started

#### Features
- [ ] Import cookies (Netscape format)
- [ ] Export cookies per profile
- [ ] Cookie editor UI
- [ ] Cookie viewer with search/filter
- [ ] Auto-save cookies on browser close
- [ ] Cookie encryption

#### Technical Details
```typescript
// File structure
src/main/cookies.ts          // Cookie operations
src/renderer/src/components/CookieManager.tsx  // UI
src/renderer/src/components/CookieEditor.tsx   // Editor modal

// API
- importCookies(profileId, filePath)
- exportCookies(profileId, filePath)
- getCookies(profileId)
- setCookie(profileId, cookie)
- deleteCookie(profileId, cookieName)
```

#### UI Components
```
CookieManager
├── CookieList (table view)
├── CookieEditor (modal)
├── ImportButton
├── ExportButton
└── SearchBar
```

#### File Format
```
# Netscape HTTP Cookie File
.facebook.com	TRUE	/	TRUE	1234567890	c_user	123456
.facebook.com	TRUE	/	TRUE	1234567890	xs	abc123
```

---

### ✅ 2. Profile Templates (Week 2-3)
**Priority:** HIGH  
**Complexity:** Low  
**Status:** 🔴 Not Started

#### Features
- [ ] Pre-configured templates
- [ ] Template library
- [ ] Custom template creation
- [ ] Template import/export
- [ ] Template marketplace (future)

#### Templates
```typescript
// Built-in templates
1. Facebook Template
   - User Agent: Chrome Windows
   - Timezone: US/Pacific
   - Language: en-US
   - Canvas: Noise
   - WebRTC: Disabled

2. Google Template
   - User Agent: Chrome macOS
   - Timezone: Auto
   - Language: en-US
   - Canvas: Noise

3. Amazon Template
   - User Agent: Chrome Windows
   - Timezone: US/Eastern
   - Language: en-US

4. TikTok Template
   - User Agent: Chrome Android
   - Timezone: US/Pacific
   - Language: en-US

5. Instagram Template
   - User Agent: Chrome iOS
   - Timezone: US/Pacific
   - Language: en-US
```

#### Technical Details
```typescript
// File structure
src/main/templates.ts
src/renderer/src/components/TemplateSelector.tsx
resources/templates/
├── facebook.json
├── google.json
├── amazon.json
├── tiktok.json
└── instagram.json

// Template format
interface Template {
  id: string
  name: string
  description: string
  icon: string
  fingerprint: FingerprintConfig
  proxy?: ProxyConfig
  tags: string[]
}
```

---

### ✅ 3. Advanced Fingerprinting (Week 3-5)
**Priority:** HIGH  
**Complexity:** High  
**Status:** 🔴 Not Started

#### New Fingerprint Parameters

##### 3.1 Fonts Fingerprint
```typescript
// Spoof installed fonts list
fonts: string[] = [
  'Arial', 'Times New Roman', 'Courier New',
  'Verdana', 'Georgia', 'Comic Sans MS'
]
```

##### 3.2 Audio Context
```typescript
// Spoof audio fingerprint
audioContext: {
  sampleRate: 44100 | 48000
  channelCount: 2
  maxChannelCount: 2
}
```

##### 3.3 Screen Resolution
```typescript
// Spoof screen size
screen: {
  width: 1920
  height: 1080
  availWidth: 1920
  availHeight: 1040
  colorDepth: 24
  pixelDepth: 24
}
```

##### 3.4 Timezone by IP
```typescript
// Auto-detect timezone from proxy IP
timezone: 'auto' | string
// If proxy is US → America/New_York
// If proxy is UK → Europe/London
```

##### 3.5 Geolocation
```typescript
// Spoof GPS location
geolocation: {
  latitude: 40.7128
  longitude: -74.0060
  accuracy: 100
}
```

##### 3.6 Battery Status
```typescript
// Spoof battery info
battery: {
  charging: boolean
  level: 0.5-1.0
  chargingTime: number
  dischargingTime: number
}
```

##### 3.7 Network Info
```typescript
// Spoof connection type
connection: {
  effectiveType: '4g' | '3g' | 'wifi'
  downlink: 10
  rtt: 50
}
```

#### Implementation
```typescript
// File structure
src/main/fingerprint/
├── fonts.ts
├── audio.ts
├── screen.ts
├── timezone.ts
├── geolocation.ts
├── battery.ts
└── network.ts

resources/fingerprint-inject-advanced.js
```

---

### ✅ 4. Automation Scripts (Week 5-7)
**Priority:** MEDIUM  
**Complexity:** High  
**Status:** 🔴 Not Started

#### Features
- [ ] Script editor with syntax highlighting
- [ ] Record & replay actions
- [ ] Schedule scripts
- [ ] Script library
- [ ] Multi-profile execution
- [ ] Error handling & retry

#### Script Types

##### 4.1 Simple Actions
```javascript
// Auto login
await page.goto('https://facebook.com')
await page.type('#email', 'user@email.com')
await page.type('#pass', 'password')
await page.click('button[name="login"]')
```

##### 4.2 Data Extraction
```javascript
// Scrape data
const data = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.item'))
    .map(el => el.textContent)
})
```

##### 4.3 Form Filling
```javascript
// Auto fill form
await page.type('#name', 'John Doe')
await page.type('#email', 'john@example.com')
await page.select('#country', 'US')
await page.click('#submit')
```

#### Technical Details
```typescript
// File structure
src/main/automation/
├── executor.ts       // Script execution
├── recorder.ts       // Action recording
├── scheduler.ts      // Cron jobs
└── library.ts        // Script storage

src/renderer/src/components/
├── ScriptEditor.tsx
├── ScriptLibrary.tsx
└── ScriptScheduler.tsx

// Script format
interface Script {
  id: string
  name: string
  code: string
  profiles: string[]  // Which profiles to run on
  schedule?: string   // Cron expression
  enabled: boolean
}
```

---

### ✅ 5. Enhanced UI/UX (Week 7-8)
**Priority:** MEDIUM  
**Complexity:** Medium  
**Status:** 🔴 Not Started

#### Features
- [ ] Dark/Light theme toggle
- [ ] Keyboard shortcuts
- [ ] Quick actions menu
- [ ] Drag & drop profiles
- [ ] Bulk operations
- [ ] Search & filter improvements

#### Keyboard Shortcuts
```
Cmd/Ctrl + N     - New profile
Cmd/Ctrl + O     - Open profile
Cmd/Ctrl + E     - Edit profile
Cmd/Ctrl + D     - Duplicate profile
Cmd/Ctrl + Del   - Delete profile
Cmd/Ctrl + F     - Search
Cmd/Ctrl + ,     - Settings
```

---

## 📁 New File Structure

```
zenvy-browser/
├── src/
│   ├── main/
│   │   ├── index.ts
│   │   ├── db.ts
│   │   ├── browser.ts
│   │   ├── cookies.ts          ← NEW
│   │   ├── templates.ts        ← NEW
│   │   ├── fingerprint/        ← NEW
│   │   │   ├── fonts.ts
│   │   │   ├── audio.ts
│   │   │   ├── screen.ts
│   │   │   ├── timezone.ts
│   │   │   ├── geolocation.ts
│   │   │   ├── battery.ts
│   │   │   └── network.ts
│   │   └── automation/         ← NEW
│   │       ├── executor.ts
│   │       ├── recorder.ts
│   │       ├── scheduler.ts
│   │       └── library.ts
│   ├── renderer/src/
│   │   ├── components/
│   │   │   ├── CookieManager.tsx      ← NEW
│   │   │   ├── CookieEditor.tsx       ← NEW
│   │   │   ├── TemplateSelector.tsx   ← NEW
│   │   │   ├── ScriptEditor.tsx       ← NEW
│   │   │   ├── ScriptLibrary.tsx      ← NEW
│   │   │   └── ScriptScheduler.tsx    ← NEW
│   │   └── pages/
│   │       ├── CookiesPage.tsx        ← NEW
│   │       ├── AutomationPage.tsx     ← NEW
│   │       └── SettingsPage.tsx       ← NEW
│   └── shared/
│       └── types.ts (updated)
├── resources/
│   ├── templates/              ← NEW
│   │   ├── facebook.json
│   │   ├── google.json
│   │   └── ...
│   ├── fingerprint-inject-advanced.js  ← NEW
│   └── scripts/                ← NEW
│       └── examples/
└── docs/
    ├── COOKIES.md              ← NEW
    ├── TEMPLATES.md            ← NEW
    ├── AUTOMATION.md           ← NEW
    └── FINGERPRINTING.md       ← NEW
```

---

## 📊 Development Timeline

### Week 1-2: Cookie Management
- Day 1-3: Backend (import/export)
- Day 4-7: UI components
- Day 8-10: Testing & polish
- Day 11-14: Documentation

### Week 3: Profile Templates
- Day 1-3: Template system
- Day 4-5: Built-in templates
- Day 6-7: UI integration

### Week 4-5: Advanced Fingerprinting
- Day 1-2: Fonts & Audio
- Day 3-4: Screen & Timezone
- Day 5-6: Geolocation & Battery
- Day 7-10: Testing & integration

### Week 6-7: Automation Scripts
- Day 1-4: Script executor
- Day 5-7: Recorder
- Day 8-10: Scheduler
- Day 11-14: UI & library

### Week 8: Polish & Release
- Day 1-3: Bug fixes
- Day 4-5: Documentation
- Day 6-7: Testing
- Day 8: Release v0.1.0

---

## 🎯 Success Metrics

### Technical
- [ ] All 5 features implemented
- [ ] 100% test coverage for new features
- [ ] No performance regression
- [ ] Build size < 300MB

### User Experience
- [ ] Cookie import/export works flawlessly
- [ ] Templates reduce setup time by 80%
- [ ] Advanced fingerprinting maintains 100/100 score
- [ ] Automation scripts run reliably

### Documentation
- [ ] Complete API documentation
- [ ] User guides for all features
- [ ] Video tutorials
- [ ] Migration guide from v0.0.1

---

## 🚀 Release Plan

### v0.1.0-alpha (Week 4)
- Cookie Management
- Profile Templates
- Basic advanced fingerprinting

### v0.1.0-beta (Week 6)
- All advanced fingerprinting
- Automation scripts (basic)

### v0.1.0 (Week 8)
- All features complete
- Full documentation
- Production ready

---

## 📝 Notes

### Dependencies to Add
```json
{
  "monaco-editor": "^0.45.0",  // Script editor
  "node-cron": "^3.0.3",       // Scheduler
  "puppeteer-core": "^21.0.0"  // Automation
}
```

### Breaking Changes
- None (backward compatible with v0.0.1)

### Migration Path
- Existing profiles work without changes
- New features are opt-in
- Auto-upgrade database schema

---

**Status:** 🔴 Planning Phase  
**Next Action:** Start Week 1 - Cookie Management Backend

**Last Updated:** May 1, 2026

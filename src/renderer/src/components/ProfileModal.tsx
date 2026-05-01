import { useState, useEffect } from 'react'
import type { Profile, Fingerprint, Proxy } from '../../../shared/types'
import { useStore } from '../store/useStore'

const UA_PRESETS: Record<string, string> = {
  'Chrome 120 / Windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Chrome 120 / macOS': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Chrome 120 / Linux': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Firefox 121 / Windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Safari 17 / macOS': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15'
}

const defaultFingerprint: Fingerprint = {
  os: 'Windows',
  userAgent: UA_PRESETS['Chrome 120 / Windows'],
  timezone: 'Asia/Ho_Chi_Minh',
  language: 'vi-VN',
  screenWidth: 1920,
  screenHeight: 1080,
  hardwareConcurrency: 8,
  deviceMemory: 8,
  webRTC: 'disabled', // Force disabled by default for 100/100 antidetect score
  canvas: 'noise',
  webGL: 'noise',
  deviceName: '',
  macAddress: ''
}

const defaultProxy: Proxy = {
  type: 'none',
  host: '',
  port: '',
  username: '',
  password: ''
}

interface Props {
  profile: Profile | null
  onClose: () => void
}

export default function ProfileModal({ profile, onClose }: Props) {
  const { loadAll, groups } = useStore()
  const isEdit = !!profile

  const [name, setName] = useState('')
  const [groupId, setGroupId] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [cookies, setCookies] = useState('')
  const [fingerprint, setFingerprint] = useState<Fingerprint>(defaultFingerprint)
  const [proxy, setProxy] = useState<Proxy>(defaultProxy)
  const [tab, setTab] = useState<'basic' | 'fingerprint' | 'proxy'>('basic')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setName(profile.name)
      setGroupId(profile.groupId ?? '')
      setNotes(profile.notes)
      setCookies(profile.cookies)
      setFingerprint(profile.fingerprint)
      setProxy(profile.proxy)
    }
  }, [profile])

  const fp = (key: keyof Fingerprint, val: string | number) =>
    setFingerprint((f) => ({ ...f, [key]: val }))

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      const data = {
        name: name.trim(),
        groupId: groupId || null,
        notes,
        cookies,
        fingerprint,
        proxy,
        status: profile?.status ?? 'closed' as const
      }
      console.log('Saving profile:', data)
      if (isEdit && profile) {
        await window.api.profiles.update(profile.id, data)
      } else {
        await window.api.profiles.create(data)
      }
      await loadAll()
      onClose()
    } catch (error) {
      console.error('Failed to save profile:', error)
      alert('Lỗi khi lưu hồ sơ: ' + (error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { key: 'basic', label: 'Cơ bản' },
    { key: 'fingerprint', label: 'Fingerprint' },
    { key: 'proxy', label: 'Proxy' }
  ] as const

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-purple-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-base font-semibold text-white">
            {isEdit ? 'Chỉnh sửa hồ sơ' : 'Tạo hồ sơ mới'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-lg">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {tab === 'basic' && (
            <>
              <Field label="Tên hồ sơ *">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Facebook Account 1"
                  className="input-field"
                />
              </Field>

              <Field label="Nhóm">
                <select
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className="input-field"
                >
                  <option value="">Không có nhóm</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </Field>

              <Field label="Ghi chú">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Thông tin tài khoản, mật khẩu, ghi chú..."
                  className="input-field resize-none"
                />
              </Field>

              <Field label="Cookies (JSON)">
                <textarea
                  value={cookies}
                  onChange={(e) => setCookies(e.target.value)}
                  rows={4}
                  placeholder='[{"name":"c_user","value":"...","domain":".facebook.com"}]'
                  className="input-field resize-none font-mono text-xs"
                />
              </Field>
            </>
          )}

          {tab === 'fingerprint' && (
            <>
              <Field label="User Agent">
                <select
                  onChange={(e) => fp('userAgent', UA_PRESETS[e.target.value] || '')}
                  className="input-field mb-2"
                >
                  <option value="">Chọn preset...</option>
                  {Object.keys(UA_PRESETS).map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
                <textarea
                  value={fingerprint.userAgent}
                  onChange={(e) => fp('userAgent', e.target.value)}
                  rows={2}
                  className="input-field resize-none font-mono text-xs"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Hệ điều hành">
                  <select value={fingerprint.os} onChange={(e) => fp('os', e.target.value)} className="input-field">
                    <option>Windows</option>
                    <option>macOS</option>
                    <option>Linux</option>
                  </select>
                </Field>
                <Field label="Ngôn ngữ">
                  <input value={fingerprint.language} onChange={(e) => fp('language', e.target.value)} className="input-field" />
                </Field>
                <Field label="Múi giờ">
                  <input value={fingerprint.timezone} onChange={(e) => fp('timezone', e.target.value)} className="input-field" />
                </Field>
                <Field label="Hardware Concurrency">
                  <select value={fingerprint.hardwareConcurrency} onChange={(e) => fp('hardwareConcurrency', Number(e.target.value))} className="input-field">
                    {[2, 4, 6, 8, 10, 12, 16].map((n) => <option key={n}>{n}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Field label="WebRTC">
                  <select value={fingerprint.webRTC} onChange={(e) => fp('webRTC', e.target.value)} className="input-field">
                    <option value="disabled">Vô hiệu hóa</option>
                    <option value="real">Thực</option>
                  </select>
                </Field>
                <Field label="Canvas">
                  <select value={fingerprint.canvas} onChange={(e) => fp('canvas', e.target.value)} className="input-field">
                    <option value="noise">Nhiễu</option>
                    <option value="real">Thực</option>
                  </select>
                </Field>
                <Field label="WebGL">
                  <select value={fingerprint.webGL} onChange={(e) => fp('webGL', e.target.value)} className="input-field">
                    <option value="noise">Nhiễu</option>
                    <option value="real">Thực</option>
                  </select>
                </Field>
              </div>
            </>
          )}

          {tab === 'proxy' && (
            <>
              <Field label="Loại Proxy">
                <div className="flex gap-2">
                  {(['none', 'http', 'socks5'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setProxy((p) => ({ ...p, type: t }))}
                      className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                        proxy.type === t
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                          : 'text-slate-500 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      {t === 'none' ? 'Không dùng' : t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </Field>

              {proxy.type !== 'none' && (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Field label="Host / IP">
                        <input value={proxy.host} onChange={(e) => setProxy((p) => ({ ...p, host: e.target.value }))} placeholder="192.168.1.1" className="input-field" />
                      </Field>
                    </div>
                    <Field label="Port">
                      <input value={proxy.port} onChange={(e) => setProxy((p) => ({ ...p, port: e.target.value }))} placeholder="8080" className="input-field" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Username">
                      <input value={proxy.username} onChange={(e) => setProxy((p) => ({ ...p, username: e.target.value }))} className="input-field" />
                    </Field>
                    <Field label="Password">
                      <input type="password" value={proxy.password} onChange={(e) => setProxy((p) => ({ ...p, password: e.target.value }))} className="input-field" />
                    </Field>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="btn-primary text-white text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo hồ sơ'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

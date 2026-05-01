import { useState } from 'react'
import { useStore } from '../store/useStore'
import TemplateManager from './TemplateManager'

const ZenvyLogo = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B5CF6" />
        <stop offset="1" stopColor="#9333EA" />
      </linearGradient>
    </defs>
    <rect width="28" height="28" rx="8" fill="url(#logoGrad)" />
    <path d="M7 8h14l-9 12h9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Sidebar() {
  const { groups, selectedGroupId, setSelectedGroupId, loadAll } = useStore()
  const [newGroupName, setNewGroupName] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [showTemplateManager, setShowTemplateManager] = useState(false)

  const createGroup = async () => {
    const name = newGroupName.trim()
    if (!name) return
    await window.api.groups.create(name)
    await loadAll()
    setNewGroupName('')
    setShowInput(false)
  }

  const deleteGroup = async (id: string) => {
    await window.api.groups.delete(id)
    if (selectedGroupId === id) setSelectedGroupId(null)
    await loadAll()
  }

  return (
    <>
      <aside className="w-56 flex-shrink-0 flex flex-col border-r border-purple-500/10 bg-[#0D0B1A]">
      {/* Title bar drag region */}
      <div className="drag-region h-8 flex-shrink-0" />

      {/* Logo */}
      <div className="no-drag flex items-center gap-2.5 px-4 pb-5">
        <ZenvyLogo />
        <span className="text-sm font-semibold tracking-wide text-white">Zenvy</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {/* Profiles section */}
        <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Hồ sơ
        </p>

        <button
          onClick={() => setSelectedGroupId(null)}
          className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all ${
            selectedGroupId === null
              ? 'bg-purple-600/20 text-purple-300'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="text-base">⊞</span>
          Tất cả
        </button>

        {groups.map((g) => (
          <div key={g.id} className="group flex items-center">
            <button
              onClick={() => setSelectedGroupId(g.id)}
              className={`flex-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all ${
                selectedGroupId === g.id
                  ? 'bg-purple-600/20 text-purple-300'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-base">◈</span>
              <span className="truncate">{g.name}</span>
            </button>
            <button
              onClick={() => deleteGroup(g.id)}
              className="mr-1 hidden group-hover:flex items-center justify-center w-5 h-5 rounded text-slate-600 hover:text-red-400 transition-colors"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Add group */}
        {showInput ? (
          <div className="px-1 pt-1">
            <input
              autoFocus
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createGroup()}
              onBlur={() => { setShowInput(false); setNewGroupName('') }}
              placeholder="Tên nhóm..."
              className="w-full rounded-lg bg-white/5 border border-purple-500/20 px-3 py-1.5 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500/50"
            />
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-purple-400 transition-colors rounded-lg hover:bg-white/5"
          >
            <span>+</span> Thêm nhóm
          </button>
        )}

        {/* Templates section */}
        <div className="pt-4">
          <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Templates
          </p>
          <button
            onClick={() => setShowTemplateManager(true)}
            className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <span className="text-base">📋</span>
            Quản lý Templates
          </button>
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-purple-500/10 p-3">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-xs font-semibold text-white">
            Z
          </div>
          <div>
            <p className="text-xs font-medium text-white">Zenvy</p>
            <p className="text-[10px] text-slate-500">Personal</p>
          </div>
        </div>
      </div>
      </aside>

      {/* Template Manager Modal */}
      {showTemplateManager && (
        <TemplateManager onClose={() => setShowTemplateManager(false)} />
      )}
    </>
  )
}

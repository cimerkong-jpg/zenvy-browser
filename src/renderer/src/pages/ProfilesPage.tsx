import { useState, useMemo } from 'react'
import { useStore } from '../store/useStore'
import ProfileRow from '../components/ProfileRow'
import ProfileModal from '../components/ProfileModal'
import type { Profile } from '../../../shared/types'

export default function ProfilesPage() {
  const { profiles, groups, runningIds, selectedGroupId, selectedIds, searchQuery, selectAll, clearSelection, setSearchQuery, loadAll } = useStore()
  const [editProfile, setEditProfile] = useState<Profile | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      const matchGroup = selectedGroupId === null || p.groupId === selectedGroupId
      const q = searchQuery.toLowerCase()
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.notes.toLowerCase().includes(q)
      return matchGroup && matchSearch
    })
  }, [profiles, selectedGroupId, searchQuery])

  const allSelected = filtered.length > 0 && filtered.every((p) => selectedIds.includes(p.id))

  const toggleAll = () => {
    if (allSelected) clearSelection()
    else selectAll(filtered.map((p) => p.id))
  }

  const deleteSelected = async () => {
    if (!selectedIds.length) return
    if (!confirm(`Xóa ${selectedIds.length} hồ sơ đã chọn?`)) return
    await window.api.profiles.deleteMany(selectedIds)
    clearSelection()
    await loadAll()
  }

  const groupLabel = selectedGroupId
    ? groups.find((g) => g.id === selectedGroupId)?.name ?? 'Nhóm'
    : 'Tất cả'

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <div className="drag-region h-8 flex-shrink-0" />

      <div className="no-drag flex items-center justify-between px-6 pb-4">
        <div>
          <h1 className="text-lg font-semibold text-white">Nhóm hồ sơ</h1>
          <p className="text-xs text-slate-500 mt-0.5">{groupLabel} · {filtered.length} hồ sơ</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary text-white text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <span>+</span> Tạo hồ sơ
        </button>
      </div>

      {/* Toolbar */}
      <div className="no-drag flex items-center gap-3 px-6 pb-3">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">⌕</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm..."
            className="w-full pl-8 pr-4 py-2 rounded-xl bg-white/5 border border-white/8 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500/40 transition-colors"
          />
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{selectedIds.length} đã chọn</span>
            <button
              onClick={deleteSelected}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
            >
              Xóa
            </button>
            <button
              onClick={clearSelection}
              className="text-xs px-3 py-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
            >
              Bỏ chọn
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="w-10 pl-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 accent-purple-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 pr-4 text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                <th className="py-3 pr-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Nhóm</th>
                <th className="py-3 pr-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Tên</th>
                <th className="py-3 pr-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Ghi chú</th>
                <th className="py-3 pr-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Proxy</th>
                <th className="py-3 pr-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="py-3 pr-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-2xl">⊞</div>
                      <p className="text-slate-500 text-sm">Chưa có hồ sơ nào</p>
                      <button
                        onClick={() => setShowCreate(true)}
                        className="btn-primary text-white text-xs font-medium px-4 py-2 rounded-lg"
                      >
                        Tạo hồ sơ đầu tiên
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <ProfileRow
                    key={p.id}
                    profile={p}
                    groups={groups}
                    isRunning={runningIds.includes(p.id)}
                    isSelected={selectedIds.includes(p.id)}
                    onEdit={setEditProfile}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <p className="text-xs text-slate-600 mt-3 text-right">
            {filtered.length} hồ sơ
          </p>
        )}
      </div>

      {/* Modals */}
      {showCreate && <ProfileModal profile={null} onClose={() => setShowCreate(false)} />}
      {editProfile && <ProfileModal profile={editProfile} onClose={() => setEditProfile(null)} />}
    </div>
  )
}

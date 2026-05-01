import { useState } from 'react'
import type { Profile, Group } from '../../../shared/types'
import { useStore } from '../store/useStore'
import CookieManager from './CookieManager'

interface Props {
  profile: Profile
  groups: Group[]
  isRunning: boolean
  isSelected: boolean
  onEdit: (p: Profile) => void
}

export default function ProfileRow({ profile, groups, isRunning, isSelected, onEdit }: Props) {
  const { toggleSelect, loadAll, runningIds } = useStore()
  const [showCookies, setShowCookies] = useState(false)
  const group = groups.find((g) => g.id === profile.groupId)

  const handleLaunch = async () => {
    if (isRunning) {
      await window.api.browser.close(profile.id)
    } else {
      await window.api.browser.launch(profile)
    }
    const ids = await window.api.browser.running()
    useStore.getState().setRunningIds(ids)
  }

  const handleDelete = async () => {
    await window.api.profiles.delete(profile.id)
    await loadAll()
  }

  const daysLeft = Math.ceil((profile.updatedAt + 30 * 86400000 - Date.now()) / 86400000)

  return (
    <tr
      className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${isSelected ? 'bg-purple-600/5' : ''}`}
    >
      {/* Checkbox */}
      <td className="w-10 pl-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelect(profile.id)}
          className="w-3.5 h-3.5 accent-purple-500 cursor-pointer"
        />
      </td>

      {/* ID */}
      <td className="py-3 pr-4">
        <span className="text-xs font-mono text-slate-500">{profile.id.slice(0, 6).toUpperCase()}</span>
      </td>

      {/* Group */}
      <td className="py-3 pr-4">
        {group ? (
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {group.name}
          </span>
        ) : (
          <span className="text-xs text-slate-600">—</span>
        )}
      </td>

      {/* Name */}
      <td className="py-3 pr-4">
        <span className="text-sm font-medium text-white">{profile.name}</span>
      </td>

      {/* Notes */}
      <td className="py-3 pr-4 max-w-xs">
        <span className="text-xs text-slate-500 truncate block">{profile.notes || '—'}</span>
      </td>

      {/* Proxy */}
      <td className="py-3 pr-4">
        {profile.proxy.type !== 'none' && profile.proxy.host ? (
          <span className="text-xs font-mono text-slate-400">{profile.proxy.host}:{profile.proxy.port}</span>
        ) : (
          <span className="text-xs text-slate-600">Không</span>
        )}
      </td>

      {/* Status */}
      <td className="py-3 pr-4">
        {isRunning ? (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Mở
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Đóng
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleLaunch}
            className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
              isRunning
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                : 'btn-primary text-white px-3 py-1 rounded-lg text-xs'
            }`}
          >
            {isRunning ? 'Đóng' : 'Mở'}
          </button>
          <button
            onClick={() => setShowCookies(true)}
            className="text-xs px-2 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            title="Cookies"
          >
            🍪
          </button>
          <button
            onClick={() => onEdit(profile)}
            className="text-xs px-2 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Sửa
          </button>
          <button
            onClick={handleDelete}
            className="text-xs px-2 py-1 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            Xóa
          </button>
        </div>
      </td>
      
      {showCookies && <CookieManager profileId={profile.id} onClose={() => setShowCookies(false)} />}
    </tr>
  )
}

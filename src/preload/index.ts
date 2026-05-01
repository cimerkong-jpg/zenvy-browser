import { contextBridge, ipcRenderer } from 'electron'
import type { Profile, Group } from '../shared/types'

const api = {
  groups: {
    getAll: (): Promise<Group[]> => ipcRenderer.invoke('groups:getAll'),
    create: (name: string): Promise<Group> => ipcRenderer.invoke('groups:create', name),
    update: (id: string, name: string): Promise<Group | null> =>
      ipcRenderer.invoke('groups:update', id, name),
    delete: (id: string): Promise<void> => ipcRenderer.invoke('groups:delete', id)
  },
  profiles: {
    getAll: (): Promise<Profile[]> => ipcRenderer.invoke('profiles:getAll'),
    create: (data: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<Profile> =>
      ipcRenderer.invoke('profiles:create', data),
    update: (id: string, data: Partial<Profile>): Promise<Profile | null> =>
      ipcRenderer.invoke('profiles:update', id, data),
    delete: (id: string): Promise<void> => ipcRenderer.invoke('profiles:delete', id),
    deleteMany: (ids: string[]): Promise<void> => ipcRenderer.invoke('profiles:deleteMany', ids)
  },
  browser: {
    launch: (profile: Profile): Promise<{ success: boolean; error?: string }> =>
      ipcRenderer.invoke('browser:launch', profile),
    close: (profileId: string): Promise<void> => ipcRenderer.invoke('browser:close', profileId),
    running: (): Promise<string[]> => ipcRenderer.invoke('browser:running')
  }
}

contextBridge.exposeInMainWorld('api', api)

export type ZenvyAPI = typeof api

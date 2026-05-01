export type ProfileStatus = 'open' | 'closed'

export type ProxyType = 'none' | 'http' | 'socks5'

export interface Proxy {
  type: ProxyType
  host: string
  port: string
  username: string
  password: string
}

export interface Fingerprint {
  os: 'Windows' | 'macOS' | 'Linux'
  userAgent: string
  timezone: string
  language: string
  screenWidth: number
  screenHeight: number
  hardwareConcurrency: number
  deviceMemory: number
  webRTC: 'disabled' | 'real'
  canvas: 'noise' | 'real'
  webGL: 'noise' | 'real'
  deviceName: string
  macAddress: string
}

export interface Profile {
  id: string
  name: string
  groupId: string | null
  notes: string
  status: ProfileStatus
  proxy: Proxy
  fingerprint: Fingerprint
  cookies: string
  createdAt: number
  updatedAt: number
}

export interface Group {
  id: string
  name: string
  createdAt: number
}

export interface StoreSchema {
  profiles: Profile[]
  groups: Group[]
}

export type IpcResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

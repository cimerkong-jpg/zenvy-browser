import { app } from 'electron'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { randomBytes } from 'crypto'
import type { StoreSchema, Profile, Group } from '../shared/types'

// Generate UUID without external dependency
function uuidv4(): string {
  return randomBytes(16).toString('hex').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')
}

function getDbPath(): string {
  const dir = app.getPath('userData')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return join(dir, 'zenvy-data.json')
}

function read(): StoreSchema {
  const path = getDbPath()
  if (!existsSync(path)) return { profiles: [], groups: [] }
  try {
    return JSON.parse(readFileSync(path, 'utf-8'))
  } catch {
    return { profiles: [], groups: [] }
  }
}

function write(data: StoreSchema): void {
  writeFileSync(getDbPath(), JSON.stringify(data, null, 2), 'utf-8')
}

// ── Groups ──────────────────────────────────────────────────────────────────

export function getGroups(): Group[] {
  return read().groups
}

export function createGroup(name: string): Group {
  const data = read()
  const group: Group = { id: uuidv4(), name, createdAt: Date.now() }
  data.groups.push(group)
  write(data)
  return group
}

export function updateGroup(id: string, name: string): Group | null {
  const data = read()
  const idx = data.groups.findIndex((g) => g.id === id)
  if (idx === -1) return null
  data.groups[idx] = { ...data.groups[idx], name }
  write(data)
  return data.groups[idx]
}

export function deleteGroup(id: string): void {
  const data = read()
  data.groups = data.groups.filter((g) => g.id !== id)
  data.profiles = data.profiles.map((p) => (p.groupId === id ? { ...p, groupId: null } : p))
  write(data)
}

// ── Profiles ─────────────────────────────────────────────────────────────────

export function getProfiles(): Profile[] {
  return read().profiles
}

export function createProfile(data: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Profile {
  const db = read()
  const profile: Profile = { ...data, id: uuidv4(), createdAt: Date.now(), updatedAt: Date.now() }
  db.profiles.push(profile)
  write(db)
  return profile
}

export function updateProfile(id: string, data: Partial<Omit<Profile, 'id' | 'createdAt'>>): Profile | null {
  const db = read()
  const idx = db.profiles.findIndex((p) => p.id === id)
  if (idx === -1) return null
  db.profiles[idx] = { ...db.profiles[idx], ...data, updatedAt: Date.now() }
  write(db)
  return db.profiles[idx]
}

export function deleteProfile(id: string): void {
  const db = read()
  db.profiles = db.profiles.filter((p) => p.id !== id)
  write(db)
}

export function deleteProfiles(ids: string[]): void {
  const db = read()
  db.profiles = db.profiles.filter((p) => !ids.includes(p.id))
  write(db)
}

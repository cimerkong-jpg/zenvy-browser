import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import * as db from './db'
import * as browser from './browser'
import * as cookies from './cookies'
import type { Profile } from '../shared/types'
import type { Cookie } from './cookies'

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string
declare const MAIN_WINDOW_VITE_NAME: string

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1000,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0D0B1A',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.on('ready-to-show', () => win.show())

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    const loadWithRetry = (retries = 5, delay = 1000) => {
      win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL).catch((err) => {
        if (retries > 0) {
          console.log(`Retrying to load Vite dev server... (${retries} attempts left)`)
          setTimeout(() => loadWithRetry(retries - 1, delay), delay)
        } else {
          console.error('Failed to load Vite dev server after multiple attempts:', err)
        }
      })
    }
    loadWithRetry()
  } else {
    win.loadFile(join(__dirname, '../renderer/main_window/index.html'))
  }
}

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const windows = BrowserWindow.getAllWindows()
    if (windows.length > 0) {
      const win = windows[0]
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
}

app.whenReady().then(() => {
  app.setAppUserModelId('com.zenvy.browser')

  // ── Group handlers ───────────────────────────────────────────────────────
  ipcMain.handle('groups:getAll', () => db.getGroups())
  ipcMain.handle('groups:create', (_, name: string) => db.createGroup(name))
  ipcMain.handle('groups:update', (_, id: string, name: string) => db.updateGroup(id, name))
  ipcMain.handle('groups:delete', (_, id: string) => db.deleteGroup(id))

  // ── Profile handlers ─────────────────────────────────────────────────────
  ipcMain.handle('profiles:getAll', () => db.getProfiles())
  ipcMain.handle('profiles:create', (_, data: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>) =>
    db.createProfile(data)
  )
  ipcMain.handle('profiles:update', (_, id: string, data: Partial<Profile>) =>
    db.updateProfile(id, data)
  )
  ipcMain.handle('profiles:delete', (_, id: string) => db.deleteProfile(id))
  ipcMain.handle('profiles:deleteMany', (_, ids: string[]) => db.deleteProfiles(ids))

  // ── Browser handlers ─────────────────────────────────────────────────────
  ipcMain.handle('browser:launch', (_, profile: Profile) => browser.launchProfile(profile))
  ipcMain.handle('browser:close', (_, profileId: string) => browser.closeProfile(profileId))
  ipcMain.handle('browser:running', () => browser.getRunningProfiles())

  // ── Cookie handlers ──────────────────────────────────────────────────────
  ipcMain.handle('cookies:get', (_, profileId: string) => cookies.getCookies(profileId))
  ipcMain.handle('cookies:set', (_, profileId: string, cookie: Cookie) => cookies.setCookie(profileId, cookie))
  ipcMain.handle('cookies:delete', (_, profileId: string, domain: string, name: string) => 
    cookies.deleteCookie(profileId, domain, name)
  )
  ipcMain.handle('cookies:clear', (_, profileId: string) => cookies.clearCookies(profileId))
  
  ipcMain.handle('cookies:import', async (_, profileId: string) => {
    const result = await dialog.showOpenDialog({
      title: 'Import Cookies',
      filters: [{ name: 'Cookie Files', extensions: ['txt'] }],
      properties: ['openFile']
    })
    if (result.canceled || !result.filePaths[0]) return null
    return cookies.importCookies(profileId, result.filePaths[0])
  })
  
  ipcMain.handle('cookies:export', async (_, profileId: string) => {
    const result = await dialog.showSaveDialog({
      title: 'Export Cookies',
      defaultPath: 'cookies.txt',
      filters: [{ name: 'Cookie Files', extensions: ['txt'] }]
    })
    if (result.canceled || !result.filePath) return false
    cookies.exportCookies(profileId, result.filePath)
    return true
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

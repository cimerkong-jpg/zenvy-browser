import { readFileSync } from 'fs'
import { join } from 'path'
import type { Fingerprint, Proxy } from '../shared/types'

export interface ProfileTemplate {
  name: string
  description: string
  icon: string
  fingerprint: Fingerprint
  proxy: Proxy
}

const TEMPLATE_FILES = [
  'facebook.json',
  'google.json',
  'amazon.json',
  'tiktok.json',
  'instagram.json'
]

// Get templates directory path
function getTemplatesDir(): string {
  // In development: resources/templates
  // In production: app.asar/resources/templates
  return join(__dirname, '../../resources/templates')
}

// Load all built-in templates
export function getTemplates(): ProfileTemplate[] {
  const templates: ProfileTemplate[] = []
  const templatesDir = getTemplatesDir()
  
  for (const file of TEMPLATE_FILES) {
    try {
      const filePath = join(templatesDir, file)
      const content = readFileSync(filePath, 'utf-8')
      const template = JSON.parse(content) as ProfileTemplate
      templates.push(template)
    } catch (error) {
      console.error(`Failed to load template ${file}:`, error)
    }
  }
  
  return templates
}

// Get template by name
export function getTemplate(name: string): ProfileTemplate | null {
  const templates = getTemplates()
  return templates.find(t => t.name.toLowerCase() === name.toLowerCase()) || null
}

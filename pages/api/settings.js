// pages/api/settings.js
import fs from 'fs'
import path from 'path'
import { requireAuth } from '../../utils/auth'

// Simple file-based storage for settings
// In production, you'd use a database
const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json')

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Default settings
const DEFAULT_SETTINGS = {
  companyName: 'OnlyInTX',
  email: 'onlyintx2024@gmail.com',
  phone: '+1 (555) 123-4567',
  address: '123 Texas St, Austin, TX 78701',
  sendAutomaticMessages: true,
  enableNotifications: true,
  currency: 'USD',
  timezone: 'America/Chicago',
  updatedAt: new Date().toISOString()
}

// Load settings from file
const loadSettings = () => {
  try {
    ensureDataDir()
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf8')
      return JSON.parse(data)
    }
    return DEFAULT_SETTINGS
  } catch (error) {
    console.error('Error loading settings:', error)
    return DEFAULT_SETTINGS
  }
}

// Save settings to file
const saveSettings = (settings) => {
  try {
    ensureDataDir()
    const updatedSettings = {
      ...settings,
      updatedAt: new Date().toISOString()
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updatedSettings, null, 2))
    return updatedSettings
  } catch (error) {
    console.error('Error saving settings:', error)
    throw new Error('Failed to save settings')
  }
}

export default requireAuth(async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        // Get current settings
        const settings = loadSettings()
        return res.status(200).json(settings)

      case 'POST':
      case 'PUT':
        // Update settings
        const currentSettings = loadSettings()
        const updatedSettings = {
          ...currentSettings,
          ...req.body
        }
        
        const savedSettings = saveSettings(updatedSettings)
        return res.status(200).json({
          message: 'Settings saved successfully',
          settings: savedSettings
        })

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Settings API Error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    })
  }
})
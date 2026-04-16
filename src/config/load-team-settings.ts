import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { TeamSettings } from '../types.js'

export function loadTeamSettings(root = process.cwd()): TeamSettings {
  const file = path.join(root, 'config', 'team-settings.json')
  return JSON.parse(readFileSync(file, 'utf8')) as TeamSettings
}

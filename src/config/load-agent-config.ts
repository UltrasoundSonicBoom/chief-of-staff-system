import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { TeamMemberConfig } from '../types.js'

export function loadAgentConfig(key: string, root = process.cwd()): TeamMemberConfig {
  const file = path.join(root, 'config', 'agents', `${key}.json`)
  return JSON.parse(readFileSync(file, 'utf8')) as TeamMemberConfig
}

export function loadAgentConfigs(keys: string[], root = process.cwd()): TeamMemberConfig[] {
  return keys.map((key) => loadAgentConfig(key, root))
}

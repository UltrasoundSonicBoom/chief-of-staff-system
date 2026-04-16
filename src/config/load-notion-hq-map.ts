import path from 'node:path'
import { readFileSync } from 'node:fs'

type HqMap = {
  hq: Record<string, unknown>
  domains: Record<string, unknown>
  agent_context: Record<string, string[]>
}

export function loadNotionHqMap(root = process.cwd()): HqMap {
  const file = path.join(root, 'config', 'notion-hq-map.json')
  return JSON.parse(readFileSync(file, 'utf8')) as HqMap
}

export function getAgentContextTargets(agentName: string, root = process.cwd()): string[] {
  const map = loadNotionHqMap(root)
  return map.agent_context[agentName] ?? []
}

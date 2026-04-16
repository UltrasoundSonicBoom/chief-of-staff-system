import { buildChiefOfStaffTeam } from './build-chief-of-staff-team.js'
import { loadAgentConfigs } from '../config/load-agent-config.js'
import type { AgentConfig } from '@jackchen_me/open-multi-agent'

const SQUADS = {
  executive: [
    'chief-of-staff-agent',
    'finance-agent',
    'family-operations-agent',
    'krta-strategy-agent',
    'professional-strategy-agent',
  ],
  daily: [
    'chief-of-staff-agent',
    'finance-agent',
    'family-operations-agent',
    'krta-strategy-agent',
  ],
  weekly: [
    'chief-of-staff-agent',
    'finance-agent',
    'family-operations-agent',
    'home-purchasing-agent',
    'professional-strategy-agent',
    'krta-strategy-agent',
    'venture-studio-agent',
    'device-security-infra-agent',
  ],
} as const

function toAgentConfig(config: {
  name: string
  provider: 'anthropic' | 'openai'
  model: string
  systemPrompt: string
  tools?: string[]
  maxTurns?: number
}): AgentConfig {
  return {
    name: config.name,
    provider: config.provider,
    model: config.model,
    systemPrompt: config.systemPrompt,
    tools: config.tools,
    maxTurns: config.maxTurns ?? 6,
    temperature: 0.2,
  }
}

export function buildSquad(name: keyof typeof SQUADS) {
  const { orchestrator } = buildChiefOfStaffTeam()
  const configs = loadAgentConfigs([...SQUADS[name]]).map(toAgentConfig)
  const team = orchestrator.createTeam(`cos-${name}`, {
    name: `cos-${name}`,
    agents: configs,
    sharedMemory: true,
    maxConcurrency: 3,
  })

  return { orchestrator, team }
}

export type SquadName = keyof typeof SQUADS

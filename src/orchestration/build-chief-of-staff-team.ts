import { OpenMultiAgent } from '@jackchen_me/open-multi-agent'
import type { AgentConfig, OrchestratorEvent } from '@jackchen_me/open-multi-agent'
import { loadTeamSettings } from '../config/load-team-settings.js'
import { loadAgentConfigs } from '../config/load-agent-config.js'

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

function handleProgress(event: OrchestratorEvent): void {
  const label = `[${event.type}]`
  const scope = event.agent ?? event.task ?? ''
  console.log(`${label} ${scope}`.trim())
}

export function buildChiefOfStaffTeam() {
  const settings = loadTeamSettings()
  const selected = [
    'chief-of-staff-agent',
    'finance-agent',
    'family-operations-agent',
    'krta-strategy-agent',
  ]
  const configs = loadAgentConfigs(selected).map(toAgentConfig)

  const orchestrator = new OpenMultiAgent({
    defaultModel: 'claude-sonnet-4-6',
    maxConcurrency: 2,
    onProgress: handleProgress,
  })

  const team = orchestrator.createTeam(settings.team_name, {
    name: settings.team_name,
    agents: configs,
    sharedMemory: true,
    maxConcurrency: 2,
  })

  return { orchestrator, team }
}

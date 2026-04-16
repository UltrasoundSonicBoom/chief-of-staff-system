export type DomainName =
  | 'Executive'
  | 'Finance'
  | 'Family'
  | 'Home'
  | 'Professional'
  | 'KRTA'
  | 'Venture'
  | 'Infra'

export type AgentDefinition = {
  name: string
  domains: DomainName[]
  cadence: 'daily' | 'weekly' | 'monthly' | 'event-driven'
  automationMode: 'manual' | 'assisted' | 'autonomous'
  escalatesTo?: string | null
  mission: string
  inputs: string[]
  outputs: string[]
}

export type TeamSettings = {
  team_name: string
  orchestrator: string
  execution_principle: string[]
  shared_rules: Record<string, unknown>
  data_systems: Record<string, string>
  agents: Array<{
    name: string
    domain: string[]
    cadence: string
    automation_mode: string
    escalates_to: string | null
  }>
}

export type TeamMemberConfig = {
  key: string
  name: string
  provider: 'anthropic' | 'openai'
  model: string
  systemPrompt: string
  tools?: string[]
  maxTurns?: number
}

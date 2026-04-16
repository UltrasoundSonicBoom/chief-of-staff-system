import { buildChiefOfStaffTeam } from './orchestration/build-chief-of-staff-team.js'
import { buildSquad } from './orchestration/build-squads.js'

async function runGoal(kind: 'core' | 'daily' | 'weekly') {
  const bundle = kind === 'core'
    ? buildChiefOfStaffTeam()
    : buildSquad(kind)

  const { orchestrator, team } = bundle

  console.log(`Bootstrapping team: ${team.name}`)
  console.log(`Agents: ${team.getAgents().map((agent) => agent.name).join(', ')}`)

  const goalMap = {
    core: [
      'Read the shared operating context and produce an executive bootstrap brief.',
      'Identify the top priority across finance, family, and KRTA.',
      'Return a short summary plus 3 next actions.',
    ].join(' '),
    daily: [
      'Act like the daily chief-of-staff squad.',
      'Read finance, family, KRTA, and executive context.',
      'Produce today\'s top 3, one major risk, and one thing to defer.',
    ].join(' '),
    weekly: [
      'Act like the weekly chief-of-staff squad.',
      'Review finance, family, home, professional, KRTA, venture, and infra priorities.',
      'Return a weekly rebalance summary, top risks, and next strategic actions.',
    ].join(' '),
  } as const

  const result = await orchestrator.runTeam(team, goalMap[kind])

  console.log('\n=== TEAM RESULT ===')
  console.log(`success: ${result.success}`)
  console.log(`tokens: in=${result.totalTokenUsage.input_tokens} out=${result.totalTokenUsage.output_tokens}`)

  for (const [name, agentResult] of result.agentResults) {
    console.log(`\n--- ${name} ---`)
    console.log(agentResult.output.slice(0, 1000))
  }
}

const kindArg = (process.argv[2] as 'core' | 'daily' | 'weekly' | undefined) ?? 'core'
runGoal(kindArg).catch((error) => {
  console.error(error)
  process.exit(1)
})
